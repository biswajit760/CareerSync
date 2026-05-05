class JobRankingEngine {
  constructor() {
    this.skillMap = {
      react: ["react.js", "reactjs"],
      js: ["javascript"],
      node: ["node.js"],
      mongo: ["mongodb"],
      express: ["express.js"],
    };

    // ✅ NEW: Skill importance weights
    this.skillWeights = {
      react: 1.0,
      node: 1.0,
      mongodb: 0.9,
      express: 0.9,
      javascript: 0.9,
      html: 0.5,
      css: 0.5,
      git: 0.4,
    };

    this.roleMap = {
      "frontend developer": ["react developer", "ui developer", "web developer"],
      "backend developer": ["node developer", "api developer"],
      "full stack developer": ["mern developer", "software engineer"],
    };
  }

  _normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  _expandSkill(skill) {
    const normalized = skill.toLowerCase();
    return [normalized, ...(this.skillMap[normalized] || [])];
  }

  /**
   * 🧠 ELIGIBILITY FILTER
   */
  _isEligible(userProfile, job) {
    const jobText = ((job.description || "") + " " + (job.title || "")).toLowerCase();
    const userExp = userProfile.yearsOfExperience || 0;

    const { min } = this._parseExperienceRange(jobText);

    if (userExp === 0 && min >= 3) return false;

    if (
      userExp === 0 &&
      (jobText.includes("senior") ||
        jobText.includes("lead") ||
        jobText.includes("expert"))
    ) {
      return false;
    }

    return true;
  }

  /**
   * 🧠 NEW: EXPERIENCE PARSING (REAL-WORLD READY)
   */
  _parseExperienceRange(jobText) {
    const text = jobText.toLowerCase();

    if (text.includes("fresher") || text.includes("0-1 year")) {
      return { min: 0, max: 1 };
    }

    const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)\s*(years?|yrs?)/);
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1]),
        max: parseInt(rangeMatch[2]),
      };
    }

    const singleMatch = text.match(/(?:minimum\s*)?(\d+)\+?\s*(years?|yrs?)/);
    if (singleMatch) {
      return {
        min: parseInt(singleMatch[1]),
        max: parseInt(singleMatch[1]) + 2,
      };
    }

    return { min: 0, max: 2 };
  }

  /**
   * MAIN SCORE CALCULATION
   */
  calculateMatchScore(userProfile, job) {
    const scores = {
      roleMatch: this._calculateRoleMatch(userProfile, job),
      skillsMatch: this._calculateSkillsMatch(userProfile, job),
      experienceMatch: this._calculateExperienceMatch(userProfile, job),
      seniorityMatch: this._calculateSeniorityMatch(userProfile, job),
      industryMatch: this._calculateIndustryMatch(userProfile, job),
    };

    let weights = {
      roleMatch: 0.30,
      skillsMatch: 0.35, // increased importance
      experienceMatch: 0.15,
      seniorityMatch: 0.10,
      industryMatch: 0.10,
    };

    if ((userProfile.yearsOfExperience || 0) === 0) {
      weights = {
        roleMatch: 0.30,
        skillsMatch: 0.40,
        experienceMatch: 0.10,
        seniorityMatch: 0.10,
        industryMatch: 0.10,
      };
    }

    let totalScore = 0;
    for (const key in weights) {
      totalScore += (scores[key] || 0) * weights[key];
    }

    if (totalScore > 70) totalScore += 5;
    if (totalScore > 85) totalScore += 3;

    totalScore = Math.min(100, totalScore);

    return {
      score: Math.round(totalScore),
      breakdown: scores,
    };
  }

  /**
   * ROLE MATCH
   */
  _calculateRoleMatch(profile, job) {
    const jobTitle = (job.title || "").toLowerCase();
    const userRole = (profile.primaryRole || "developer").toLowerCase();

    if (jobTitle.includes(userRole)) return 100;

    for (const [main, variants] of Object.entries(this.roleMap)) {
      if (
        userRole.includes(main) &&
        variants.some((v) => jobTitle.includes(v))
      ) {
        return 90;
      }
    }

    const keywords = userRole.split(" ");
    const matchCount = keywords.filter((kw) => jobTitle.includes(kw)).length;

    return (matchCount / keywords.length) * 100;
  }

  /**
   * 🔥 UPDATED: SKILLS MATCH WITH WEIGHTING
   */
  _calculateSkillsMatch(profile, job) {
    const jobText = this._normalize(
      (job.description || "") + " " + (job.title || "")
    );

    const profileSkills = (profile.skills || []).map((s) =>
      s.name.toLowerCase()
    );

    if (profileSkills.length === 0) return 50;

    let totalWeight = 0;
    let matchedWeight = 0;

    for (const skill of profileSkills) {
      const variants = this._expandSkill(skill);
      const weight = this.skillWeights[skill] || 0.6;

      totalWeight += weight;

      if (
        variants.some((variant) =>
          jobText.includes(this._normalize(variant))
        )
      ) {
        matchedWeight += weight;
      }
    }

    return (matchedWeight / totalWeight) * 100;
  }

  /**
   * 🔥 UPDATED: EXPERIENCE MATCH WITH RANGE
   */
  _calculateExperienceMatch(profile, job) {
    const jobText = ((job.description || "") + " " + (job.title || "")).toLowerCase();

    const { min, max } = this._parseExperienceRange(jobText);
    const userExp = profile.yearsOfExperience || 0;

    if (userExp >= min && userExp <= max) return 100;

    if (userExp < min) {
      return (userExp / Math.max(min, 1)) * 100;
    }

    if (userExp > max) return 85;

    return 70;
  }

  /**
   * SENIORITY MATCH
   */
  _calculateSeniorityMatch(profile, job) {
    const jobText = ((job.description || "") + " " + (job.title || "")).toLowerCase();

    const levels = {
      intern: 10,
      fresher: 20,
      junior: 40,
      mid: 60,
      senior: 80,
      lead: 100,
    };

    const userLevel =
      levels[(profile.seniority || "junior").toLowerCase()] || 50;

    for (const [level, score] of Object.entries(levels)) {
      if (jobText.includes(level)) {
        if (userLevel >= score) return 100;
        return (userLevel / score) * 100;
      }
    }

    return 70;
  }

  /**
   * INDUSTRY MATCH
   */
  _calculateIndustryMatch(profile, job) {
    if (!profile.preferredIndustries?.length) return 60;

    const jobText = ((job.description || "") + " " + (job.company || "")).toLowerCase();

    const matches = profile.preferredIndustries.filter((ind) =>
      jobText.includes(ind.toLowerCase())
    ).length;

    return (matches / profile.preferredIndustries.length) * 100;
  }

  /**
   * 🚀 FILTER + RANK
   */
  rankJobs(userProfile, jobs) {
    if (!jobs || jobs.length === 0) return [];

    const filteredJobs = jobs.filter((job) =>
      this._isEligible(userProfile, job)
    );

    const finalJobs = filteredJobs.length > 0 ? filteredJobs : jobs;

    return finalJobs
      .map((job) => {
        const result = this.calculateMatchScore(userProfile, job);
        return {
          ...job,
          matchScore: result.score,
          scoreBreakdown: result.breakdown,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

module.exports = new JobRankingEngine();