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
     * Experience is now the DOMINANT factor (50%)
     * This ensures freshers see 0-2 year jobs at the top
     */
    const weights = {

      experienceAlignment: 0.50,  // DOMINANT: Experience match (increased from 35%)

      roleAlignment: 0.18,

      skillAlignment: 0.15,

      stackAffinity: 0.10,

      seniorityAlignment: 0.05,

      growthPotential: 0.01,

      freshness: 0.01,
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
   * FIXED: Now checks what % of JOB requirements the user meets
   * (not what % of user skills match the job)
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

    // 2. Extract job requirements from description
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const jobRequirements = job.requirements || [];

    // If the user has no skills, give a baseline exploratory score
    if (!userSkills.length) return 35;

    // If the job didn't list specific requirements, check general skill presence
    if (jobRequirements.length === 0) {
      // Fallback: Check if user's skills appear in job description
      let generalMatches = 0;
      userSkills.forEach(skill => {
        if (jobText.includes(skill)) {
          generalMatches++;
        }
      });
      
      if (generalMatches === 0) return 50;  // No clear match
      if (generalMatches >= 3) return 80;   // Good general match
      return 65;  // Some match
    }

    /**
     * CRITICAL FIX: Calculate based on JOB requirements, not user skills
     * Question: "What % of the JOB's requirements does this person fulfill?"
     */
    let matchedCount = 0;
    let criticalMissing = 0;
    
    jobRequirements.forEach(req => {
      const normalizedReq = req.toLowerCase();
      
      // Check if user has this skill
      const hasSkill = userSkills.some(userSkill => 
        userSkill.includes(normalizedReq) || 
        normalizedReq.includes(userSkill) ||
        this._skillExists(normalizedReq, userSkills.join(' '))
      );
      
      if (hasSkill) {
        matchedCount++;
      } else {
        // Check if it's a critical/specialized skill
        const criticalSkills = [
          'arcgis', 'postgis', 'geoserver', 'qgis',  // GIS
          'rust', 'c++', 'golang', 'kotlin',          // Specialized languages
          'kubernetes', 'terraform', 'ansible',       // DevOps
          'graphql', 'grpc', 'kafka',                 // Advanced backend
        ];
        
        if (criticalSkills.some(cs => normalizedReq.includes(cs))) {
          criticalMissing++;
        }
      }
    });

    /**
     * Calculate match percentage based on job requirements
     */
    const matchPercentage = (matchedCount / jobRequirements.length) * 100;

    /**
     * Apply penalty for missing critical skills
     */
    let finalScore = matchPercentage;
    
    if (criticalMissing > 0) {
      // Penalize 15 points per critical missing skill
      finalScore -= (criticalMissing * 15);
    }

    // Ensure score stays within bounds
    return Math.round(Math.min(98, Math.max(20, finalScore)));
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

    /**
     * USE PRE-EXTRACTED EXPERIENCE FROM JOB
     */
    const jobExp = job.experienceRequired;

    /**
     * NO REQUIREMENT MENTIONED
     * Give lower score for freshers (they should prefer jobs with clear 0-2 year requirements)
     * Give higher score for experienced folks (they can apply to any job)
     */
    if (!jobExp) {
      // Freshers (0-1 years): Prefer jobs with clear requirements
      if (userExp <= 1) {
        return 60;  // Lower score - unclear if suitable
      }
      // Experienced (2+ years): Can apply to most jobs
      return 75;
    }

    /**
     * MATCH USER EXPERIENCE WITH JOB REQUIREMENT
     */
    return this._matchExperienceRange(userExp, jobExp);
  }

  /**
   * ====================================================
   * EXPERIENCE RANGE MATCHING
   * ====================================================
   * Scores how well user experience matches job requirement
   */

  _matchExperienceRange(userYears, jobRequirement) {

    const { min, max, type } = jobRequirement;

    /**
     * PERFECT MATCH
     * User experience within job requirement range
     */
    if (userYears >= min && userYears <= max) {
      return 100;  // ✅ Perfect fit
    }

    /**
     * GROWTH OPPORTUNITY
     * User slightly below minimum (stretch role)
     */
    if (userYears === min - 1) {
      return 85;  // 🌱 Good stretch opportunity
    }

    if (userYears === min - 2) {
      return 75;  // 🌱 Challenging but possible
    }

    /**
     * OVERQUALIFIED (Acceptable)
     * User slightly above maximum
     */
    if (userYears === max + 1) {
      return 70;  // 📈 Slightly overqualified
    }

    if (userYears === max + 2) {
      return 65;  // 📈 Overqualified but acceptable
    }

    /**
     * TOO JUNIOR (Strong penalty for freshers)
     * User significantly below minimum
     */
    if (userYears < min - 2) {
      const gap = min - userYears;
      
      // Fresher (0 years) applying to 3+ year jobs
      if (userYears <= 1 && min >= 3) {
        return 25;  // ❌ Way too junior
      }
      
      // General case: too junior
      return Math.max(20, 40 - (gap * 5));  // ❌ Too junior
    }

    /**
     * TOO SENIOR
     * User significantly above maximum
     */
    if (userYears > max + 3) {
      return 35;  // ❌ Significantly overqualified
    }

    /**
     * MARGINAL FIT
     * Edge cases
     */
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