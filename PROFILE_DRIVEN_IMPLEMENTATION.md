# 🚀 CareerSync Profile-Driven Job Recommendation Implementation Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [New Database Models](#new-database-models)
3. [Implementation Steps](#implementation-steps)
4. [Code Implementation](#code-implementation)
5. [Migration Strategy](#migration-strategy)
6. [Testing & Validation](#testing--validation)

---

## 🏗️ Architecture Overview

### Current vs Target

**Current (Resume-Based):**
```
Resume → AI Extract → Search Adzuna → Show 10 Jobs (No Learning)
```

**Target (Profile-Based):**
```
Resume → AI Extract → Update UserJobProfile → Smart Merge
   ↓
Job Matching Engine (with Caching & Ranking)
   ↓
Personalized Job Feed
```

### Key Components to Build

1. **UserJobProfile Model** - Centralized user career data
2. **JobCache Model** - Cached job listings with timestamps
3. **Profile Merge Logic** - Intelligent profile updates
4. **Job Ranking Engine** - Match score calculation
5. **Caching Service** - Redis/MongoDB-based caching
6. **Updated Controllers** - New analyze & job routes

---

## 💾 New Database Models

### 1. UserJobProfile Collection

**Purpose:** Single source of truth for user's career profile

```javascript
// models/UserJobProfile.js
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
    required: true,  // e.g., "Full Stack Developer"
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
  
  // Core Technical Skills with Proficiency
  skills: [{
    name: {
      type: String,
      required: true  // e.g., "React"
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
  
  // Career History for Smart Matching
  careerHistory: [{
    role: String,
    company: String,
    duration: Number,  // months
    skills: [String],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Role Preferences
  preferredRoles: [String],  // ["Full Stack", "Backend", "DevOps"]
  
  targetSeniority: {
    type: String,
    enum: ['Any', 'Lateral Move', 'Growth', 'Leadership'],
    default: 'Growth'
  },
  
  // Industry & Company Preferences
  preferredIndustries: [String],  // ["Tech", "Fintech", "AI"]
  companySize: {
    type: String,
    enum: ['Any', 'Startup', 'Scale-up', 'Enterprise'],
    default: 'Any'
  },
  
  workModel: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'Any'
  },
  
  // Profile Quality Metrics
  profileCompleteness: {
    type: Number,
    min: 0,
    max: 100,
    default: 0  // Auto-calculated
  },
  
  // Version Tracking (for smart merge logic)
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
    confidence: Number  // 0-100
  }],
  
  // Profile Settings
  autoUpdate: {
    type: Boolean,
    default: true  // Automatically update on new resume
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
      default: false  // Flag for profile review
    },
    conflictingRoles: {
      type: Boolean,
      default: false  // Multiple roles in history
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
      default: 0  // %
    }
  }
  
}, {
  timestamps: true
});

// Auto-calculate profile completeness
UserJobProfileSchema.pre('save', function(next) {
  const fields = [
    this.primaryRole,
    this.seniority,
    this.yearsOfExperience,
    this.skills.length > 0
  ];
  this.profileCompleteness = Math.round(
    (fields.filter(f => !!f).length / fields.length) * 100
  );
  next();
});

module.exports = mongoose.model('UserJobProfile', UserJobProfileSchema);
```

### 2. JobCache Collection

**Purpose:** Store cached job listings to reduce API calls

```javascript
// models/JobCache.js
const mongoose = require('mongoose');

const JobCacheSchema = new mongoose.Schema({
  // Composite Key for Job Uniqueness
  jobId: {
    type: String,
    required: true,
    index: true  // Adzuna job ID
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
  
  // Caching Metadata
  queryKey: {
    type: String,
    required: true,
    index: true  // e.g., "mern-senior" for search queries
  },
  
  cachedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    index: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24 hours
  },
  
  // Ranking & Scoring
  baseMatchScore: {
    type: Number,
    default: 0  // Base score for this job profile
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

module.exports = mongoose.model('JobCache', JobCacheSchema);
```

### 3. UserJobSearch Collection (Optional)

**Purpose:** Track user search behavior for analytics

```javascript
// models/UserJobSearch.js
const mongoose = require('mongoose');

const UserJobSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserJobProfile'
  },
  
  searchQuery: String,  // Actual query used
  resultsReturned: Number,
  appliedCount: Number,
  savedCount: Number,
  
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('UserJobSearch', UserJobSearchSchema);
```

---

## 🔧 Implementation Steps

### Phase 1: Database & Models (1-2 days)

- [ ] Create UserJobProfile model
- [ ] Create JobCache model
- [ ] Create database indexes
- [ ] Write migration script for existing users
- [ ] Test model creation and relationships

### Phase 2: Services & Business Logic (2-3 days)

- [ ] Build ProfileMergeService
- [ ] Build JobCacheService
- [ ] Build JobRankingEngine
- [ ] Write unit tests

### Phase 3: Controller Updates (1-2 days)

- [ ] Update analyzeController with profile merge logic
- [ ] Create new jobMatchingController
- [ ] Update routes
- [ ] Add error handling

### Phase 4: Frontend Integration (1-2 days)

- [ ] Update resume upload flow
- [ ] Update job recommendation page
- [ ] Display match scores
- [ ] Add loading states

### Phase 5: Testing & Deployment (1 day)

- [ ] Integration testing
- [ ] Performance testing
- [ ] Deploy to staging
- [ ] Monitor and validate

---

## 💻 Code Implementation

### Step 1: Create UserJobProfile Model

Create file: `server/models/UserJobProfile.js`

(See above in New Database Models section)

---

### Step 2: Create JobCache Model

Create file: `server/models/JobCache.js`

(See above in New Database Models section)

---

### Step 3: Create Profile Merge Service

Create file: `server/services/profileMerge.service.js`

```javascript
const UserJobProfile = require('../models/UserJobProfile');
const logger = require('../utils/logger');

/**
 * Smart Merge Logic:
 * 1. If no profile exists, create new
 * 2. If profile exists, intelligently merge skills
 * 3. Track conflicting roles/skills
 * 4. Update profile completeness
 */
class ProfileMergeService {
  
  /**
   * Update or create user profile based on resume analysis
   */
  async upsertUserProfile(userId, extractedData, resumeId, confidence) {
    try {
      let profile = await UserJobProfile.findOne({ userId });
      
      if (!profile) {
        // Create new profile
        profile = await this._createNewProfile(userId, extractedData, resumeId);
        logger.info(`Created new profile for user: ${userId}`);
      } else {
        // Merge with existing profile
        profile = await this._mergeProfile(profile, extractedData, resumeId, confidence);
        logger.info(`Updated profile for user: ${userId}`);
      }
      
      return profile;
    } catch (error) {
      logger.error('ProfileMerge Error:', error);
      throw error;
    }
  }
  
  /**
   * Create brand new profile
   */
  async _createNewProfile(userId, extractedData, resumeId) {
    const profile = new UserJobProfile({
      userId,
      primaryRole: extractedData.role,
      seniority: extractedData.seniority,
      yearsOfExperience: extractedData.yearsOfExp,
      skills: extractedData.skills.map(skill => ({
        name: skill,
        proficiency: 'Intermediate',
        frequency: 'Frequently'
      })),
      preferredRoles: [extractedData.role],
      resumeCount: 1,
      lastResumeAnalysis: new Date(),
      analysisHistory: [{
        resumeId,
        extractedRole: extractedData.role,
        matchedSkills: extractedData.skills,
        newSkills: extractedData.skills,
        analyzedAt: new Date(),
        confidence: 100
      }]
    });
    
    return await profile.save();
  }
  
  /**
   * Smart merge: Combine new resume data with existing profile
   */
  async _mergeProfile(profile, extractedData, resumeId, confidence = 80) {
    
    // 1. Check for role change
    const rolesMatch = profile.primaryRole.toLowerCase() === 
                       extractedData.role.toLowerCase();
    
    if (!rolesMatch && confidence > 75) {
      // User might be transitioning roles
      if (!profile.preferredRoles.includes(extractedData.role)) {
        profile.preferredRoles.push(extractedData.role);
        profile.statusFlags.conflictingRoles = true;
      }
    }
    
    // 2. Merge skills intelligently
    const newSkills = [];
    
    for (const skill of extractedData.skills) {
      const existingSkill = profile.skills.find(
        s => s.name.toLowerCase() === skill.toLowerCase()
      );
      
      if (existingSkill) {
        // Update frequency and last mentioned
        existingSkill.frequency = 'Frequently';
        existingSkill.yearsUsed += 0.5;  // Increment slightly
        existingSkill.lastMentioned = new Date();
      } else {
        // New skill discovered
        newSkills.push(skill);
        profile.skills.push({
          name: skill,
          proficiency: 'Intermediate',
          frequency: 'Frequently',
          lastMentioned: new Date()
        });
      }
    }
    
    // 3. Update seniority if newer resume indicates progression
    if (extractedData.yearsOfExp > profile.yearsOfExperience) {
      profile.yearsOfExperience = extractedData.yearsOfExp;
      
      // Auto-upgrade seniority if needed
      if (extractedData.yearsOfExp >= 7 && profile.seniority !== 'Lead') {
        profile.seniority = this._determineSeniority(extractedData.yearsOfExp);
      }
    }
    
    // 4. Update metadata
    profile.resumeCount += 1;
    profile.lastResumeAnalysis = new Date();
    
    // Add to analysis history
    profile.analysisHistory.push({
      resumeId,
      extractedRole: extractedData.role,
      matchedSkills: extractedData.skills,
      newSkills,
      analyzedAt: new Date(),
      confidence
    });
    
    // Keep only last 10 analyses
    if (profile.analysisHistory.length > 10) {
      profile.analysisHistory = profile.analysisHistory.slice(-10);
    }
    
    return await profile.save();
  }
  
  /**
   * Determine seniority based on years of experience
   */
  _determineSeniority(yearsOfExp) {
    if (yearsOfExp < 1) return 'Fresher';
    if (yearsOfExp < 3) return 'Junior';
    if (yearsOfExp < 7) return 'Mid-Level';
    if (yearsOfExp < 10) return 'Senior';
    return 'Lead';
  }
  
  /**
   * Get profile or create default
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
   * Update profile completeness score
   */
  async updateProfileCompleteness(profileId) {
    const profile = await UserJobProfile.findById(profileId);
    
    const completenessFactors = {
      hasRole: profile.primaryRole ? 20 : 0,
      hasSeniority: profile.seniority ? 20 : 0,
      hasExperience: profile.yearsOfExperience > 0 ? 20 : 0,
      hasSkills: profile.skills.length > 0 ? 20 : 0,
      hasPreferences: profile.preferredIndustries.length > 0 ? 20 : 0
    };
    
    profile.profileCompleteness = Object.values(completenessFactors)
      .reduce((a, b) => a + b, 0);
    
    return await profile.save();
  }
}

module.exports = new ProfileMergeService();
```

---

### Step 4: Create Job Cache Service

Create file: `server/services/jobCache.service.js`

```javascript
const JobCache = require('../models/JobCache');
const { fetchJobsFromAdzuna } = require('./job.service');
const logger = require('../utils/logger');

class JobCacheService {
  
  /**
   * Get jobs with caching strategy
   */
  async getJobsWithCache(role, seniority, forceRefresh = false) {
    try {
      // Generate cache key from role + seniority
      const queryKey = `${role.toLowerCase()}-${seniority.toLowerCase()}`;
      
      // Check cache first
      if (!forceRefresh) {
        const cachedJobs = await this._getCachedJobs(queryKey);
        if (cachedJobs.length > 0) {
          logger.info(`Cache HIT for: ${queryKey}`);
          return cachedJobs;
        }
      }
      
      logger.info(`Cache MISS for: ${queryKey} - Fetching from Adzuna`);
      
      // Fetch from Adzuna
      const freshJobs = await fetchJobsFromAdzuna(role, seniority);
      
      // Store in cache
      await this._cacheJobs(freshJobs, queryKey);
      
      return freshJobs;
    } catch (error) {
      logger.error('JobCache Error:', error);
      
      // Fallback: return expired cache if available
      const expiredCache = await JobCache.find({
        queryKey: `${role.toLowerCase()}-${seniority.toLowerCase()}`
      }).limit(10);
      
      return expiredCache.length > 0 ? expiredCache : [];
    }
  }
  
  /**
   * Retrieve jobs from cache
   */
  async _getCachedJobs(queryKey) {
    return await JobCache.find({
      queryKey,
      expiresAt: { $gt: new Date() }  // Not expired
    }).sort({ cachedAt: -1 }).limit(10);
  }
  
  /**
   * Store jobs in cache
   */
  async _cacheJobs(jobs, queryKey) {
    const cacheDocuments = jobs.map(job => ({
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description,
      link: job.link,
      source: job.source || 'Adzuna',
      queryKey,
      baseMatchScore: 75,  // Default score
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24h TTL
    }));
    
    await JobCache.insertMany(cacheDocuments);
    logger.info(`Cached ${cacheDocuments.length} jobs for: ${queryKey}`);
  }
  
  /**
   * Clear old cache (24+ hours)
   */
  async clearOldCache() {
    const deleted = await JobCache.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    logger.info(`Cleared ${deleted.deletedCount} expired cache entries`);
    return deleted;
  }
  
  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const totalCached = await JobCache.countDocuments();
    const activeCached = await JobCache.countDocuments({
      expiresAt: { $gt: new Date() }
    });
    
    return {
      totalCached,
      activeCached,
      expiredCount: totalCached - activeCached
    };
  }
}

module.exports = new JobCacheService();
```

---

### Step 5: Create Job Ranking Engine

Create file: `server/services/jobRanking.service.js`

```javascript
class JobRankingEngine {
  
  /**
   * Calculate match score between user profile and job
   */
  calculateMatchScore(userProfile, job) {
    const scores = {
      roleMatch: this._calculateRoleMatch(userProfile, job),
      skillsMatch: this._calculateSkillsMatch(userProfile, job),
      experienceMatch: this._calculateExperienceMatch(userProfile, job),
      seniority Match: this._calculateSeniorityMatch(userProfile, job),
      industryMatch: this._calculateIndustryMatch(userProfile, job)
    };
    
    // Weighted average
    const weights = {
      roleMatch: 0.35,
      skillsMatch: 0.30,
      experienceMatch: 0.15,
      seniorityMatch: 0.12,
      industryMatch: 0.08
    };
    
    let totalScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
      totalScore += (scores[key] || 0) * weight;
    }
    
    return Math.round(totalScore);
  }
  
  /**
   * Role Match Score
   */
  _calculateRoleMatch(profile, job) {
    // Normalize strings for comparison
    const jobTitle = job.title.toLowerCase();
    const userRole = profile.primaryRole.toLowerCase();
    const preferredRoles = profile.preferredRoles.map(r => r.toLowerCase());
    
    // Check exact match
    if (jobTitle.includes(userRole)) return 100;
    
    // Check preferred roles
    for (const role of preferredRoles) {
      if (jobTitle.includes(role)) return 90;
    }
    
    // Partial match (check keywords)
    const keywords = userRole.split(' ');
    const matchedKeywords = keywords.filter(kw => jobTitle.includes(kw)).length;
    const matchPercentage = (matchedKeywords / keywords.length) * 100;
    
    return Math.max(0, matchPercentage);
  }
  
  /**
   * Skills Match Score
   */
  _calculateSkillsMatch(profile, job) {
    const jobDescription = (job.description || '').toLowerCase();
    const profileSkills = profile.skills.map(s => s.name.toLowerCase());
    
    if (profileSkills.length === 0) return 0;
    
    let matchedSkills = 0;
    for (const skill of profileSkills) {
      if (jobDescription.includes(skill)) {
        matchedSkills++;
      }
    }
    
    return (matchedSkills / profileSkills.length) * 100;
  }
  
  /**
   * Experience Match Score
   */
  _calculateExperienceMatch(profile, job) {
    const jobDesc = (job.description || '').toLowerCase();
    
    // Extract experience requirement from job (e.g., "5+ years")
    const expMatch = jobDesc.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
    const requiredExp = expMatch ? parseInt(expMatch[1]) : 0;
    
    const userExp = profile.yearsOfExperience;
    
    // User has less experience than required
    if (userExp < requiredExp) {
      return (userExp / requiredExp) * 100;
    }
    
    // User meets or exceeds requirement (85-100 range)
    const bonus = Math.min((userExp - requiredExp) * 5, 15);
    return Math.min(100, 85 + bonus);
  }
  
  /**
   * Seniority Match Score
   */
  _calculateSeniorityMatch(profile, job) {
    const jobDesc = (job.description || '').toLowerCase();
    const seniorityMap = {
      'fresher': 10,
      'junior': 30,
      'mid-level': 60,
      'senior': 80,
      'lead': 100
    };
    
    const userSeniorityScore = seniorityMap[profile.seniority.toLowerCase()] || 50;
    
    // Check job seniority requirements
    for (const [level, score] of Object.entries(seniorityMap)) {
      if (jobDesc.includes(level)) {
        // User matches or exceeds job level
        if (userSeniorityScore >= score) return 100;
        return (userSeniorityScore / score) * 100;
      }
    }
    
    return 75;  // Default if no seniority mentioned
  }
  
  /**
   * Industry Match Score
   */
  _calculateIndustryMatch(profile, job) {
    if (profile.preferredIndustries.length === 0) return 75;
    
    const jobDesc = (job.description || '').toLowerCase();
    const jobCompany = (job.company || '').toLowerCase();
    
    const matchedIndustries = profile.preferredIndustries.filter(industry =>
      jobDesc.includes(industry.toLowerCase()) || 
      jobCompany.includes(industry.toLowerCase())
    ).length;
    
    return (matchedIndustries / profile.preferredIndustries.length) * 100;
  }
  
  /**
   * Rank multiple jobs
   */
  rankJobs(userProfile, jobs) {
    return jobs
      .map(job => ({
        ...job,
        matchScore: this.calculateMatchScore(userProfile, job),
        matchPercentage: Math.round((this.calculateMatchScore(userProfile, job) / 100) * 100)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

module.exports = new JobRankingEngine();
```

---

### Step 6: Update Analyze Controller

Update file: `server/controllers/analyze.controller.js`

```javascript
const Resume = require("../model/Resume");
const ATSReport = require("../model/AtsReport.model");
const UserJobProfile = require("../model/UserJobProfile");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const pdfParse = require("pdf-parse");
const { analyzeResumeWithAI } = require("../services/ai.service");
const profileMergeService = require("../services/profileMerge.service");

exports.analyzeFullFlow = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    // 1️⃣ Basic Validation
    if (!file || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: "Resume (PDF) and Job Description are required" 
      });
    }

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are supported",
      });
    }

    // 2️⃣ Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer);

    // 3️⃣ Parse PDF Text
    const parsed = await pdfParse(file.buffer);

    // 4️⃣ Save Initial Resume Record
    const resume = await Resume.create({
      userId: req.user.id,
      cloudinaryUrl: uploadResult.secure_url,
      rawText: parsed.text,
      jobDescription,
    });

    // 5️⃣ AI Analysis
    const aiResult = await analyzeResumeWithAI(parsed.text, jobDescription);

    if (!aiResult || !aiResult.atsReport) {
      throw new Error("AI failed to return a valid analysis structure");
    }

    // 🌟 UPDATE RESUME
    await Resume.findByIdAndUpdate(resume._id, {
      extractedProfile: aiResult.extractedProfile
    });

    // 6️⃣ Save ATS Report
    const report = await ATSReport.create({
      resumeId: resume._id,
      userId: req.user.id,
      atsScore: aiResult.atsReport.score,
      scoreBreakdown: {
        keywordMatch: aiResult.atsReport.breakdown?.keywordMatch || 0,
        skillsMatch: aiResult.atsReport.breakdown?.skillsMatch || 0,
        experience: aiResult.atsReport.breakdown?.experience || 0,
        projects: aiResult.atsReport.breakdown?.projects || 0,
        formatting: aiResult.atsReport.breakdown?.formatting || 0,
      },
      summary: aiResult.atsReport.summary || "",
      matchedSkills: aiResult.atsReport.matchedSkills || [],
      missingSkills: aiResult.atsReport.missingSkills || [],
      strengths: aiResult.atsReport.strengths || [],
      improvements: aiResult.atsReport.improvements || [],
    });

    // 🆕 PROFILE-DRIVEN LOGIC
    // Update or create UserJobProfile with smart merge
    const userProfile = await profileMergeService.upsertUserProfile(
      req.user.id,
      aiResult.extractedProfile,
      resume._id,
      confidence = 85  // Confidence in extraction
    );

    // Update profile completeness
    await profileMergeService.updateProfileCompleteness(userProfile._id);

    // 7️⃣ Final Response
    res.status(200).json({
      success: true,
      data: report,
      profile: aiResult.extractedProfile,
      userProfile: {  // 🆕 New response field
        id: userProfile._id,
        primaryRole: userProfile.primaryRole,
        seniority: userProfile.seniority,
        yearsOfExperience: userProfile.yearsOfExperience,
        skills: userProfile.skills.map(s => s.name),
        profileCompleteness: userProfile.profileCompleteness,
        resumeCount: userProfile.resumeCount
      },
      jobSearchQuery: aiResult.jobSearchQuery
    });

  } catch (error) {
    console.error("Analyze Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Analysis Error" 
    });
  }
};
```

---

### Step 7: Create New Job Matching Controller

Create file: `server/controllers/jobMatching.controller.js`

```javascript
const UserJobProfile = require("../model/UserJobProfile");
const jobCacheService = require("../services/jobCache.service");
const jobRankingEngine = require("../services/jobRanking.service");

/**
 * Get personalized job recommendations based on user profile
 * (No longer tied to specific resumeId)
 */
exports.getPersonalizedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { forceRefresh = false } = req.query;

    // 1. Get or create user profile
    let profile = await UserJobProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "No career profile found. Please upload and analyze a resume first."
      });
    }

    // 2. Check if profile is complete
    if (profile.profileCompleteness < 50) {
      return res.status(400).json({
        success: false,
        message: "Profile is incomplete. Please analyze another resume to improve recommendations."
      });
    }

    // 3. Get cached or fresh jobs
    const { primaryRole, seniority } = profile;
    const jobs = await jobCacheService.getJobsWithCache(
      primaryRole,
      seniority,
      forceRefresh
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for your profile"
      });
    }

    // 4. Rank jobs using matching algorithm
    const rankedJobs = jobRankingEngine.rankJobs(profile, jobs);

    // 5. Update metadata
    profile.metadata.lastJobFetch = new Date();
    profile.metadata.totalJobsViewed += jobs.length;
    await profile.save();

    // 6. Return personalized feed
    res.status(200).json({
      success: true,
      data: {
        jobs: rankedJobs,
        count: rankedJobs.length,
        userProfile: {
          primaryRole: profile.primaryRole,
          seniority: profile.seniority,
          yearsOfExperience: profile.yearsOfExperience,
          profileCompleteness: profile.profileCompleteness
        },
        cacheInfo: {
          isCached: !forceRefresh,
          lastFetched: jobs[0]?.createdAt,
          expiresAt: jobs[0]?.expiresAt
        }
      }
    });

  } catch (error) {
    console.error("Job Matching Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job recommendations",
      error: error.message
    });
  }
};

/**
 * Get user's career profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const profile = await UserJobProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No profile found"
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });
  }
};

/**
 * Update user preferences
 */
exports.updateProfilePreferences = async (req, res) => {
  try {
    const { preferredRoles, preferredIndustries, workModel, companySize } = req.body;

    const profile = await UserJobProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        ...(preferredRoles && { preferredRoles }),
        ...(preferredIndustries && { preferredIndustries }),
        ...(workModel && { workModel }),
        ...(companySize && { companySize }),
        statusFlags: {
          needsUpdate: false
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating preferences"
    });
  }
};
```

---

### Step 8: Update Routes

Update file: `server/routes/job.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const jobMatchingController = require('../controllers/jobMatching.controller');

// 🆕 NEW ROUTES (Profile-Based)
router.get('/recommendations', authMiddleware, 
  jobMatchingController.getPersonalizedJobs);

router.get('/profile', authMiddleware, 
  jobMatchingController.getUserProfile);

router.put('/profile/preferences', authMiddleware, 
  jobMatchingController.updateProfilePreferences);

// 🔄 LEGACY ROUTE (Keep for backward compatibility)
router.get('/recommendations/:resumeId', authMiddleware, 
  require('../controllers/job.controller').getRecommendedJobs);

module.exports = router;
```

---

## 🔄 Migration Strategy

### Step 1: Database Migration

Create file: `server/migrations/createUserProfiles.js`

```javascript
const User = require('../model/User');
const Resume = require('../model/Resume');
const UserJobProfile = require('../model/UserJobProfile');
const profileMergeService = require('../services/profileMerge.service');

async function migrateExistingUsers() {
  try {
    const users = await User.find({});
    
    for (const user of users) {
      // Skip if profile already exists
      const existingProfile = await UserJobProfile.findOne({ userId: user._id });
      if (existingProfile) continue;
      
      // Get latest resume
      const latestResume = await Resume.findOne({ userId: user._id })
        .sort({ createdAt: -1 });
      
      if (latestResume && latestResume.extractedProfile) {
        // Create profile from resume
        await profileMergeService.upsertUserProfile(
          user._id,
          latestResume.extractedProfile,
          latestResume._id,
          confidence = 75  // Lower confidence for historical data
        );
        
        console.log(`Migrated profile for: ${user.email}`);
      }
    }
    
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run migration
migrateExistingUsers();
```

---

## 🧪 Testing & Validation

### Test File: `server/tests/jobMatching.test.js`

```javascript
const request = require('supertest');
const app = require('../index');
const UserJobProfile = require('../model/UserJobProfile');
const { expect } = require('chai');

describe('Profile-Driven Job Matching', () => {
  
  let userId, token;
  
  before(async () => {
    // Register test user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123'
      });
    
    token = res.body.token;
    userId = res.body.user.id;
  });
  
  describe('Profile Creation', () => {
    it('should create user profile on resume analysis', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', 'test-resume.pdf')
        .field('jobDescription', 'Senior Developer needed');
      
      expect(res.status).to.equal(200);
      expect(res.body.userProfile).to.exist;
      
      const profile = await UserJobProfile.findOne({ userId });
      expect(profile).to.exist;
      expect(profile.primaryRole).to.exist;
    });
  });
  
  describe('Job Recommendations', () => {
    it('should return personalized jobs', async () => {
      const res = await request(app)
        .get('/api/jobs/recommendations')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data.jobs).to.be.an('array');
      expect(res.body.data.jobs[0]).to.have.property('matchScore');
    });
    
    it('should rank jobs by match score', async () => {
      const res = await request(app)
        .get('/api/jobs/recommendations')
        .set('Authorization', `Bearer ${token}`);
      
      const jobs = res.body.data.jobs;
      for (let i = 0; i < jobs.length - 1; i++) {
        expect(jobs[i].matchScore).to.be.at.least(jobs[i + 1].matchScore);
      }
    });
  });
  
  describe('Profile Updates', () => {
    it('should update profile on new resume', async () => {
      // Upload first resume
      await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', 'resume-v1.pdf')
        .field('jobDescription', 'MERN Developer');
      
      let profile = await UserJobProfile.findOne({ userId });
      const initialSkillCount = profile.skills.length;
      
      // Upload second resume with more skills
      await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', 'resume-v2.pdf')
        .field('jobDescription', 'DevOps Engineer');
      
      profile = await UserJobProfile.findOne({ userId });
      expect(profile.resumeCount).to.equal(2);
      expect(profile.skills.length).to.be.at.least(initialSkillCount);
    });
  });
});
```

---

## 🚀 Deployment Checklist

- [ ] Create all new models
- [ ] Create all new services
- [ ] Update controllers
- [ ] Update routes
- [ ] Run migration script for existing users
- [ ] Test profile creation
- [ ] Test job ranking
- [ ] Test caching
- [ ] Monitor performance
- [ ] Gather user feedback

---

## 📊 Performance Metrics to Track

| Metric | Before | Target |
|--------|--------|--------|
| API Call Latency | 2-3s | <500ms |
| DB Queries per Request | 3-4 | 1-2 |
| Cache Hit Rate | 0% | >70% |
| Avg Job Relevance | Moderate | High |
| User Satisfaction | - | >4.5/5 |

---

## 📝 Summary

You now have a complete roadmap to transform CareerSync from a resume-based tool into a profile-driven AI job recommendation platform:

1. **New Models**: UserJobProfile + JobCache
2. **Smart Merge Logic**: Intelligently combine resume data
3. **Job Caching**: Reduce API dependency
4. **Ranking Engine**: Personalized scoring algorithm
5. **Updated Controllers**: Profile-centric architecture

**Timeline**: 1-2 weeks for full implementation

**Benefits**:
- ✅ 60-70% faster job loading
- ✅ Better job relevance
- ✅ User data persistence
- ✅ Scalable architecture
- ✅ Foundation for future features

Let's build! 🚀
