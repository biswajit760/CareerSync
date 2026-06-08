const User = require("../model/User");
const Resume = require("../model/Resume");
const UserJobProfile = require("../model/UserJobProfile");
const AtsReport = require("../model/AtsReport.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Get comprehensive dashboard data for the authenticated user
 * Includes: stats, performance trajectory, skills, benchmarks, etc.
 */
exports.getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all necessary data in parallel
  const [user, latestAtsReport, allAtsReports, userProfile, resumes] = await Promise.all([
    User.findById(userId),
    AtsReport.findOne({ userId }).sort({ createdAt: -1 }),
    AtsReport.find({ userId }).sort({ createdAt: -1 }).limit(12), // 12 months of data
    UserJobProfile.findOne({ userId }),
    Resume.find({ userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // ============= BUILD STATS =============
  const stats = {
    atsScore: latestAtsReport?.atsScore || 0,
    savedLeads: user.savedJobs?.length || 0,
    aiScans: user.scanCount || 0,
    marketFit: calculateMarketFit(userProfile, latestAtsReport),
    scansThisMonth: calculateScansThisMonth(allAtsReports),
    weeklyGrowth: calculateWeeklyGrowth(allAtsReports),
  };

  // ============= PERFORMANCE TRAJECTORY =============
  const performanceTrajectory = buildPerformanceTrajectory(allAtsReports);

  // ============= SKILL RADAR DATA =============
  const skillRadarData = buildSkillRadarData(userProfile);

  // ============= ATS BENCHMARK DATA =============
  const atsBenchmark = buildAtsBenchmarkData(latestAtsReport);

  // ============= WEEKLY APPLICATIONS =============
  const weeklyApplications = buildWeeklyApplicationsData(allAtsReports);

  // ============= SAVED JOBS WITH RECENT DATA =============
  const savedJobsList = buildSavedJobsList(user.savedJobs, latestAtsReport);

  // ============= ATS BREAKDOWN =============
  const atsBreakdown = buildAtsBreakdown(latestAtsReport);

  // ============= USER INFO =============
  const userInfo = {
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    plan: user.plan,
    joinedAt: user.createdAt,
  };

  // ============= INSIGHTS & RECOMMENDATIONS =============
  const insights = generateInsights(stats, latestAtsReport, userProfile);

  res.status(200).json({
    success: true,
    data: {
      stats,
      userInfo,
      performanceTrajectory,
      skillRadarData,
      atsBenchmark,
      weeklyApplications,
      savedJobsList,
      atsBreakdown,
      insights,
      lastUpdated: latestAtsReport?.createdAt || new Date(),
    },
  });
});

/**
 * Get dashboard stats only (lightweight endpoint for quick refreshes)
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [user, latestAtsReport, allAtsReports, userProfile] = await Promise.all([
    User.findById(userId),
    AtsReport.findOne({ userId }).sort({ createdAt: -1 }),
    AtsReport.find({ userId }).sort({ createdAt: -1 }).limit(12),
    UserJobProfile.findOne({ userId }),
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const stats = {
    atsScore: latestAtsReport?.atsScore || 0,
    savedLeads: user.savedJobs?.length || 0,
    aiScans: user.scanCount || 0,
    marketFit: calculateMarketFit(userProfile, latestAtsReport),
    scansThisMonth: calculateScansThisMonth(allAtsReports),
    weeklyGrowth: calculateWeeklyGrowth(allAtsReports),
  };
  

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

/**
 * Get performance history for detailed analysis
 */
exports.getPerformanceHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period = "6M" } = req.query; // 1M, 3M, 6M, 1Y

  let limit = 26; // weeks
  if (period === "1M") limit = 4;
  if (period === "3M") limit = 12;
  if (period === "1Y") limit = 52;

  const reports = await AtsReport.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  const trajectory = buildPerformanceTrajectory(reports);

  res.status(200).json({
    success: true,
    data: { trajectory, period },
  });
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate market fit percentage based on profile and latest ATS report
 */
function calculateMarketFit(userProfile, latestAtsReport) {
  if (!userProfile || !latestAtsReport) return 0;

  const atsScore = latestAtsReport.atsScore || 0;
  const skillsMatch = userProfile.preferredRoles?.length > 0 ? 70 : 50;
  const experienceWeight = userProfile.yearsOfExperience || 0;

  return Math.round((atsScore * 0.6 + skillsMatch * 0.3 + Math.min(experienceWeight * 5, 10)) / 1.3);
}

/**
 * Calculate number of scans this month
 */
function calculateScansThisMonth(reports) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return reports.filter((r) => r.createdAt >= monthStart).length;
}

/**
 * Calculate weekly growth percentage
 */
function calculateWeeklyGrowth(reports) {
  if (reports.length < 2) return 0;

  const latest = reports[0]?.atsScore || 0;
  const previous = reports[1]?.atsScore || 0;

  if (previous === 0) return 0;
  return Math.round(((latest - previous) / previous) * 100);
}

/**
 * Build performance trajectory data (monthly)
 */
function buildPerformanceTrajectory(reports) {
  if (reports.length === 0) {
    return Array.from({ length: 6 }, (_, i) => ({
      name: getMonthName(new Date().getMonth() - (5 - i)),
      score: Math.floor(Math.random() * 40) + 50, // Default fallback
    }));
  }

  const grouped = {};

  reports.forEach((report) => {
    const date = new Date(report.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(report.atsScore);
  });

  // Calculate monthly averages
  const sortedMonths = Object.keys(grouped)
    .sort()
    .slice(-6); // Last 6 months

  return sortedMonths.map((monthKey) => ({
    name: getMonthNameFromKey(monthKey),
    score: Math.round(
      grouped[monthKey].reduce((a, b) => a + b, 0) / grouped[monthKey].length
    ),
  }));
}

/**
 * Build skill radar data from user profile
 */
/**
 * Build skill radar data from user profile
 */
function buildSkillRadarData(userProfile) {
  const skills = Array.isArray(userProfile?.skills) ? userProfile.skills : [];

  // Default fallback data
  const fallbackData = [
    { skill: "Communication", user: 65, market: 76 },
    { skill: "Technical", user: 72, market: 82 },
    { skill: "Collaboration", user: 60, market: 70 },
    { skill: "Problem Solving", user: 68, market: 78 },
    { skill: "Leadership", user: 55, market: 70 },
  ];

  if (skills.length === 0) {
    return fallbackData;
  }

  // Handle both array of strings OR array of objects
  const topSkills = skills
    .filter((skill) => {
      if (typeof skill === 'string') return true;
      return skill?.displayName || skill?.name || skill?.canonical;
    })
    .slice(0, 6);

  // If the filtering somehow resulted in an empty array, return the fallback
  if (topSkills.length === 0) {
    return fallbackData;
  }

  return topSkills.map((skill) => {
    // Extract name depending on if it's a string or object
    const skillName = typeof skill === 'string' 
      ? skill 
      : (skill.displayName || skill.name || skill.canonical || 'Skill');
      
    // Extract score, default to 75 if it doesn't exist
    const userScore = typeof skill.proficiencyScore === 'number' 
      ? skill.proficiencyScore 
      : 75; 

    return {
      skill: skillName,
      user: userScore,
      market: Math.min(userScore + 15, 100),
    };
  });
}

/**
 * Build ATS benchmark data
 */
function buildAtsBenchmarkData(latestAtsReport) {
  if (!latestAtsReport) {
    return [
      { category: "Keywords", score: 0, avg: 75 },
      { category: "Technical", score: 0, avg: 80 },
      { category: "Formatting", score: 0, avg: 80 },
      { category: "Projects", score: 0, avg: 75 },
    ];
  }

  const breakdown = latestAtsReport.scoreBreakdown || {};

  return [
    {
      category: "Keywords",
      score: breakdown.keywordMatch || 0,
      avg: 75,
    },
    {
      category: "Technical",
      score: breakdown.technicalSkills || 0,
      avg: 80,
    },
    {
      category: "Formatting",
      score: breakdown.formatting || 0,
      avg: 80,
    },
    {
      category: "Projects",
      score: breakdown.projectQuality || 0,
      avg: 75,
    },
  ];
}

/**
 * Build weekly applications data
 */
function buildWeeklyApplicationsData(reports) {
  const weekData = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get data from last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  reports.forEach((report) => {
    if (report.createdAt >= sevenDaysAgo) {
      const dayName = dayNames[new Date(report.createdAt).getDay()];
      weekData[dayName]++;
    }
  });

  return [
    { day: "Mon", value: weekData.Mon },
    { day: "Tue", value: weekData.Tue },
    { day: "Wed", value: weekData.Wed },
    { day: "Thu", value: weekData.Thu },
    { day: "Fri", value: weekData.Fri },
    { day: "Sat", value: weekData.Sat },
    { day: "Sun", value: weekData.Sun },
  ];
}

/**
 * Build saved jobs list with dynamic data
 */
function buildSavedJobsList(savedJobs, latestAtsReport) {
  if (!savedJobs || savedJobs.length === 0) {
    return [];
  }

  return savedJobs.slice(0, 5).map((job, index) => ({
    id: job._id,
    company: job.company,
    role: job.title,
    location: job.location || "Remote",
    salary: job.salary || "$100k - $130k",
    match: Math.max(
  65,
  (latestAtsReport?.atsScore || 75) - 10
),
    date: formatDateDiff(job.savedAt),
    logo: job.company.charAt(0),
    status: job.applicationStatus || "saved",
  }));
}

/**
 * Build ATS breakdown from latest report
 */
function buildAtsBreakdown(latestAtsReport) {
  if (!latestAtsReport) {
    return [
      { name: "Keywords", value: 0 },
      { name: "Formatting", value: 0 },
      { name: "Experience", value: 0 },
      { name: "Projects", value: 0 },
    ];
  }

  const breakdown = latestAtsReport.scoreBreakdown || {};

  return [
    {
      name: "Keywords",
      value: breakdown.keywordMatch || 0,
    },
    {
      name: "Formatting",
      value: breakdown.formatting || 0,
    },
    {
      name: "Experience",
      value: breakdown.experienceStrength || 0,
    },
    {
      name: "Projects",
      value: breakdown.projectQuality || 0,
    },
  ];
}

/**
 * Generate AI insights and recommendations
 */
function generateInsights(stats, latestAtsReport, userProfile) {
  const insights = [];

  // Insight 1: ATS Score
  if (stats.atsScore >= 85) {
    insights.push({
      type: "success",
      title: "Excellent ATS Score",
      description: `Your resume scores ${stats.atsScore}/100 - you're in the top 10% of candidates.`,
      action: "Continue optimizing for specific roles",
    });
  } else if (stats.atsScore >= 70) {
    insights.push({
      type: "info",
      title: "Good ATS Performance",
      description: `Your resume scores ${stats.atsScore}/100. Focus on keywords and formatting.`,
      action: "Review recommendations and update",
    });
  } else {
    insights.push({
      type: "warning",
      title: "ATS Score Needs Improvement",
      description: `Your resume scores ${stats.atsScore}/100. Major improvements needed.`,
      action: "Run a new analysis with key improvements",
    });
  }

  // Insight 2: Weekly Growth
  if (stats.weeklyGrowth > 0) {
    insights.push({
      type: "success",
      title: "Positive Momentum",
      description: `Your ATS score improved by ${stats.weeklyGrowth}% this week!`,
      action: "Keep up the improvements",
    });
  }

  // Insight 3: Saved Jobs
  if (stats.savedLeads > 10) {
    insights.push({
      type: "info",
      title: "Active Job Search",
      description: `You have ${stats.savedLeads} saved opportunities.`,
      action: "Review and prioritize applications",
    });
  }

  // Insight 4: Market Fit
  if (stats.marketFit >= 80) {
    insights.push({
      type: "success",
      title: "Strong Market Alignment",
      description: `${stats.marketFit}% match with current market demands.`,
      action: "Target premium positions",
    });
  }

  return insights;
}

/**
 * Format date difference (e.g., "2 days ago")
 */
function formatDateDiff(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/**
 * Get month name from date
 */
function getMonthName(monthOffset = 0) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  return months[date.getMonth()];
}

/**
 * Get month name from key (YYYY-MM format)
 */
function getMonthNameFromKey(key) {
  const [year, month] = key.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[parseInt(month) - 1];
}
