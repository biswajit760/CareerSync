const ATSReport = require("../model/AtsReport.model");
const Resume = require("../model/Resume");

/**
 * Get recent scans for dashboard
 * Returns last 5 scans with essential info
 */
exports.getRecentScans = async (req, res) => {
  try {
    const userId = req.user.id;

    const recentScans = await ATSReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('resumeId', 'fileName jobDescription')
      .select('atsScore jobTitle companyName createdAt summary resumeId');

    const formattedScans = recentScans.map(scan => ({
      _id: scan._id,
      atsScore: scan.atsScore,
      jobTitle: scan.jobTitle,
      companyName: scan.companyName,
      fileName: scan.resumeId?.fileName || 'Unknown',
      createdAt: scan.createdAt,
      summary: scan.summary ? scan.summary.substring(0, 150) + '...' : '',
    }));

    res.status(200).json({
      success: true,
      data: formattedScans,
    });

  } catch (error) {
    console.error("Get Recent Scans Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent scans",
    });
  }
};

/**
 * Get comparison data for graph
 * Returns last 5 scans with full breakdown
 */
exports.getComparisonData = async (req, res) => {
  try {
    const userId = req.user.id;

    const scans = await ATSReport.find({ userId })
      .sort({ createdAt: 1 }) // Oldest first for chronological order
      .limit(5)
      .select('atsScore scoreBreakdown jobTitle createdAt');

    const labels = scans.map((scan, index) => `Scan ${index + 1}`);
    const overallScores = scans.map(scan => scan.atsScore);
    const breakdowns = scans.map(scan => ({
      keywordMatch: scan.scoreBreakdown?.keywordMatch || 0,
      skillsMatch: scan.scoreBreakdown?.skillsMatch || 0,
      experience: scan.scoreBreakdown?.experience || 0,
      projects: scan.scoreBreakdown?.projects || 0,
      formatting: scan.scoreBreakdown?.formatting || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        labels,
        overallScores,
        breakdowns,
        jobTitles: scans.map(scan => scan.jobTitle),
        dates: scans.map(scan => scan.createdAt),
      },
    });

  } catch (error) {
    console.error("Get Comparison Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comparison data",
    });
  }
};

/**
 * Get dashboard statistics
 * Returns aggregate stats for the user
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const allScans = await ATSReport.find({ userId })
      .sort({ createdAt: 1 })
      .select('atsScore createdAt');

    if (allScans.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalScans: 0,
          averageScore: 0,
          bestScore: 0,
          latestScore: 0,
          improvement: 0,
          successRate: 0,
        },
      });
    }

    const totalScans = allScans.length;
    const scores = allScans.map(scan => scan.atsScore);
    
    const averageScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / totalScans
    );
    
    const bestScore = Math.max(...scores);
    const latestScore = scores[scores.length - 1];
    const firstScore = scores[0];
    const improvement = totalScans > 1 ? latestScore - firstScore : 0;

    // Success rate: % of scans that scored >= 80
    const successfulScans = scores.filter(score => score >= 80).length;
    const successRate = Math.round((successfulScans / totalScans) * 100);

    res.status(200).json({
      success: true,
      data: {
        totalScans,
        averageScore,
        bestScore,
        latestScore,
        improvement,
        successRate,
      },
    });

  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
