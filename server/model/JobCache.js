const mongoose = require('mongoose');

const JobCacheSchema = new mongoose.Schema({
  /**
   * EXTERNAL SOURCE IDENTIFIERS
   */
  externalJobId: {
    type: String,
    required: true,
    index: true,
  },
  source: {
    type: String,
    enum: ['Adzuna', 'LinkedIn', 'Indeed', 'Wellfound'],
    default: 'Adzuna',
    index: true,
  },

  /**
   * CANONICAL JOB ENTITY
   */
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  normalizedTitle: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  normalizedCompany: {
    type: String,
    lowercase: true,
    trim: true,
  },
  location: {
    type: String,
    default: 'India',
  },
  workModel: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site', 'Unknown'],
    default: 'Unknown',
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Unknown'],
    default: 'Full-Time',
  },

  /**
   * ROLE INTELLIGENCE
   */
  detectedStack: {
    type: String,
    enum: ['mern', 'mean', 'java', 'python', 'php', 'dotnet', 'mobile', 'devops', 'general'],
    default: 'general',
    index: true,
  },
  seniority: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Unknown'],
    default: 'Unknown',
    index: true,
  },

  /**
   * EXPERIENCE REQUIREMENT
   * Extracted from job description
   */
  experienceRequired: {
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: ['range', 'minimum', 'exact', 'fresher', null],
      default: null,
    }
  },

  /**
   * SKILLS INTELLIGENCE
   */
  skills: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  requiredSkills: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  optionalSkills: [{
    type: String,
    lowercase: true,
    trim: true,
  }],

  /**
   * DESCRIPTION
   */
  description: {
    type: String,
    maxlength: 10000,
  },
  shortDescription: {
    type: String,
    maxlength: 500,
  },
  applyUrl: {
    type: String,
    required: true,
  },

  /**
   * SALARY
   */
  salaryText: String,
  salaryMin: Number,
  salaryMax: Number,
  currency: {
    type: String,
    default: 'INR',
  },

  /**
   * JOB QUALITY METRICS
   */
  qualityMetrics: {
    freshnessScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    descriptionQuality: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    relevanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    applicationRate: {
      type: Number,
      default: 0
    }
  },

  /**
   * ANALYTICS
   */
  analytics: {
    viewCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
  },

  /**
   * CACHE CONTROL
   */
  fetchedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  }
}, {
  timestamps: true,
});

/**
 * UNIQUE JOB ENTITY
 */
JobCacheSchema.index({
  externalJobId: 1,
  source: 1,
}, {
  unique: true,
});

/**
 * TTL CLEANUP
 * Automatically removes the document when expiresAt is reached
 */
JobCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * SEARCH PERFORMANCE
 */
JobCacheSchema.index({
  detectedStack: 1,
  seniority: 1,
  isActive: 1,
});

/**
 * FULL TEXT SEARCH INDEX
 */
JobCacheSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
});

module.exports = mongoose.model('JobCache', JobCacheSchema);