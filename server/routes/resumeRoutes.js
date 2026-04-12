const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getUserResumes,
  getResumeById,
} = require("../controllers/resumeController");

// ✅ Get all user resumes
router.get("/", auth, getUserResumes);

// ✅ Get single resume
router.get("/:id", auth, getResumeById);

module.exports = router;