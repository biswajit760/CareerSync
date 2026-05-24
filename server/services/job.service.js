const axios = require("axios");

const ADZUNA_ID =
  process.env.ADZUNA_APP_ID;

const ADZUNA_KEY =
  process.env.ADZUNA_APP_KEY;

/**
 * =====================================================
 * CAREERSYNC - STABLE JOB FETCHING SERVICE
 * =====================================================
 */

const MAX_RETRIES = 2;
const RETRY_DELAY = 1200;

/**
 * =====================================================
 * SLEEP
 * =====================================================
 */

const sleep = (ms) =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  );

/**
 * =====================================================
 * INTELLIGENT QUERY OPTIMIZATION
 * =====================================================
 * Extracts 2-4 most important keywords from query
 * Priority: Seniority > Tech Stack > Role > Specialization
 */

function simplifyQuery(query, seniority) {

  if (!query) {
    return "software developer";
  }

  /**
   * EXTRACT IMPORTANT KEYWORDS
   */
  const keywords = extractKeywords(query, seniority);

  /**
   * BUILD OPTIMIZED QUERY (2-4 words)
   */
  const optimized = keywords.slice(0, 4).join(" ");

  /**
   * FALLBACK: Ensure minimum quality
   */
  return optimized.length > 3 ? optimized : "software developer";
}

/**
 * =====================================================
 * KEYWORD EXTRACTION
 * =====================================================
 * Intelligently extracts important terms from query
 */
function extractKeywords(query, seniority) {

  const words = query.toLowerCase().split(" ").filter(w => w.length > 1);
  const important = [];

  /**
   * PRIORITY 1: SENIORITY
   * Only include Senior/Lead/Principal (skip Fresher/Junior)
   */
  const seniorityTerms = ['senior', 'lead', 'principal', 'staff', 'chief'];
  const hasSeniority = words.find(w => seniorityTerms.includes(w));
  
  if (hasSeniority) {
    important.push(hasSeniority);
  } else if (seniority && ['Senior', 'Lead', 'Principal'].includes(seniority)) {
    important.push(seniority.toLowerCase());
  }

  /**
   * PRIORITY 2: TECH STACK
   * Preserve specific technologies
   */
  const techStacks = [
    'mern', 'mean', 'lamp',
    'react', 'reactjs', 'react.js',
    'node', 'nodejs', 'node.js',
    'angular', 'vue', 'svelte',
    'python', 'django', 'flask',
    'java', 'spring', 'springboot',
    'php', 'laravel',
    'dotnet', '.net', 'c#',
    'golang', 'go', 'rust',
    'next', 'nextjs', 'next.js',
    'express', 'nestjs',
  ];

  const hasTech = words.find(w => techStacks.includes(w));
  if (hasTech && !important.includes(hasTech)) {
    important.push(hasTech);
  }

  /**
   * PRIORITY 3: SPECIALIZATION
   * Frontend, Backend, Full Stack, etc.
   */
  const specializations = [
    'frontend', 'front-end',
    'backend', 'back-end',
    'fullstack', 'full-stack',
    'full stack',  // Added: two-word phrase
    'devops', 'sre',
    'mobile', 'android', 'ios',
    'data', 'ml', 'ai',
  ];

  // Check for multi-word specializations first
  const queryLower = query.toLowerCase();
  if (queryLower.includes('full stack') && important.length < 3) {
    important.push('full');
    important.push('stack');
  } else {
    const hasSpec = words.find(w => specializations.includes(w));
    if (hasSpec && !important.includes(hasSpec) && important.length < 3) {
      important.push(hasSpec);
    }
  }

  /**
   * PRIORITY 4: ROLE
   * Developer, Engineer, Designer, etc.
   */
  const roles = [
    'developer', 'engineer', 'programmer',
    'designer', 'architect', 'analyst',
    'manager', 'consultant', 'specialist',
  ];

  const hasRole = words.find(w => roles.includes(w));
  if (hasRole && !important.includes(hasRole) && important.length < 4) {
    important.push(hasRole);
  }

  /**
   * FALLBACK: If no keywords extracted, use first 2-3 words
   */
  if (important.length === 0) {
    return words.slice(0, 3);
  }

  return important;
}

/**
 * =====================================================
 * FETCH JOBS
 * =====================================================
 */

exports.fetchJobsFromAdzuna =
  async (query, seniority) => {

    let lastError;

    for (
      let attempt = 0;
      attempt <= MAX_RETRIES;
      attempt++
    ) {

      try {

        const simplifiedQuery =
          simplifyQuery(query, seniority);

        console.log(
          `📡 [Attempt ${attempt + 1}] Fetching jobs for: "${simplifiedQuery}" (Original: "${query}")`
        );

        /**
         * INDIA ENDPOINT
         */
        const url =
          "https://api.adzuna.com/v1/api/jobs/in/search/1";

        const response =
          await axios.get(url, {

            params: {

              app_id:
                ADZUNA_ID?.trim(),

              app_key:
                ADZUNA_KEY?.trim(),

              what:
                simplifiedQuery,

              results_per_page: 50,
              max_days_old: 120,
            },

            timeout: 10000,
          });

        /**
         * SAFETY
         */
        if (
          !response.data
          ||
          !response.data.results
        ) {

          console.log(
            "⚠️ No Adzuna results"
          );

          return [];
        }

        /**
         * NORMALIZE
         */
        const normalized =
          response.data.results
            .map(job =>
              normalizeAdzunaJob(job)
            )
            .filter(Boolean);

        

        return normalized;

      } catch (error) {

        lastError = error;

        console.error(
          `❌ Adzuna Attempt ${attempt + 1} Failed:`,
          error.response?.status
          ||
          error.message
        );

        if (attempt < MAX_RETRIES) {

          const delay =
            RETRY_DELAY *
            Math.pow(2, attempt);

          

          await sleep(delay);
        }
      }
    }

    console.error(
      "❌ Adzuna completely failed:",
      lastError?.message
    );

    return [];
};



/**
 * =====================================================
 * NORMALIZATION
 * =====================================================
 */
function normalizeAdzunaJob(job) {
  try {
    /**
     * TITLE
     */
    const title =
      typeof job.title === "string"
        ? job.title.replace(/<\/?[^>]+(>|$)/g, "").trim()
        : "Untitled Role";

    /**
     * COMPANY
     */
    const company = job.company?.display_name || "Unknown Company";

    /**
     * LOCATION
     */
    const location = job.location?.display_name || "India";

    /**
     * SALARY
     */
    let salary = "Not Disclosed";
    if (job.salary_min && typeof job.salary_min === "number") {
      salary = `₹${Math.round(job.salary_min).toLocaleString("en-IN")}`;
      if (job.salary_max) {
        salary += ` - ₹${Math.round(job.salary_max).toLocaleString("en-IN")}`;
      }
    }

    /**
     * POSTED DATE
     */
    const createdDate = job.created ? new Date(job.created) : new Date();
    const posted = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString("en-IN")
      : "Recently";

    /**
     * DESCRIPTION
     */
    const description = String(job.description || "No description available")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 1200);

    /**
     * STACK DETECTION
     * Essential for the Explainability Layer in jobRecommendation.service.js
     */
    const textForStack = `${title} ${description}`.toLowerCase();
    let detectedStack = "general";

    if (
      textForStack.includes("react") ||
      textForStack.includes("node") ||
      textForStack.includes("express") ||
      textForStack.includes("mongodb") ||
      textForStack.includes("next")
    ) {
      detectedStack = "mern";
    } else if (textForStack.includes("python") || textForStack.includes("django")) {
      detectedStack = "python";
    } else if (textForStack.includes("java") || textForStack.includes("spring")) {
      detectedStack = "java";
    } else if (textForStack.includes("php") || textForStack.includes("laravel")) {
      detectedStack = "php";
    } else if (textForStack.includes(".net") || textForStack.includes("c#")) {
      detectedStack = "dotnet";
    }

    /**
     * EXPERIENCE EXTRACTION
     * Extract required experience from job description
     */
    const experienceRequired = extractExperienceRange(description);

    /**
     * RETURN NORMALIZED OBJECT
     */
    return {
      /**
       * NEW CACHE ARCHITECTURE
       */
      externalJobId: String(job.id),

      title,

      company,

      location,

      description,

      /**
       * URL
       * FIXED: Changed from applyUrl to link to ensure consistency 
       * with the jobCache.service.js mapping.
       */
      link: job.redirect_url,

      /**
       * INFO
       */
      salary,

      salaryMin: job.salary_min || 0,

      salaryMax: job.salary_max || 0,

      source: "Adzuna",

      posted,

      postedDate: createdDate,

      /**
       * INTELLIGENCE
       */
      detectedStack,

      jobType: job.contract_type || "Full-Time",

      requirements: parseRequirements(description),

      /**
       * EXPERIENCE REQUIREMENT
       * Extracted from job description
       * Example: { min: 0, max: 2, type: 'range' }
       */
      experienceRequired,

      metadata: {
        provider: "adzuna",
        category: job.category?.label || "",
      },
    };
  } catch (error) {
    console.error("❌ Normalization failed:", error.message);
    return null;
  }
}

/**
 * =====================================================
 * EXPERIENCE RANGE EXTRACTION
 * =====================================================
 * Extracts experience requirements from job description
 * Examples: "0-2 years", "3-5 years", "Freshers welcome"
 */

function extractExperienceRange(description) {
  
  if (!description) {
    return null;
  }

  const text = description.toLowerCase();

  /**
   * PATTERN 1: Range format "X-Y years"
   * Examples: "0-2 years", "3-5 years", "2-4 yrs", "3 to 5 years"
   */
  const rangeMatch = text.match(/(\d+)\s*(?:[-–—]|to)\s*(\d+)\s*(?:years?|yrs?)/i);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2]),
      type: 'range'
    };
  }

  /**
   * PATTERN 2: Minimum format "X+ years" or "minimum X years"
   * Examples: "5+ years", "minimum 3 years", "at least 2 years"
   */
  const minMatch = text.match(/(?:minimum|min|at\s*least|(\d+)\s*\+)\s*(\d+)?\s*(?:years?|yrs?)/i);
  if (minMatch) {
    const years = parseInt(minMatch[1] || minMatch[2]);
    if (!isNaN(years)) {
      return {
        min: years,
        max: years + 5,  // Assume +5 years range
        type: 'minimum'
      };
    }
  }

  /**
   * PATTERN 3: Exact years "X years"
   * Examples: "2 years experience", "3 years required"
   */
  const exactMatch = text.match(/(?:^|\s)(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  if (exactMatch) {
    const years = parseInt(exactMatch[1]);
    return {
      min: Math.max(0, years - 1),
      max: years + 1,
      type: 'exact'
    };
  }

  /**
   * PATTERN 4: Experience level keywords
   * Examples: "3+ years of experience", "5 years experience required"
   */
  const expLevelMatch = text.match(/(\d+)\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)(?:\s*required)?/i);
  if (expLevelMatch) {
    const years = parseInt(expLevelMatch[1]);
    return {
      min: years,
      max: years + 3,
      type: 'minimum'
    };
  }

  /**
   * PATTERN 5: Fresher-specific keywords
   * Examples: "Freshers welcome", "Fresher", "0-1 year", "entry level"
   */
  if (
    text.includes('fresher') ||
    text.includes('fresh graduate') ||
    text.includes('entry level') ||
    text.includes('entry-level') ||
    text.match(/0\s*(?:[-–—]|to)\s*1\s*(?:year|yr)/i)
  ) {
    return {
      min: 0,
      max: 1,
      type: 'fresher'
    };
  }

  /**
   * NO EXPERIENCE REQUIREMENT FOUND
   */
  return null;
}

/**
 * =====================================================
 * REQUIREMENTS PARSER
 * =====================================================
 */

function parseRequirements(
  description
) {

  if (!description) {
    return [];
  }

  const text =
    description.toLowerCase();

  const skills = [
    // Frontend Frameworks
    "react",
    "next.js",
    "nextjs",
    "vue",
    "vue.js",
    "angular",
    "svelte",
    
    // Backend
    "node",
    "node.js",
    "nodejs",
    "express",
    "nestjs",
    "fastapi",
    "flask",
    "django",
    "spring",
    "spring boot",
    
    // Languages
    "javascript",
    "typescript",
    "python",
    "java",
    "rust",
    "c++",
    "golang",
    "go",
    "php",
    "ruby",
    "kotlin",
    
    // Databases
    "mongodb",
    "postgresql",
    "postgres",
    "mysql",
    "sql",
    "redis",
    "elasticsearch",
    "dynamodb",
    
    // GIS & Mapping (Specialized)
    "arcgis",
    "postgis",
    "geoserver",
    "qgis",
    "mapbox",
    "leaflet",
    "openlayers",
    "arcpy",
    
    // Cloud & DevOps
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "terraform",
    "ansible",
    "jenkins",
    "ci/cd",
    
    // Tools & Others
    "git",
    "github",
    "graphql",
    "rest api",
    "grpc",
    "kafka",
    "rabbitmq",
    
    // Frontend Tools
    "tailwind",
    "css",
    "html",
    "webpack",
    "vite",
  ];

  return skills.filter(skill =>
    text.includes(skill)
  );
}

/**
 * =====================================================
 * BACKUP FETCHER
 * =====================================================
 */

exports.fetchJobsFromBackup =
  async () => {
    return [];
};