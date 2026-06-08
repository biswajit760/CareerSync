const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getDashboardData,
  getDashboardStats,
  getPerformanceHistory,
} = require("../controllers/dashboard.controller");

/**
 * @route   GET /api/dashboard/data
 * @desc    Get complete dashboard data (stats, charts, insights)
 * @access  Private
 */
router.get("/data", auth, getDashboardData);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get quick stats only (lightweight, for frequent updates)
 * @access  Private
 */
router.get("/stats", auth, getDashboardStats);

/**
 * @route   GET /api/dashboard/history
 * @desc    Get performance history for a specific period
 * @query   period: 1M, 3M, 6M, 1Y (default: 6M)
 * @access  Private
 */
router.get("/history", auth, getPerformanceHistory);

module.exports = router;
