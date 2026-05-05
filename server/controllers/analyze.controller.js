const Resume = require("../model/Resume");
const ATSReport = require("../model/AtsReport.model");
const UserJobProfile = require("../model/UserJobProfile");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const pdfParse = require("pdf-parse");
const { analyzeResumeWithAI } = require("../services/ai.service");
const profileMergeService = require("../services/profileMerge.service");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.analyzeFullFlow = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const { jobDescription } = req.body;

  // 1️⃣ Validation
  if (!file || !jobDescription) {
    return next(
      new AppError("Resume (PDF) and Job Description are required", 400)
    );
  }

  if (file.mimetype !== "application/pdf") {
    return next(new AppError("Only PDF files are supported", 400));
  }

  // 2️⃣ Upload to Cloudinary
  const uploadResult = await uploadToCloudinary(file.buffer);

  // 3️⃣ Parse PDF
  const parsed = await pdfParse(file.buffer);

  if (!parsed.text) {
    return next(new AppError("Failed to extract text from PDF", 400));
  }

  // 4️⃣ Save Resume
  const resume = await Resume.create({
    userId: req.user.id,
    cloudinaryUrl: uploadResult.secure_url,
    rawText: parsed.text,
    jobDescription,
  });

  // 5️⃣ AI Analysis
  const aiResult = await analyzeResumeWithAI(parsed.text, jobDescription);

  if (!aiResult || !aiResult.atsReport) {
    return next(new AppError("AI failed to analyze resume", 500));
  }

  // 5.5️⃣ Save extracted profile
  await Resume.findByIdAndUpdate(resume._id, {
    extractedProfile: aiResult.extractedProfile,
  });

  // 6️⃣ Save ATS Report
  const report = await ATSReport.create({
    resumeId: resume._id,
    userId: req.user.id,
    atsScore: aiResult.atsReport.score ?? 0,
    scoreBreakdown: {
      keywordMatch: aiResult.atsReport.breakdown?.keywordMatch || 0,
      skillsMatch: aiResult.atsReport.breakdown?.skillsMatch || 0,
      experience: aiResult.atsReport.breakdown?.experience || 0,
      projects: aiResult.atsReport.breakdown?.projects || 0,
      formatting: aiResult.atsReport.breakdown?.formatting || 0,
    },
    summary: aiResult.atsReport.summary || "",
    matchedSkills: aiResult.atsReport.matchedSkills || [],
    missingSkills: aiResult.atsReport.missingSkills || [],
    strengths: aiResult.atsReport.strengths || [],
    improvements: aiResult.atsReport.improvements || [],
  });

  // 🆕 PROFILE MERGE
  const userProfile = await profileMergeService.upsertUserProfile(
    req.user.id,
    aiResult.extractedProfile,
    resume._id,
    85
  );

  await profileMergeService.updateProfileCompleteness(userProfile._id);

  // 7️⃣ Response
  res.status(200).json({
    success: true,
    data: report,
    profile: aiResult.extractedProfile,
    userProfile: {
      id: userProfile._id,
      primaryRole: userProfile.primaryRole,
      seniority: userProfile.seniority,
      yearsOfExperience: userProfile.yearsOfExperience,
      skills: (userProfile.skills || []).map((s) => s.name),
      profileCompleteness: userProfile.profileCompleteness,
      resumeCount: userProfile.resumeCount,
    },
    jobSearchQuery: aiResult.jobSearchQuery,
  });
});