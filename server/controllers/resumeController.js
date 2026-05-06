const Resume = require("../model/Resume");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

//
// ================= GET ALL USER RESUMES =================
//
exports.getUserResumes = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes,
  });
});

//
// ================= GET SINGLE RESUME =================
//
exports.getResumeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id) {
    return next(new AppError("Resume ID is required", 400));
  }

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  const resume = await Resume.findById(id);

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  // 🔐 Ownership check
  if (resume.userId.toString() !== userId) {
    return next(new AppError("Forbidden: Access denied", 403));
  }

  res.status(200).json({
    success: true,
    data: resume,
  });
});