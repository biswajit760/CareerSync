const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRecentScans,
  getComparisonData,
  getDashboardStats,
} = require('../controllers/dashboard');

// All routes are protected (require authentication)
router.get('/recent-scans', auth, getRecentScans);
router.get('/comparison-data', auth, getComparisonData);
router.get('/stats', auth, getDashboardStats);

module.exports = router;
