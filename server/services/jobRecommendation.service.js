const Resume = require("../model/Resume");
const UserJobProfile = require("../model/UserJobProfile");

const jobCacheService = require("./jobCache.service");
const jobRankingEngine = require("./jobRanking.service");

/**
 * CAREERSYNC - CENTRAL RECOMMENDATION ENGINE
 * ==========================================
 *
 * RESPONSIBILITIES:
 * - Unified recommendation pipeline
 * - Career identity resolution
 * - Dynamic query generation
 * - Recommendation diversification
 * - Resume-specific sandbox matching
 * - Confidence-aware ranking
 * - SaaS-grade explainability
 */

class JobRecommendationService {

  constructor() {

    /**
     * STACK RELATIONS
     * Used for adjacent opportunity discovery
     */
    this.stackRelations = {
      mern: ["frontend", "javascript", "nextjs"],
      frontend: ["mern", "ui", "react"],
      backend: ["node", "api", "microservices"],
      python: ["django", "flask", "ai"],
      java: ["spring", "backend"],
      mobile: ["android", "react-native"],
    };

    /**
     * ROLE EXPANSIONS
     * Used for intelligent job fetching
     */
    this.roleExpansionMap = {
      "frontend developer": [
        "React Developer",
        "Frontend Engineer",
        "UI Developer"
      ],

      "backend developer": [
        "Node.js Developer",
        "Backend Engineer",
        "API Developer"
      ],

      "full stack developer": [
        "MERN Developer",
        "Software Engineer",
        "Full Stack Engineer"
      ],

      "software engineer": [
        "Software Developer",
        "Full Stack Developer",
        "Application Developer"
      ]
    };
  }

  /**
   * =========================================================
   * MAIN ENTRY POINT
   * =========================================================
   */

  async getRecommendations({
    userId,
    resumeId = null,
    forceRefresh = false,
  }) {

    /**
     * STEP 1
     * BUILD CONTEXT
     */
    const context = await this._buildRecommendationContext({
      userId,
      resumeId,
    });

    /**
     * STEP 2
     * GENERATE QUERIES
     */
    const queries = this._generateQueries(context);

    /**
     * STEP 3
     * FETCH JOBS
     */
    const jobs = await this._fetchJobs(
      queries,
      context,
      forceRefresh
    );

    /**
     * STEP 4
     * RANK JOBS
     */
    const rankedJobs =
      await this._rankJobs(
        jobs,
        context
      );

    /**
     * STEP 5
     * DIVERSIFY RESULTS
     */
    const diversified =
      this._diversifyJobs(rankedJobs);

    /**
     * STEP 6
     * ENRICH EXPLAINABILITY
     */
    const explained =
      this._addExplainability(
        diversified,
        context
      );

    return {
      jobs: explained,

      metadata: {
        totalFetched: jobs.length,
        finalCount: explained.length,

        dominantRole:
          context.careerIdentity.dominantRole,

        dominantStack:
          context.careerIdentity.dominantStack,

        recommendationType:
          resumeId
            ? "resume-specific"
            : "global-profile",

        generatedQueries: queries,
      }
    };
  }

  /**
   * =========================================================
   * BUILD RECOMMENDATION CONTEXT
   * =========================================================
   */

  async _buildRecommendationContext({
    userId,
    resumeId
  }) {

    /**
     * RESUME-SPECIFIC MODE
     */
    if (resumeId) {

      const resume =
        await Resume.findById(resumeId);

      if (!resume) {
        throw new Error("Resume not found");
      }

      const extracted =
        resume.extractedIntelligence ||
        resume.extractedProfile;

      return {
        type: "resume",

        profile: {
          primaryRole:
            extracted.role,

          primaryStack:
            extracted.primaryStack || "general",

          seniority:
            extracted.seniority || "Fresher",

          yearsOfExperience:
            extracted.yearsOfExperience ||
            extracted.yearsOfExp ||
            0,

          skills:
            (extracted.skills || []).map(skill => ({
              name:
                typeof skill === "string"
                  ? skill
                  : skill.canonical || skill.displayName
            }))
        },

        careerIdentity: {
          dominantRole:
            extracted.role,

          dominantStack:
            extracted.primaryStack || "general",

          confidence: 0.90,

          explorationRoles: [],
        }
      };
    }

    /**
     * GLOBAL PROFILE MODE
     */
    const profile =
      await UserJobProfile.findOne({ userId });

    if (!profile) {
      throw new Error("User profile not found");
    }

    /**
     * CAREER IDENTITY RESOLUTION
     */
    const identity =
      this._resolveCareerIdentity(profile);

    return {
      type: "global",

      profile,

      careerIdentity: identity,
    };
  }

  /**
   * =========================================================
   * CAREER IDENTITY RESOLUTION
   * =========================================================
   */

  _resolveCareerIdentity(profile) {

    const roleFrequency = {};

    /**
     * ANALYSIS HISTORY WEIGHTING
     * Recent resumes matter more
     */
    (profile.analysisHistory || []).forEach(
      (entry, index) => {

        const role =
          entry.extractedRole;

        if (!role) return;

        /**
         * TEMPORAL WEIGHT
         */
        const weight =
          index + 1;

        roleFrequency[role] =
          (roleFrequency[role] || 0)
          + weight;
      }
    );

    /**
     * FIND DOMINANT ROLE
     */
    const dominantRole =
      Object.entries(roleFrequency)
        .sort((a, b) => b[1] - a[1])[0]?.[0]
      || profile.primaryRole;

    /**
     * STACK
     */
    const dominantStack =
      profile.primaryStack || "general";

    /**
     * EXPLORATION ROLES
     */
    const explorationRoles =
      Object.keys(roleFrequency)
        .filter(r => r !== dominantRole)
        .slice(0, 2);

    return {
      dominantRole,
      dominantStack,

      explorationRoles,

      confidence:
        Math.min(
          1,
          (profile.resumeCount || 1) / 5
        ),
    };
  }

  /**
   * =========================================================
   * QUERY GENERATION
   * =========================================================
   */

  _generateQueries(context) {

    const role =
      context.careerIdentity.dominantRole
        ?.toLowerCase()
      || "software developer";

    const queries = new Set();

    /**
     * PRIMARY ROLE
     */
    queries.add(
      context.careerIdentity.dominantRole
    );

    /**
     * ROLE EXPANSIONS
     */
    const expansions =
      this.roleExpansionMap[role] || [];

    expansions.forEach(q => queries.add(q));

    /**
     * EXPLORATION ROLES
     */
    context.careerIdentity
      .explorationRoles
      ?.forEach(role => queries.add(role));

    return Array.from(queries)
      .slice(0, 5);
  }

  /**
   * =========================================================
   * FETCH JOBS
   * =========================================================
   */

  async _fetchJobs(
  queries,
  context,
  forceRefresh
) {

  /**
   * FETCH ALL QUERIES IN PARALLEL
   */
  const jobsArrays = await Promise.all(
    queries.map(query =>
      jobCacheService.getJobsWithCache(
        query,
        context.profile.seniority,
        forceRefresh
      )
    )
  );

  /**
   * FLATTEN ARRAY
   */
  const allJobs = jobsArrays.flat();

  /**
   * DEDUPLICATION
   */
  const uniqueMap = new Map();

  allJobs.forEach(job => {

    const key =
      job.externalJobId ||
      job.jobId ||
      job.id ||
      `${(job.title || "unknown").toLowerCase().trim()}-${(job.company || "unknown").toLowerCase().trim()}-${(job.location || "unknown").toLowerCase().trim()}`;

    // Skip deduplication for jobs with completely missing identity
    if (key === "unknown-unknown-unknown" || !uniqueMap.has(key)) {
      uniqueMap.set(key, job);
    }
  });
  return Array.from(uniqueMap.values());
}

  /**
   * =========================================================
   * RANK JOBS
   * =========================================================
   */

  async _rankJobs(
  jobs,
  context
) {

  const ranked =
    jobRankingEngine.rankJobs(
      context.profile,
      jobs
    );

  /**
   * FRESHNESS BOOST
   */
  ranked.forEach(job => {

    const createdAt =
      new Date(
        job.createdAt ||
        job.postedAt ||
        job.created ||
        Date.now()
      );

    const ageInDays =
      (Date.now() - createdAt.getTime())
      / (1000 * 60 * 60 * 24);

    let freshnessBoost = 0;

    /**
     * BOOST RECENT JOBS
     */
    if (ageInDays <= 1) {
      freshnessBoost = 12;
    }
    else if (ageInDays <= 3) {
      freshnessBoost = 8;
    }
    else if (ageInDays <= 7) {
      freshnessBoost = 5;
    }
    else if (ageInDays <= 14) {
      freshnessBoost = 2;
    }

    job.matchScore =
      Math.min(
        100,
        (job.matchScore || 0)
        + freshnessBoost
      );
  });

  /**
   * RE-SORT AFTER BOOST
   */
  ranked.sort(
    (a, b) =>
      (b.matchScore || 0)
      - (a.matchScore || 0)
  );

  return ranked;
}

  /**
   * =========================================================
   * DIVERSIFICATION
   * =========================================================
   */

  _diversifyJobs(jobs = []) {

    const diversified = [];

    const seenCompanies =
      new Set();

    const seenTitles =
      new Set();

    for (const job of jobs) {

      const company =
        job.company?.toLowerCase();

      const title =
        job.title?.toLowerCase();

      /**
       * AVOID DUPLICATES
       */
      if (
        seenCompanies.has(company)
        &&
        seenTitles.has(title)
      ) {
        continue;
      }

      diversified.push(job);

      seenCompanies.add(company);
      seenTitles.add(title);

      if (diversified.length >= 50) {
        break;
      }
    }

    return diversified;
  }

  /**
   * =========================================================
   * EXPLAINABILITY LAYER
   * =========================================================
   */

  _addExplainability(
    jobs,
    context
  ) {

    return jobs.map(job => {

      const reasons = [];

      const missingSkills = [];

      const userSkills =
        (context.profile.skills || [])
          .map(s =>
            (s.name || "")
              .toLowerCase()
          );

      const jobText =
        `${job.title} ${job.description}`
          .toLowerCase();

      /**
       * MATCHED SKILLS
       */
      userSkills.forEach(skill => {

        if (jobText.includes(skill)) {
          reasons.push(
            `${skill} matched`
          );
        } else {
          missingSkills.push(skill);
        }
      });

      /**
       * STACK ALIGNMENT
       */
      if (
        context.careerIdentity.dominantStack
        ===
        job.detectedStack
      ) {
        reasons.push(
          "Strong stack alignment"
        );
      }

      /**
       * EXPERIENCE
       */
      reasons.push(
        "Experience level aligned"
      );

      return {
        ...job,

        recommendationInsights: {

          reasons:
            reasons.slice(0, 4),

          missingSkills:
            missingSkills.slice(0, 5),

          confidenceScore:
            this._calculateConfidence(
              job
            ),

          recommendationType:
            this._getRecommendationType(
              job.matchScore
            )
        }
      };
    });
  }

  /**
   * =========================================================
   * CONFIDENCE
   * =========================================================
   */

  _calculateConfidence(job) {

    const score =
      job.matchScore || 0;

    if (score >= 90) return 0.95;
    if (score >= 80) return 0.88;
    if (score >= 70) return 0.80;
    if (score >= 60) return 0.70;

    return 0.55;
  }

  /**
   * =========================================================
   * RECOMMENDATION TYPE
   * =========================================================
   */

  _getRecommendationType(score) {

    if (score >= 90) {
      return "safe-match";
    }

    if (score >= 75) {
      return "strong-match";
    }

    if (score >= 60) {
      return "growth-opportunity";
    }

    return "exploration";
  }
}

module.exports =
  new JobRecommendationService();