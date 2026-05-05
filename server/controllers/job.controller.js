const Resume = require("../model/Resume");
const ATSReport = require("../model/AtsReport.model");
const { fetchJobsFromAdzuna } = require("../services/job.service");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * @desc    Get job recommendations based on analyzed resume profile
 * @route   GET /api/jobs/recommendations/:resumeId
 * @access  Private
 */
exports.getRecommendedJobs = asyncHandler(async (req, res, next) => {
  const { resumeId } = req.params;

  // 1️⃣ Validate resumeId
  if (!resumeId) {
    return next(new AppError("Resume ID is required", 400));
  }

  // 2️⃣ Fetch Resume
  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  // 3️⃣ Check if analyzed
  if (!resume.extractedProfile) {
    return next(
      new AppError(
        "Resume has not been analyzed yet. Please run analysis first.",
        400
      )
    );
  }

  // 4️⃣ Fetch ATS report (optional)
  const report = await ATSReport.findOne({ resumeId: resume._id });

  // 5️⃣ Extract role + seniority
  const { role, seniority } = resume.extractedProfile;

  if (!role || !seniority) {
    return next(new AppError("Invalid resume profile data", 400));
  }

  console.log(`🔍 Fetching jobs for: ${role} (${seniority})`);

  // 6️⃣ Fetch jobs
  const jobs = await fetchJobsFromAdzuna(role, seniority);

  // 7️⃣ Safety check
  if (!jobs || jobs.length === 0) {
    return next(new AppError("No jobs found for this profile", 404));
  }

  // 8️⃣ Response
  res.status(200).json({
    success: true,
    count: jobs.length,
    matchScore: report ? report.atsScore : 85,
    data: jobs,
  });
});