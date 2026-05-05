const UserJobProfile = require('../model/UserJobProfile');

class ProfileMergeService {

  /**
   * Normalize skill (CRITICAL FIX)
   * Preserves meaningful symbols: +, #, . and - to keep "C++", "C#", ".NET", "ASP.NET" distinct
   */
  _normalizeSkill(skill) {
    return skill
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '') // normalize whitespace
      .replace(/[^a-z0-9+#.\-]/g, ""); // keep +, #, ., -
  }

  /**
   * Add unique role (case-insensitive)
   */
  _addUniqueRole(profile, role) {
    const exists = profile.preferredRoles.some(
      r => r.toLowerCase() === role.toLowerCase()
    );
    if (!exists) {
      profile.preferredRoles.push(role);
    }
  }

  /**
   * Update or create user profile
   */
  async upsertUserProfile(userId, extractedData, resumeId, confidence = 80) {
    try {
      let profile = await UserJobProfile.findOne({ userId });

      if (!profile) {
        profile = await this._createNewProfile(userId, extractedData, resumeId);
        console.log(`✅ Created new profile for user: ${userId}`);
      } else {
        profile = await this._mergeProfile(profile, extractedData, resumeId, confidence);
        console.log(`✅ Updated profile for user: ${userId}`);
      }

      return profile;
    } catch (error) {
      console.error('❌ ProfileMerge Error:', error);
      throw error;
    }
  }

  /**
   * Create new profile
   */
  async _createNewProfile(userId, extractedData, resumeId) {
    const skills = (extractedData.skills || []).map(skill => ({
      name: skill,
      normalized: this._normalizeSkill(skill),
      proficiency: 'Intermediate',
      frequency: 'Frequently',
      lastMentioned: new Date()
    }));

    const profile = new UserJobProfile({
      userId,
      primaryRole: extractedData.role,
      seniority: this._determineSeniority(extractedData.yearsOfExp || 0),
      yearsOfExperience: extractedData.yearsOfExp || 0,
      skills,
      preferredRoles: [extractedData.role],
      resumeCount: 1,
      lastResumeAnalysis: new Date(),
      analysisHistory: [{
        resumeId,
        extractedRole: extractedData.role,
        matchedSkills: extractedData.skills || [],
        newSkills: extractedData.skills || [],
        analyzedAt: new Date(),
        confidence: 100
      }]
    });

    return await profile.save();
  }

  /**
   * Merge profile
   */
  async _mergeProfile(profile, extractedData, resumeId, confidence = 80) {

    // ✅ ROLE HANDLING WITH CONFIDENCE
    const rolesMatch =
      profile.primaryRole.toLowerCase() === extractedData.role.toLowerCase();

    if (!rolesMatch) {
      if (confidence > 80) {
        // High confidence → update primary role
        profile.primaryRole = extractedData.role;
      } else {
        // Low confidence → add to preferred roles
        this._addUniqueRole(profile, extractedData.role);
        profile.statusFlags = profile.statusFlags || {};
        profile.statusFlags.conflictingRoles = true;
      }
    }

    // ✅ SKILL MERGE WITH NORMALIZATION
    const newSkills = [];

    for (const skill of (extractedData.skills || [])) {
      const normalized = this._normalizeSkill(skill);

      const existingSkill = profile.skills.find(
        s => s.normalized === normalized
      );

      if (existingSkill) {
        existingSkill.frequency = 'Frequently';
        existingSkill.yearsUsed = (existingSkill.yearsUsed || 1) + 0.5;
        existingSkill.lastMentioned = new Date();
      } else {
        newSkills.push(skill);
        profile.skills.push({
          name: skill,
          normalized,
          proficiency: 'Intermediate',
          frequency: 'Frequently',
          lastMentioned: new Date()
        });
      }
    }

    // ✅ EXPERIENCE UPDATE
    if ((extractedData.yearsOfExp || 0) > profile.yearsOfExperience) {
      profile.yearsOfExperience = extractedData.yearsOfExp;
    }

    // ✅ ALWAYS RECALCULATE SENIORITY (FIX)
    profile.seniority = this._determineSeniority(profile.yearsOfExperience);

    // ✅ METADATA
    profile.resumeCount += 1;
    profile.lastResumeAnalysis = new Date();

    profile.analysisHistory.push({
      resumeId,
      extractedRole: extractedData.role,
      matchedSkills: extractedData.skills || [],
      newSkills,
      analyzedAt: new Date(),
      confidence
    });

    // Keep last 10
    if (profile.analysisHistory.length > 10) {
      profile.analysisHistory = profile.analysisHistory.slice(-10);
    }

    return await profile.save();
  }

  /**
   * Seniority logic
   */
  _determineSeniority(yearsOfExp) {
    if (yearsOfExp < 1) return 'Fresher';
    if (yearsOfExp < 3) return 'Junior';
    if (yearsOfExp < 7) return 'Mid-Level';
    if (yearsOfExp < 10) return 'Senior';
    return 'Lead';
  }

  /**
   * Get or create default profile
   */
  async getOrCreateProfile(userId) {
    let profile = await UserJobProfile.findOne({ userId });

    if (!profile) {
      profile = new UserJobProfile({
        userId,
        primaryRole: 'Software Developer',
        seniority: 'Fresher',
        yearsOfExperience: 0,
        skills: [],
        preferredRoles: ['Software Developer']
      });
      await profile.save();
    }

    return profile;
  }

  /**
   * Profile completeness
   */
  async updateProfileCompleteness(profileId) {
    const profile = await UserJobProfile.findById(profileId);
    if (!profile) {
 throw new Error(`Profile not found: ${profileId}`);
 }

    const completenessFactors = {
      hasRole: profile.primaryRole ? 20 : 0,
      hasSeniority: profile.seniority ? 20 : 0,
      hasExperience: profile.yearsOfExperience > 0 ? 20 : 0,
      hasSkills: profile.skills.length > 0 ? 20 : 0,
      hasPreferences: profile.preferredIndustries?.length > 0 ? 20 : 0
    };

    profile.profileCompleteness = Object.values(completenessFactors)
      .reduce((a, b) => a + b, 0);

    return await profile.save();
  }
}

module.exports = new ProfileMergeService();