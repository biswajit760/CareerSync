const JobCache = require('../model/JobCache');
const { fetchJobsFromAdzuna } = require('./job.service');

class JobCacheService {
  
  /**
   * Get jobs with caching strategy
   */
  async getJobsWithCache(role, seniority, forceRefresh = false) {
    try {
      // Generate cache key from role + seniority
      const queryKey = `${role.toLowerCase().replace(/\s+/g, '-')}-${seniority.toLowerCase()}`;
      
      // Check cache first
      if (!forceRefresh) {
        const cachedJobs = await this._getCachedJobs(queryKey);
        if (cachedJobs.length > 0) {
          console.log(`⚡ Cache HIT for: ${queryKey}`);
          return cachedJobs;
        }
      }
      
      console.log(`🔄 Cache MISS for: ${queryKey} - Fetching from Adzuna`);
      
      // Fetch from Adzuna
      const freshJobs = await fetchJobsFromAdzuna(role, seniority);
      
      // Store in cache
      await this._cacheJobs(freshJobs, queryKey);
      
      return freshJobs;
    } catch (error) {
      console.error('❌ JobCache Error:', error);
      
      // Fallback: return expired cache if available
      const expiredCache = await JobCache.find({
        queryKey: `${role.toLowerCase().replace(/\s+/g, '-')}-${seniority.toLowerCase()}`
      }).limit(50).lean();
      
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
    }).sort({ cachedAt: -1 }).limit(50).lean();
  }
  
  /**
   * Store jobs in cache
   */
  async _cacheJobs(jobs, queryKey) {
    if (!jobs || jobs.length === 0) {
      console.log(`⚠️ No jobs to cache for: ${queryKey}`);
      return;
    }

    const cacheDocuments = jobs.map(job => ({
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description,
      link: job.link,
      posted: job.posted,
      source: job.source || 'Adzuna',
      queryKey,
      baseMatchScore: 75,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24h TTL
    }));
    
    try {
      // Remove existing entries for this queryKey before inserting fresh data
      await JobCache.deleteMany({ queryKey });
      await JobCache.insertMany(cacheDocuments);
      console.log(`✅ Cached ${cacheDocuments.length} jobs for: ${queryKey}`);
    } catch (error) {
      console.error(`⚠️ Error caching jobs:`, error.message);
    }
  }  
  /**
   * Clear old cache (24+ hours)
   */
  async clearOldCache() {
    try {
      const deleted = await JobCache.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      
      console.log(`🧹 Cleared ${deleted.deletedCount} expired cache entries`);
      return deleted;
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      throw error;
    }
  }
  
  /**
   * Get cache statistics
   */
  async getCacheStats() {
    try {
      const totalCached = await JobCache.countDocuments();
      const activeCached = await JobCache.countDocuments({
        expiresAt: { $gt: new Date() }
      });
      
      return {
        totalCached,
        activeCached,
        expiredCount: totalCached - activeCached
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return { totalCached: 0, activeCached: 0, expiredCount: 0 };
    }
  }
}

module.exports = new JobCacheService();
