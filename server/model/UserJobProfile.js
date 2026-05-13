const mongoose = require('mongoose');

/**
 * SKILL SUBDOCUMENT
 */
const SkillSchema = new mongoose.Schema({
  canonical: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  aliases: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  category: {
    type: String,
    enum: [
      'frontend', 'backend', 'database', 'devops', 'cloud', 
      'mobile', 'ai', 'testing', 'tooling', 'other'
    ],
    default: 'other'
  },
  stack: {
    type: String,
    enum: ['mern', 'mean', 'java', 'python', 'php', 'dotnet', 'mobile', 'devops', 'general'],
    default: 'general'
  },
  proficiencyScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.7,
  },
  evidenceCount: {
    type: Number,
    default: 1,
  },
  sourceResumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  }],
  yearsUsed: {
    type: Number,
    default: 0,
  },
  inferred: {
    type: Boolean,
    default: false,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: false });

/**
 * CAREER VECTOR
 */
const CareerVectorSchema = new mongoose.Schema({
  frontend: { type: Number, default: 0 },
  backend: { type: Number, default: 0 },
  fullstack: { type: Number, default: 0 },
  devops: { type: Number, default: 0 },
  ai: { type: Number, default: 0 },
  mobile: { type: Number, default: 0 },
  data: { type: Number, default: 0 },
  testing: { type: Number, default: 0 },
}, { _id: false });

/**
 * MAIN PROFILE SCHEMA
 */
const UserJobProfileSchema = new mongoose.Schema({
  /**
   * USER RELATION
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },

  /**
   * PRIMARY CAREER IDENTITY
   */
  primaryRole: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  primaryStack: {
    type: String,
    enum: ['mern', 'mean', 'java', 'python', 'php', 'dotnet', 'mobile', 'devops', 'general'],
    default: 'general',
    index: true,
  },
  seniority: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
    required: true,
    index: true,
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },

  /**
   * CAREER DIRECTION INTELLIGENCE
   */
  careerVector: {
    type: CareerVectorSchema,
    default: () => ({})
  },

  /**
   * ROLE HISTORY
   */
  roleHistory: [{
    role: String,
    company: String,
    durationMonths: Number,
    technologies: [String],
    startedAt: Date,
    endedAt: Date,
  }],

  /**
   * CORE SKILLS
   */
  skills: [SkillSchema],

  /**
   * RESUME ANALYTICS
   */
  analyzedResumeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  }],
  resumeCount: {
    type: Number,
    default: 0,
  },
  lastResumeAnalysis: {
    type: Date,
    index: true,
  },

  /**
   * JOB PREFERENCES
   */
  preferredRoles: [{ type: String, trim: true }],
  preferredLocations: [{ type: String, trim: true }],
  preferredIndustries: [{ type: String, trim: true }],
  preferredWorkModel: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site', 'Any'],
    default: 'Any',
  },
  preferredCompanySize: {
    type: String,
    enum: ['Startup', 'Mid-Size', 'Enterprise', 'Any'],
    default: 'Any',
  },

  /**
   * RECOMMENDATION METADATA
   */
  recommendationMetadata: {
    totalJobsViewed: { type: Number, default: 0 },
    totalJobsApplied: { type: Number, default: 0 },
    averageMatchScore: { type: Number, default: 0 },
    lastRecommendationRefresh: Date,
    topMatchedStacks: [{
      stack: String,
      score: Number,
    }]
  },

  /**
   * PROFILE HEALTH
   */
  profileHealth: {
    completenessScore: { type: Number, default: 0, min: 0, max: 100 },
    confidenceScore: { type: Number, default: 0, min: 0, max: 100 },
    profileStrength: {
      type: String,
      enum: ['Weak', 'Average', 'Strong'],
      default: 'Average',
    }
  },

  /**
   * SYSTEM FLAGS
   */
  statusFlags: {
    isActive: { type: Boolean, default: true },
    conflictingRoles: { type: Boolean, default: false },
    needsReprocessing: { type: Boolean, default: false },
    recommendationReady: { type: Boolean, default: false }
  },

  /**
   * AI ANALYSIS HISTORY
   */
  analysisHistory: [{
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    extractedRole: String,
    detectedStack: String,
    matchedSkills: [String],
    newlyDetectedSkills: [String],
    confidence: Number,
    analyzedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
});

/**
 * PERFORMANCE INDEXES
 */
UserJobProfileSchema.index({ primaryRole: 1, primaryStack: 1, seniority: 1 });
UserJobProfileSchema.index({ 'skills.canonical': 1 });

/**
 * AUTO PROFILE COMPLETENESS
 */
UserJobProfileSchema.pre('save', async function () {
  // 1. Normalize skills (Ensures data integrity before scoring)
  if (this.skills && Array.isArray(this.skills)) {
    this.skills = this.skills.map(skill => {
      if (!skill.displayName) {
        skill.displayName = skill.name || 'Unknown';
      }
      if (!skill.canonical) {
        skill.canonical = (skill.displayName).toLowerCase().replace(/\s+/g, '-');
      }
      // Set defaults for missing fields
      skill.category = skill.category || 'other';
      skill.stack = skill.stack || 'general';
      skill.proficiencyScore = skill.proficiencyScore ?? 50;
      skill.confidence = skill.confidence ?? 0.8;
      return skill;
    });
  }
  
  // 2. Calculate Completeness Score
  let score = 0;
  if (this.primaryRole) score += 20;
  if (this.primaryStack) score += 15;
  if (this.skills && this.skills.length >= 5) score += 25;
  if (this.yearsOfExperience > 0) score += 15;
  if (this.preferredRoles && this.preferredRoles.length > 0) score += 10;
  if (this.resumeCount > 0) score += 15;

  this.profileHealth.completenessScore = Math.min(score, 100);
  
  // 3. Update Status Flags
  this.statusFlags.recommendationReady = this.profileHealth.completenessScore >= 50;
  
  // No next() required for async hooks in Mongoose 5.x+
});

module.exports = mongoose.model('UserJobProfile', UserJobProfileSchema);