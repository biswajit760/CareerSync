const mongoose = require('mongoose');

const UserJobProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Primary Career Identity
  primaryRole: {
    type: String,
    required: true,
  },
  
  seniority: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
    required: true
  },
  
  yearsOfExperience: {
    type: Number,
    required: true
  },
  
  // Core Technical Skills
  skills: [{
    name: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    yearsUsed: {
      type: Number,
      default: 1
    },
    frequency: {
      type: String,
      enum: ['Rarely', 'Sometimes', 'Frequently', 'Daily'],
      default: 'Frequently'
    },
    lastMentioned: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Career History
  careerHistory: [{
    role: String,
    company: String,
    duration: Number,
    skills: [String],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Role Preferences
  preferredRoles: [String],
  
  targetSeniority: {
    type: String,
    enum: ['Any', 'Lateral Move', 'Growth', 'Leadership'],
    default: 'Growth'
  },
  
  // Preferences
  preferredIndustries: [String],
  
  companySize: {
    type: String,
    enum: ['Any', 'Startup', 'Scale-up', 'Enterprise'],
    default: 'Any'
  },
  
  workModel: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid', 'Any'],
    default: 'Any'
  },
  
  // Profile Metrics
  profileCompleteness: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  
  // Version Tracking
  resumeCount: {
    type: Number,
    default: 0
  },
  
  lastResumeAnalysis: {
    type: Date,
    index: true
  },
  
  analysisHistory: [{
    resumeId: mongoose.Schema.Types.ObjectId,
    extractedRole: String,
    matchedSkills: [String],
    newSkills: [String],
    analyzedAt: Date,
    confidence: Number,
  }],
  
  // Settings
  autoUpdate: {
    type: Boolean,
    default: true,
  },
  
  notifyOnNewJobs: {
    type: Boolean,
    default: true
  },
  
  statusFlags: {
    isActive: {
      type: Boolean,
      default: true
    },
    needsUpdate: {
      type: Boolean,
      default: false,
    },
    conflictingRoles: {
      type: Boolean,
      default: false,
    }
  },
  
  metadata: {
    lastProfileUpdate: Date,
    lastJobFetch: Date,
    totalJobsViewed: {
      type: Number,
      default: 0
    },
    jobApplicationRate: {
      type: Number,
      default: 0,
    }
  }
  
}, {
  timestamps: true
});


// ✅ FIXED: Modern Mongoose Hook (NO next)
UserJobProfileSchema.pre('save', function () {
  const fields = [
    this.primaryRole,
    this.seniority,
    this.yearsOfExperience,
    this.skills && this.skills.length > 0
  ];

  this.profileCompleteness = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );
});


module.exports = mongoose.model('UserJobProfile', UserJobProfileSchema);