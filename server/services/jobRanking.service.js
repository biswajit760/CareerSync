/**
 * CAREERSYNC - ADVANCED RECOMMENDATION RANKING ENGINE
 * ===================================================
 *
 * PHILOSOPHY:
 * Recommendation systems should RANK,
 * not REJECT.
 *
 * This engine uses:
 * - probabilistic scoring
 * - affinity matching
 * - growth opportunity scoring
 * - semantic stack relations
 * - confidence-aware ranking
 * - recommendation diversification
 */

class JobRankingEngine {

  constructor() {

    /**
     * STACK AFFINITY MAP
     * Related stacks receive partial scores
     */
    this.stackAffinity = {

      mern: {
        react: 0.95,
        frontend: 0.88,
        javascript: 0.92,
        nextjs: 0.90,
        node: 0.93,
      },

      frontend: {
        react: 0.95,
        ui: 0.80,
        javascript: 0.88,
        nextjs: 0.85,
      },

      backend: {
        node: 0.92,
        api: 0.86,
        java: 0.70,
        python: 0.65,
      },

      python: {
        django: 0.90,
        flask: 0.88,
        ai: 0.80,
        backend: 0.70,
      }
    };

    /**
     * SKILL NORMALIZATION
     */
    this.skillAliases = {

      react: [
        "react.js",
        "reactjs",
      ],

      node: [
        "node.js",
        "nodejs",
      ],

      js: [
        "javascript",
        "ecmascript",
      ],

      mongo: [
        "mongodb",
        "nosql",
      ],

      ts: [
        "typescript",
      ],
    };
  }

  /**
   * ====================================================
   * MAIN RANKING ENTRY
   * ====================================================
   */

  rankJobs(userProfile, jobs = []) {

    // Validation: ensure profile has required fields
    if (!userProfile) {
      console.warn('⚠️ JobRankingEngine: Missing user profile');
      return [];
    }
    
    if (!Array.isArray(jobs) || !jobs.length) {
      return [];
    }
    
    // Ensure profile has minimum required structure
    if (!userProfile.primaryRole) {
      userProfile.primaryRole = 'software developer';
    }
    if (!userProfile.primaryStack) {
      userProfile.primaryStack = 'general';
    }

    const ranked = jobs.map(job => {

      const scoring =
        this._calculateCompositeScore(
          userProfile,
          job
        );

      return {
        ...job,

        matchScore:
          scoring.totalScore,

        matchLabel:
          this._getMatchLabel(
            scoring.totalScore
          ),

        scoreBreakdown:
          scoring.breakdown,

        recommendationMeta: {

          confidence:
            scoring.confidence,

          recommendationTier:
            scoring.tier,

          growthPotential:
            scoring.growthPotential,

          stackAffinity:
            scoring.stackAffinity,
        }
      };
    });

    /**
     * SORT DESCENDING
     */
    return ranked.sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );
  }

  /**
   * ====================================================
   * COMPOSITE SCORE
   * ====================================================
   */

  _calculateCompositeScore(
    profile,
    job
  ) {
    
    // Safety: validate inputs
    if (!profile || !job) {
      return {
        totalScore: 50,
        breakdown: {
          roleAlignment: 50,
          skillAlignment: 50,
          stackAffinity: 50,
          experienceAlignment: 50,
          seniorityAlignment: 50,
          growthPotential: 50,
          freshness: 50,
        },
        confidence: 0.5,
        tier: 'exploration',
        growthPotential: 50,
        stackAffinity: 50,
      };
    }

    const breakdown = {

      roleAlignment:
        this._scoreRoleAlignment(
          profile,
          job
        ),

      skillAlignment:
        this._scoreSkillAlignment(
          profile,
          job
        ),

      stackAffinity:
        this._scoreStackAffinity(
          profile,
          job
        ),

      experienceAlignment:
        this._scoreExperienceAlignment(
          profile,
          job
        ),

      seniorityAlignment:
        this._scoreSeniorityAlignment(
          profile,
          job
        ),

      growthPotential:
        this._scoreGrowthPotential(
          profile,
          job
        ),

      freshness:
        this._scoreFreshness(job),
    };

    /**
     * WEIGHTED SCORING
     */
    const weights = {

      roleAlignment: 0.25,

      skillAlignment: 0.24,

      stackAffinity: 0.18,

      experienceAlignment: 0.12,

      seniorityAlignment: 0.10,

      growthPotential: 0.06,

      freshness: 0.05,
    };

    let total = 0;

    Object.keys(weights).forEach(key => {
      
      const score = breakdown[key];
      if (typeof score !== 'number' || isNaN(score)) {
        total += 50 * weights[key];
      } else {
        total += score * weights[key];
      }
    });

    // Ensure total is a valid number
    if (typeof total !== 'number' || isNaN(total)) {
      total = 50;
    }

    total =
      Math.max(
        35,
        Math.min(98, total)
      );

    return {

      totalScore:
        Math.round(total),

      breakdown,

      confidence:
        this._calculateConfidence(
          breakdown
        ),

      tier:
        this._getRecommendationTier(
          total
        ),

      growthPotential:
        breakdown.growthPotential,

      stackAffinity:
        breakdown.stackAffinity,
    };
  }

  /**
   * ====================================================
   * ROLE ALIGNMENT
   * ====================================================
   */

  _scoreRoleAlignment(
    profile,
    job
  ) {

    const userRole =
      (
        profile.primaryRole || ""
      ).toLowerCase();

    const jobTitle =
      (
        job.title || ""
      ).toLowerCase();

    if (!userRole) return 50;

    if (jobTitle.includes(userRole)) {
      return 100;
    }

    const userWords =
      userRole
        .split(" ")
        .filter(w => w.length > 2);

    if (userWords.length === 0) return 50;

    let matches = 0;

    userWords.forEach(word => {

      if (jobTitle.includes(word)) {
        matches++;
      }
    });

    const score = Math.round(
      (matches / userWords.length)
      * 100
    );
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * ====================================================
   * SKILL ALIGNMENT
   * ====================================================
   */

  /**
   * ====================================================
   * SKILL ALIGNMENT
   * ====================================================
   */
  
  _scoreSkillAlignment(profile, job) {
    // 1. Extract and normalize user skills
    const userSkills = (profile.skills || [])
      .map(skill => {
        if (typeof skill === "string") return skill.toLowerCase();
        if (typeof skill === "object" && skill !== null) {
          return (skill.displayName || skill.canonical || skill.name || "").toLowerCase();
        }
        return "";
      })
      .filter(Boolean);

    // 2. Identify what the job actually requires
    // This is extracted from the description in job.service.js
    const jobRequirements = job.requirements || [];

    // If the user has no skills, give a baseline exploratory score
    if (!userSkills.length) return 35;

    // If the job didn't list specific requirements, provide a neutral passing score
    if (jobRequirements.length === 0) return 75;

    let matchedCount = 0;
    
    // Check how many of the JOB'S requirements the user meets
    jobRequirements.forEach(req => {
      const normalizedReq = req.toLowerCase();
      
      // Check for direct match or alias match
      if (userSkills.includes(normalizedReq) || this._skillExists(normalizedReq, userSkills.join(' '))) {
        matchedCount++;
      }
    });

    /**
     * FIX: The "Efficiency Score"
     * Logic: What % of the JOB requirements does this person fulfill?
     * This ensures a MERN developer with 50 skills isn't "diluted" when 
     * applying for a job that only needs React and Node.
     */
    const matchPercentage = (matchedCount / jobRequirements.length) * 100;

    // Apply a realistic ceiling and floor
    // Even with a 100% skill match, we leave room for other factors (experience, seniority)
    return Math.round(Math.min(98, Math.max(0, matchPercentage)));
  }

  /**
   * ====================================================
   * STACK AFFINITY
   * ====================================================
   */

  _scoreStackAffinity(
    profile,
    job
  ) {

    const userStack =
      (
        profile.primaryStack
        ||
        "general"
      ).toLowerCase();

    const jobText =
      `${job.title} ${job.description}`
        .toLowerCase();

    const affinities =
      this.stackAffinity[userStack];

    if (!affinities) {
      return 65;
    }

    let highest = 50;

    Object.entries(affinities)
      .forEach(([tech, value]) => {

        if (jobText.includes(tech)) {

          highest =
            Math.max(
              highest,
              value * 100
            );
        }
      });

    return Math.round(highest);
  }

  /**
   * ====================================================
   * EXPERIENCE ALIGNMENT
   * ====================================================
   */

  _scoreExperienceAlignment(
    profile,
    job
  ) {

    const userExp =
      profile.yearsOfExperience || 0;

    const jobText =
      `${job.title} ${job.description}`
        .toLowerCase();

    const extracted =
      this._extractExperience(jobText);

    if (!extracted) {
      return 70;
    }

    const diff =
      Math.abs(userExp - extracted);

    if (diff === 0) return 100;
    if (diff <= 1) return 90;
    if (diff <= 2) return 80;
    if (diff <= 4) return 65;

    return 50;
  }

  /**
   * ====================================================
   * SENIORITY ALIGNMENT
   * ====================================================
   */

  _scoreSeniorityAlignment(
    profile,
    job
  ) {
    
    if (!profile.seniority || typeof profile.seniority !== 'string' || !job.title || !job.description) {
      return 70;
    }

    const seniority =
      profile.seniority.toLowerCase();
    const jobText =
      `${job.title} ${job.description}`
        .toLowerCase();

    // Misalignment: user is fresher but job requires senior
    if (
      seniority.includes("fresher")
      &&
      (jobText.includes("senior") || jobText.includes("10+ years"))
    ) {
      return 35;
    }

    // Misalignment: user is junior but job requires lead/director
    if (
      seniority.includes("junior")
      &&
      (jobText.includes("lead") || jobText.includes("director") || jobText.includes("principal"))
    ) {
      return 40;
    }

    return 80;
  }

  /**
   * ====================================================
   * GROWTH POTENTIAL
   * ====================================================
   */

  _scoreGrowthPotential(
    profile,
    job
  ) {

    const score =
      this._scoreExperienceAlignment(
        profile,
        job
      );

    /**
     * Slightly above user level
     * = growth opportunity
     */
    if (
      score >= 70
      &&
      score <= 85
    ) {
      return 95;
    }

    return 70;
  }

  /**
   * ====================================================
   * FRESHNESS
   * ====================================================
   */

  _scoreFreshness(job) {

    if (!job.postedDate) {
      return 65;
    }

    const age =
      (
        Date.now()
        -
        new Date(job.postedDate)
      )
      /
      (1000 * 60 * 60 * 24);

    if (age <= 2) return 100;
    if (age <= 7) return 90;
    if (age <= 14) return 75;
    if (age <= 30) return 60;

    return 45;
  }

  /**
   * ====================================================
   * CONFIDENCE
   * ====================================================
   */

  _calculateConfidence(
    breakdown
  ) {

    if (!breakdown || typeof breakdown !== 'object') {
      return 0.5;
    }

    const values = Object.values(breakdown)
      .filter(v => typeof v === 'number' && !isNaN(v));
    
    if (values.length === 0) {
      return 0.5;
    }

    const avg =
      values.reduce((a, b) => a + b, 0)
      /
      values.length;

    const confidence = Number(
      (avg / 100)
        .toFixed(2)
    );
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * ====================================================
   * RECOMMENDATION TIER
   * ====================================================
   */

  _getRecommendationTier(
    score
  ) {

    if (score >= 90) {
      return "elite";
    }

    if (score >= 80) {
      return "strong";
    }

    if (score >= 65) {
      return "growth";
    }

    return "exploration";
  }

  /**
   * ====================================================
   * LABEL
   * ====================================================
   */

  _getMatchLabel(score) {

    if (score >= 90) {
      return "Excellent Match";
    }

    if (score >= 80) {
      return "Strong Match";
    }

    if (score >= 65) {
      return "Growth Opportunity";
    }

    return "Exploratory Match";
  }

  /**
   * ====================================================
   * SKILL EXISTS
   * ====================================================
   */

  _skillExists(
    skill,
    text
  ) {

    const aliases =
      this.skillAliases[skill]
      || [];

    return (
      text.includes(skill)
      ||
      aliases.some(alias =>
        text.includes(alias)
      )
    );
  }

  /**
   * ====================================================
   * EXPERIENCE EXTRACTION
   * ====================================================
   */

  _extractExperience(text) {

    if (!text || typeof text !== 'string') {
      return null;
    }

    const match =
      text.match(
        /(\d+)\+?\s*(years|yrs|year|yr)/i
      );

    if (!match) {
      return null;
    }

    const years = parseInt(match[1]);
    return isNaN(years) ? null : years;
  }
}

module.exports =
  new JobRankingEngine();