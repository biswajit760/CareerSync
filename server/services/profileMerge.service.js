const UserJobProfile = require("../model/UserJobProfile");

class ProfileMergeService {

  constructor() {

    this.stackCategories = {

      mern: [
        "react",
        "node",
        "mongodb",
        "express",
        "next.js"
      ],

      java: [
        "java",
        "spring"
      ],

      python: [
        "python",
        "django",
        "flask"
      ],

      php: [
        "php",
        "laravel"
      ],

      dotnet: [
        ".net",
        "c#",
        "asp.net"
      ]
    };
  }

  /**
   * =====================================================
   * SKILL NORMALIZATION
   * =====================================================
   */

  _normalizeSkill(skill = "") {

    return String(skill)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9+#.\-]/g, "");
  }

  /**
   * =====================================================
   * BUILD MODERN SKILL OBJECT
   * =====================================================
   */

  _buildSkillObject(skill) {

    const displayName =
      String(skill).trim();

    const canonical = 
      this._normalizeSkill(displayName);

    return {
      displayName,
      canonical,
      category: 'other',
      stack: 'general',
      proficiencyScore: 50,
      confidence: 0.8,
      evidenceCount: 1,
      yearsUsed: 1,
      inferred: false,
      lastSeenAt: new Date(),
      createdAt: new Date(),
    };
  }

  /**
   * =====================================================
   * NORMALIZE SKILLS ARRAY
   * Ensures all required fields are present
   * =====================================================
   */
  normalizeSkillsArray(skills = []) {
    if (!Array.isArray(skills)) return [];

    return skills
      .filter(skill => skill) // Remove null/undefined
      .map(skill => {
        // If skill is a string, build full object
        if (typeof skill === 'string') {
          return this._buildSkillObject(skill);
        }

        // If skill is an object, ensure all required fields
        const normalized = {
          displayName: skill.displayName || skill.name || 'Unknown',
          canonical: skill.canonical || this._normalizeSkill(skill.displayName || skill.name || ''),
          category: skill.category || 'other',
          stack: skill.stack || 'general',
          proficiencyScore: skill.proficiencyScore ?? 50,
          confidence: skill.confidence ?? 0.8,
          evidenceCount: skill.evidenceCount ?? 1,
          yearsUsed: skill.yearsUsed ?? 1,
          inferred: skill.inferred ?? false,
          lastSeenAt: skill.lastSeenAt || new Date(),
          createdAt: skill.createdAt || new Date(),
        };

        // Copy optional alias fields if present
        if (skill.aliases) normalized.aliases = skill.aliases;
        if (skill.sourceResumes) normalized.sourceResumes = skill.sourceResumes;

        return normalized;
      });
  }

  /**
   * =====================================================
   * DETECT PRIMARY STACK
   * =====================================================
   */

  _detectPrimaryStack(skills = []) {

    const scores = {};

    for (
      const [stack, keywords]
      of Object.entries(this.stackCategories)
    ) {

      scores[stack] = 0;

      for (const skill of skills) {

        const normalized =
          this._normalizeSkill(skill);

        if (
          keywords.some(keyword =>
            normalized.includes(
              this._normalizeSkill(keyword)
            )
          )
        ) {
          scores[stack]++;
        }
      }
    }

    const sorted =
      Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);

    return sorted[0]?.[1] > 0
      ? sorted[0][0]
      : "general";
  }

  /**
   * =====================================================
   * DETERMINE SENIORITY
   * =====================================================
   */

  _determineSeniority(years) {
    // FIX: 0-2 years can be considered Junior/Entry level in most modern tech companies.
    // This allows people with internships or 1 year of exp to see Junior roles.
    if (years < 0.5) {
      return "Fresher";
    }

    if (years < 3) {
      return "Junior";
    }

    if (years < 6) {
      return "Mid-Level";
    }

    if (years < 10) {
      return "Senior";
    }

    return "Lead";
  }

  /**
   * =====================================================
   * ADD UNIQUE ROLE
   * =====================================================
   */

  _addUniqueRole(profile, role) {

    if (!role) return;

    const exists =
      (profile.preferredRoles || [])
        .some(
          r =>
            r.toLowerCase()
            === role.toLowerCase()
        );

    if (!exists) {
      profile.preferredRoles.push(role);
    }
  }

  /**
   * =====================================================
   * UPSERT PROFILE
   * =====================================================
   */

  async upsertUserProfile(
    userId,
    extractedData,
    resumeId,
    confidence = 80
  ) {

    try {

      let profile =
        await UserJobProfile.findOne({
          userId
        });

      if (!profile) {

        profile =
          await this._createNewProfile(
            userId,
            extractedData,
            resumeId
          );

        console.log(
          `✅ Created new profile`
        );

      } else {

        profile =
          await this._mergeProfile(
            profile,
            extractedData,
            resumeId,
            confidence
          );

        console.log(
          `✅ Updated existing profile`
        );
      }

      return profile;

    } catch (error) {

      console.error(
        "❌ Profile Merge Error:",
        error
      );

      throw error;
    }
  }

  /**
   * =====================================================
   * CREATE NEW PROFILE
   * =====================================================
   */

  async _createNewProfile(
    userId,
    extractedData,
    resumeId
  ) {
    const rawSkills = extractedData.skills || [];
    const normalizedSkills = this.normalizeSkillsArray(rawSkills);

    const profile = new UserJobProfile({
      userId,
      primaryRole: extractedData.role || "Software Developer",
      primaryStack: this._detectPrimaryStack(rawSkills),
      seniority: this._determineSeniority(extractedData.yearsOfExp || 0),
      yearsOfExperience: extractedData.yearsOfExp || 0,
      skills: normalizedSkills,
      preferredRoles: [extractedData.role || "Software Developer"],
      resumeCount: 1,
      lastResumeAnalysis: new Date(),
      
      // FIX: Ensure we initialize health and metadata correctly
      profileHealth: {
        completenessScore: 0, // Will be updated by pre-save hook
        profileStrength: 'Average'
      },

      analysisHistory: [{
        resumeId,
        extractedRole: extractedData.role,
        matchedSkills: rawSkills,
        newSkills: rawSkills,
        analyzedAt: new Date(),
        confidence: 80, // Default baseline
      }]
    });

    return await profile.save();
  }

  /**
   * =====================================================
   * MERGE EXISTING PROFILE
   * =====================================================
   */

  async _mergeProfile(
    profile,
    extractedData,
    resumeId,
    confidence = 80
  ) {

    /**
     * ROLE AGGREGATION
     */
    this._addUniqueRole(
      profile,
      extractedData.role
    );

    if (confidence >= 85) {

      profile.primaryRole =
        extractedData.role;
    }

    /**
     * SKILL MERGING
     */
    const newSkills = [];

    for (
      const rawSkill
      of (extractedData.skills || [])
    ) {

      const canonical =
        this._normalizeSkill(rawSkill);

      const existing =
        profile.skills.find(
          s =>
            s.canonical === canonical
        );

      if (existing) {

        existing.lastSeenAt =
          new Date();

      } else {

        newSkills.push(rawSkill);

        // Use normalization function to ensure all required fields
        const normalizedSkill = 
          this._buildSkillObject(rawSkill);
        
        profile.skills.push(normalizedSkill);
      }
    }

    /**
     * EXPERIENCE UPDATE
     */
    if (
      (extractedData.yearsOfExp || 0)
      >
      profile.yearsOfExperience
    ) {

      profile.yearsOfExperience =
        extractedData.yearsOfExp;
    }

    /**
     * SENIORITY
     */
    profile.seniority =
      this._determineSeniority(
        profile.yearsOfExperience
      );

    /**
     * STACK
     */
    profile.primaryStack =
      this._detectPrimaryStack(
        profile.skills.map(
          s => s.displayName
        )
      );

    /**
     * METADATA
     */
    profile.resumeCount += 1;

    profile.lastResumeAnalysis =
      new Date();

    /**
     * HISTORY
     */
    profile.analysisHistory.push({

      resumeId,

      extractedRole:
        extractedData.role,

      matchedSkills:
        extractedData.skills || [],

      newSkills,

      analyzedAt:
        new Date(),

      confidence,
    });

    /**
     * KEEP ONLY LAST 10
     */
    if (
      profile.analysisHistory.length > 10
    ) {

      profile.analysisHistory =
        profile.analysisHistory.slice(-10);
    }

    return await profile.save();
  }

  /**
   * =====================================================
   * GET OR CREATE PROFILE
   * =====================================================
   */

  async getOrCreateProfile(userId) {

    let profile =
      await UserJobProfile.findOne({
        userId
      });

    if (!profile) {

      profile =
        new UserJobProfile({

          userId,

          primaryRole:
            "Software Developer",

          primaryStack:
            "general",

          seniority:
            "Fresher",

          yearsOfExperience: 0,

          skills: [],

          preferredRoles: [
            "Software Developer"
          ]
        });

      await profile.save();
    }

    return profile;
  }

  /**
   * =====================================================
   * PROFILE COMPLETENESS
   * =====================================================
   */

  async updateProfileCompleteness(
    profileId
  ) {

    const profile =
      await UserJobProfile.findById(
        profileId
      );

    if (!profile) {
      throw new Error(
        "Profile not found"
      );
    }

    let score = 0;

    if (profile.primaryRole) {
      score += 20;
    }

    if (profile.seniority) {
      score += 20;
    }

    if (
      profile.yearsOfExperience >= 0
    ) {
      score += 20;
    }

    if (
      profile.skills &&
      profile.skills.length > 0
    ) {
      score += 20;
    }

    if (
      profile.preferredRoles &&
      profile.preferredRoles.length > 0
    ) {
      score += 20;
    }

    profile.profileCompleteness =
      score;

    return await profile.save();
  }
}

module.exports =
  new ProfileMergeService();