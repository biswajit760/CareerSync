const express = require("express");
const router = express.Router();
const { getRecommendedJobs } = require("../controllers/job.controller");
const jobMatchingController = require("../controllers/jobMatching.controller");
const auth = require("../middleware/auth");

// 🆕 NEW ROUTES (Profile-Based)
// Get personalized jobs based on user profile
router.get("/recommendations", auth, jobMatchingController.getPersonalizedJobs);

// Get user's career profile
router.get("/profile", auth, jobMatchingController.getUserProfile);

// Update user job preferences
router.put("/profile/preferences", auth, jobMatchingController.updateProfilePreferences);

// 🔄 LEGACY ROUTE (Keep for backward compatibility)
// Get jobs for specific resume (will be deprecated in future)
router.get("/recommendations/:resumeId", auth, getRecommendedJobs);

module.exports = router;