const mongoose = require('mongoose');

const ATSReportSchema = new mongoose.Schema({
  /**
   * RELATIONS
   */
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  /**
   * OVERALL ATS SCORE
   */
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    index: true,
  },

  /**
   * PERCENTILE RANKING
   */
  percentile: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },

  /**
   * ATS HEALTH STATUS
   */
  atsGrade: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },

  /**
   * DETAILED BREAKDOWN
   */
  scoreBreakdown: {
    keywordMatch: { type: Number, default: 0 },
    technicalSkills: { type: Number, default: 0 },
    experienceStrength: { type: Number, default: 0 },
    projectQuality: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    leadershipSignals: { type: Number, default: 0 },
    impactStatements: { type: Number, default: 0 }
  },

  /**
   * SKILL ANALYSIS
   */
  matchedSkills: [String],
  missingSkills: [String],
  weakSkills: [{
    skill: String,
    reason: String,
  }],

  /**
   * STRENGTHS
   */
  strengths: [String],

  /**
   * IMPROVEMENTS
   */
  improvements: [String],

  /**
   * JOB MATCHING INSIGHTS
   */
  jobMatchingInsights: {
    strongestMatchingStacks: [{
      stack: String,
      confidence: Number,
    }],
    weakMatchingStacks: [{
      stack: String,
      reason: String,
    }],
    estimatedMarketFit: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    recommendedRoles: [String],
    avoidRoles: [String],
  },

  /**
   * AI SUMMARY & ACTION PLAN
   */
  executiveSummary: String,
  actionPlan: [{
    step: String,
    expectedImpact: String,
    estimatedScoreGain: Number,
  }],

  /**
   * AI METADATA
   */
  aiMetadata: {
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    analysisDurationMs: Number,
    tokenUsage: Number,
    analyzedAt: {
      type: Date,
      default: Date.now,
    }
  }
}, {
  timestamps: true,
});

/**
 * INDEXES
 */
ATSReportSchema.index({ userId: 1, createdAt: -1 });
ATSReportSchema.index({ atsScore: -1 });

module.exports = mongoose.model('ATSReport', ATSReportSchema);