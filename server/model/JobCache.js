const mongoose = require('mongoose');

const JobCacheSchema = new mongoose.Schema({
  // Job Uniqueness
  jobId: {
    type: String,
    required: true,
    index: true,
  },
  
  // Job Details
  title: String,
  company: String,
  location: String,
  salary: String,
  description: String,
  link: String,
  source: {
    type: String,
    default: 'Adzuna'
  },
  posted: String,
  
  // Caching Metadata
  queryKey: {
    type: String,
    required: true,
    index: true,
  },
  
  cachedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    index: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  
  // Ranking & Scoring
  baseMatchScore: {
    type: Number,
    default: 0,
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  searchCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// TTL Index: Auto-delete expired cache after 24h
JobCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
JobCacheSchema.index({ queryKey: 1, expiresAt: 1 });

module.exports = mongoose.model('JobCache', JobCacheSchema);
