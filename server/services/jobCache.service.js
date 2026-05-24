const JobCache = require('../model/JobCache');
const { fetchJobsFromAdzuna } = require('./job.service');

/**
 * ENHANCED JOB CACHE SERVICE
 * ==========================
 * Features:
 * - Configurable TTL per stack (different expiry for different job types)
 * - Stale cache with serving + refresh pattern
 * - Cache warmth tracking
 * - Automatic background cache cleanup
 */

const CACHE_TTL = {
  mern: 24 * 60 * 60 * 1000,      // 24 hours
  php: 24 * 60 * 60 * 1000,
  java: 24 * 60 * 60 * 1000,
  dotnet: 24 * 60 * 60 * 1000,
  python: 24 * 60 * 60 * 1000,
  general: 12 * 60 * 60 * 1000,   // 12 hours - refresh more often
};

const STALE_TTL = 48 * 60 * 60 * 1000; // Serve stale cache if fresh unavailable

class JobCacheService {

  constructor() {
    this.stackCategories = {
      mern: ["mern", "react", "node", "mongodb", "express", "next"],
      php: ["php", "laravel"],
      dotnet: [".net", "c#", "asp.net"],
      java: ["java", "spring"],
      python: ["python", "django", "flask"],
    };
    
    // Start background cleanup job
    this._startCleanupJob();
  }

  /**
   * DETECT STACK FROM ROLE
   */
  _detectStack(role = "") {
    const normalized = role.toLowerCase();

    for (const [stack, keywords] of Object.entries(this.stackCategories)) {
      if (
        keywords.some(keyword =>
          normalized.includes(keyword.toLowerCase())
        )
      ) {
        return stack;
      }
    }

    return "general";
  }

  /**
   * GENERATE CACHE KEY
   */
  _generateCacheKey(role, seniority) {
    const normalizedRole = role
      .toLowerCase()
      .replace(/\s+/g, '-');

    const normalizedSeniority = seniority.toLowerCase();
    const stack = this._detectStack(role);

    return `${normalizedRole}-${stack}-${normalizedSeniority}`;
  }

  /**
   * GET TTL FOR STACK (in milliseconds)
   */
  _getTTL(stack) {
    return CACHE_TTL[stack] || CACHE_TTL.general;
  }

  /**
   * GET JOBS WITH CACHE - Enhanced with stale serving
   */
  async getJobsWithCache(role, seniority, forceRefresh = false) {
    try {
      const queryKey = this._generateCacheKey(role, seniority);
      const stack = this._detectStack(role);

      // 1. CHECK FRESH CACHE FIRST
      if (!forceRefresh) {
        const freshJobs = await this._getCachedJobs(queryKey, false);

        if (freshJobs.length > 0) {
          console.log(`⚡ Cache HIT (fresh) for: ${queryKey} [${freshJobs.length} jobs]`);
          return freshJobs;
        }
      }

      console.log(`🔄 Cache MISS for: ${queryKey} - Fetching fresh jobs...`);

      // 2. FETCH FRESH JOBS FROM API
      const freshJobs = await fetchJobsFromAdzuna(role, seniority);

      // 3. CACHE FRESH DATA
      if (freshJobs.length > 0) {
        await this._cacheJobs(freshJobs, queryKey, stack);
      } else {
        console.warn(`⚠️ No jobs returned from API for: ${queryKey}`);
      }

      // 4. FALLBACK: Serve stale cache if fresh fetch failed
      if (freshJobs.length === 0) {
        const staleJobs = await this._getCachedJobs(queryKey, true);
        if (staleJobs.length > 0) {
          console.log(`📦 Serving stale cache for: ${queryKey} [${staleJobs.length} jobs]`);
          return staleJobs;
        }
      }

      return freshJobs;

    } catch (error) {
      console.error('❌ JobCache Error:', error.message);

      // Try to serve ANY available cache
      const queryKey = this._generateCacheKey(role, seniority);
      const anyCache = await JobCache.find({ queryKey })
        .sort({ cachedAt: -1 })
        .limit(50)
        .lean();

      if (anyCache.length > 0) {
        console.log(`📦 Emergency fallback: Serving ${anyCache.length} cached jobs`);
        return anyCache;
      }

      return [];
    }
  }

  /**
   * RETRIEVE CACHE - with option for stale serving
   */
  async _getCachedJobs(queryKey, allowStale = false) {
    const now = new Date();
    
    const query = allowStale
      ? { queryKey, expiresAt: { $gt: new Date(now - STALE_TTL) } }
      : { queryKey, expiresAt: { $gt: now } };

    const jobs = await JobCache.find(query)
      .sort({ cachedAt: -1 })
      .limit(50)
      .lean();

    return jobs;
  }

  /**
   * STORE CACHE - with stack-specific TTL
   */
 
  async _cacheJobs(jobs, queryKey, stack = "general") {
    if (!jobs || jobs.length === 0) {
      console.log(`⚠️ No jobs to cache for: ${queryKey}`);
      return;
    }

    const ttl = this._getTTL(stack);
    const expiryTime = new Date(Date.now() + ttl);

    const cacheDocuments = jobs.map(job => ({
      // FIX: Matches externalJobId from normalized job object
      externalJobId: job.externalJobId, 
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: job.description,
      // FIX: Maps 'link' from job.service to 'applyUrl' in JobCache model
      applyUrl: job.link, 
      posted: job.posted,
      source: job.source || 'Adzuna',
      jobType: job.jobType,
      requirements: job.requirements || [],
      // FIX: Uses the stack detected in job.service
      detectedStack: job.detectedStack || stack,

      // EXPERIENCE REQUIREMENT
      experienceRequired: job.experienceRequired || null,

      queryKey,
      cachedAt: new Date(),
      expiresAt: expiryTime,
    }));

    try {
      // FIX: Add { ordered: false } to skip duplicates without failing the batch
      await JobCache.insertMany(cacheDocuments, { ordered: false });

      console.log(`✅ Cached fresh jobs for: ${queryKey} [TTL: ${Math.round(ttl / 3600000)}h]`);

    } catch (error) {
      // 11000 is the MongoDB code for "Duplicate Key"
      if (error.code === 11000) {
        console.log(`ℹ️ Duplicate jobs detected for ${queryKey}; skipped duplicates and saved new entries.`);
      } else {
        console.error(`⚠️ Error caching jobs:`, error.message);
      }
    }
  }

  /**
   * BACKGROUND JOB: Auto-cleanup expired cache every hour
   */
  _startCleanupJob() {
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        this.clearExpiredCache().catch(err => 
          console.error('Background cleanup failed:', err.message)
        );
      }, 60 * 60 * 1000); // Every 1 hour
    }
  }

  /**
   * CLEAR EXPIRED CACHE
   */
  async clearExpiredCache() {
    try {
      const deleted = await JobCache.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      if (deleted.deletedCount > 0) {
        console.log(`🧹 Cleared ${deleted.deletedCount} expired cache entries`);
      }

      return deleted;

    } catch (error) {
      console.error('❌ Error clearing cache:', error.message);
      throw error;
    }
  }

  /**
   * CACHE STATISTICS
   */
  async getCacheStats() {
    try {
      const totalCached = await JobCache.countDocuments();
      const activeCached = await JobCache.countDocuments({
        expiresAt: { $gt: new Date() }
      });
      const staleCached = totalCached - activeCached;

      return {
        total: totalCached,
        active: activeCached,
        stale: staleCached,
        stalePercentage: totalCached > 0 ? Math.round((staleCached / totalCached) * 100) : 0,
      };

    } catch (error) {
      console.error('❌ Error getting cache stats:', error.message);
      return { total: 0, active: 0, stale: 0 };
    }
  }
}

module.exports = new JobCacheService();