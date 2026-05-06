const ATSReport = require("../model/AtsReport.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

//
// ================= GET SINGLE ATS REPORT =================
//
exports.getATSReport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return next(new AppError("Report ID is required", 400));
  }

  const report = await ATSReport.findById(id);

  if (!report) {
    return next(new AppError("ATS Report not found", 404));
  }

  res.status(200).json({
    success: true,
    data: report,
  });
});

//
// ================= GET ALL REPORTS FOR USER =================
//
exports.getReportsByUser = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  const reports = await ATSReport.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});