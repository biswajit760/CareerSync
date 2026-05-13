const mongoose = require('mongoose');

/**
 * PROJECT SUBDOCUMENT
 */
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  durationMonths: Number,
  impactScore: {
    type: Number,
    default: 50,
  }
}, { _id: false });

/**
 * EXPERIENCE SUBDOCUMENT
 */
const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  durationMonths: Number,
  technologies: [String],
  achievements: [String],
  startedAt: Date,
  endedAt: Date,
}, { _id: false });

/**
 * EDUCATION SUBDOCUMENT
 */
const EducationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  specialization: String,
  score: String,
  startedAt: Date,
  endedAt: Date,
}, { _id: false });

/**
 * CERTIFICATION SUBDOCUMENT
 */
const CertificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  issueDate: Date,
  credentialUrl: String,
}, { _id: false });

/**
 * MAIN RESUME SCHEMA
 */
const ResumeSchema = new mongoose.Schema({
  /**
   * USER RELATION
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  /**
   * FILE METADATA
   */
  originalFileName: {
    type: String,
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    default: 'pdf',
  },
  fileSize: Number,

  /**
   * RAW EXTRACTION
   */
  rawText: String,

  /**
   * JOB TARGETING CONTEXT
   */
  targetJobDescription: String,
  targetRole: {
    type: String,
    trim: true,
  },

  /**
   * STRUCTURED AI EXTRACTION
   */
  extractedIntelligence: {
    role: {
      type: String,
      default: 'Software Developer',
    },
    primaryStack: {
      type: String,
      enum: ['mern', 'mean', 'java', 'python', 'php', 'dotnet', 'mobile', 'devops', 'general'],
      default: 'general',
    },
    seniority: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
      default: 'Fresher',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    skills: [{
      canonical: String,
      displayName: String,
      category: String,
      stack: String,
      confidence: Number,
    }],
    projects: [ProjectSchema],
    experiences: [ExperienceSchema],
    education: [EducationSchema],
    certifications: [CertificationSchema],
    domains: [String],
    leadershipSignals: [String],
    communicationSignals: [String],
    achievements: [String],
    careerVector: {
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
      fullstack: { type: Number, default: 0 },
      ai: { type: Number, default: 0 },
      devops: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
    },
    extractionConfidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    }
  },

  /**
   * ANALYSIS STATE
   */
  analysisStatus: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'failed'],
    default: 'uploaded',
    index: true,
  },

  /**
   * VERSIONING
   */
  resumeVersion: {
    type: Number,
    default: 1,
  },
  isPrimaryResume: {
    type: Boolean,
    default: false,
  },

  /**
   * AI METADATA
   */
  aiMetadata: {
    extractionModel: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    extractionDurationMs: Number,
    tokenUsage: Number,
    lastAnalyzedAt: Date,
  },

  /**
   * RECOMMENDATION ANALYTICS
   */
  recommendationInsights: {
    averageMatchScore: {
      type: Number,
      default: 0,
    },
    topMatchingStacks: [{
      stack: String,
      score: Number,
    }],
    strongestSkills: [String],
    weakestSkills: [String],
    recommendationReadiness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    }
  }
}, {
  timestamps: true,
});

/**
 * PERFORMANCE INDEXES
 */
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ 
  'extractedIntelligence.primaryStack': 1, 
  'extractedIntelligence.seniority': 1 
});
ResumeSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);