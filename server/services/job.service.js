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
 * SIMPLE QUERY OPTIMIZATION
 * =====================================================
 */

function simplifyQuery(query) {

  if (!query) {
    return "software developer";
  }

  /**
   * Adzuna India works BEST
   * with short generic queries
   */
  return query
    .split(" ")
    .slice(0, 2)
    .join(" ");
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
          simplifyQuery(query);

        console.log(
          `📡 [Attempt ${attempt + 1}] Fetching jobs for: ${simplifiedQuery}`
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

    "react",
    "next.js",
    "node",
    "express",
    "mongodb",

    "javascript",
    "typescript",

    "python",
    "django",

    "java",
    "spring",

    "sql",
    "postgresql",

    "docker",
    "aws",

    "git",
    "redis",

    "html",
    "css",
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