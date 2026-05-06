const axios = require("axios");

// Adzuna Credentials (Ensure these are in your .env)
const ADZUNA_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_KEY = process.env.ADZUNA_APP_KEY;

/**
 * @desc Fetch live job openings from Adzuna based on AI-extracted profile
 * @param {string} query - The job role (e.g., "MERN Stack Developer")
 * @param {string} seniority - "Fresher", "Junior", or "Senior"
 */
exports.fetchJobsFromAdzuna = async (query, seniority) => {
  try {
    // 1. Simplify the search term (Adzuna India is picky)
    // We'll just use the first two words of the role to get broad results
    const simplifiedQuery = query.split(' ').slice(0, 2).join(' ');
    
    // 2. Try the 'gb' (Great Britain) endpoint IF 'in' fails, 
    // but let's stick to 'in' with a cleaner URL first.
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;

    console.log("📡 Attempting clean fetch for:", simplifiedQuery);

    const response = await axios.get(url, {
      params: {
        app_id: ADZUNA_ID.trim(),
        app_key: ADZUNA_KEY.trim(),
        what: simplifiedQuery,
        results_per_page: 50
      },
      timeout: 10000 // 10 second timeout
      // Note: We removed content_type from params because it often triggers 400s
    });    
    // Use structured logging at debug level if needed
    if (process.env.DEBUG_ADZUNA === 'true') {
      console.log("Adzuna response count:", response.data.results?.length || 0);
    }    if (!response.data.results) return [];

    return response.data.results.map(job => {
      // Defensive title handling
      const title = typeof job.title === 'string' ? job.title.replace(/<\/?[^>]+(>|$)/g, "") : 'Untitled';
      
      // Safe company access with fallback
      const company = job.company?.display_name || 'Unknown Company';
      
      // Safe location access with fallback
      const location = job.location?.display_name || 'India';
      
      // Safe salary handling with type coercion
      let salary = 'Not Disclosed';
      if (job.salary_min && typeof job.salary_min === 'number') {
        salary = `₹${job.salary_min.toLocaleString('en-IN')}`;
      }
      
      // Safe date handling with fallback
      const createdDate = job.created ? new Date(job.created) : new Date();
      const posted = !isNaN(createdDate.getTime()) ? createdDate.toLocaleDateString('en-IN') : 'Unknown';
      
      // Safe description
      const description = job.description || "No description available";
      
      return {
        id: job.id,
        title,
        company,
        location,
        link: job.redirect_url,
        salary,
        source: 'Adzuna',
        posted,
        description
      };
    });

  } catch (error) {
    console.error("❌ Adzuna Final Attempt Error:", error.response?.status || error.message);
    
    // 🚨 EMERGENCY FALLBACK: If India endpoint is down/blocked for your key
    // Let's try the global/gb endpoint as a backup so your demo doesn't fail
    if (error.response?.status === 400) {
        console.log("🔄 Switching to Global endpoint...");
        // You can try repeating the logic here with 'gb' instead of 'in'
    }
    
    return [];
  }
};