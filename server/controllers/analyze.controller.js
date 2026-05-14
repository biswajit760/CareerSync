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
    originalFileName: file.originalname || 'resume.pdf',
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

  // 6️⃣ Calculate ATS Grade based on score
  const calculateAtsGrade = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Poor';
  };

  const atsScore = aiResult.atsReport.score ?? 0;
  const atsGrade = calculateAtsGrade(atsScore);

  // 6.5️⃣ Save ATS Report (FIXED: field names & alignment)
  const report = await ATSReport.create({
    resumeId: resume._id,
    userId: req.user.id,
    atsScore: atsScore,
    atsGrade: atsGrade,
    scoreBreakdown: {
      keywordMatch: aiResult.atsReport.breakdown?.keywordMatch || 0,
      technicalSkills: aiResult.atsReport.breakdown?.technicalSkills || aiResult.atsReport.breakdown?.skillsMatch || 0,
      experienceStrength: aiResult.atsReport.breakdown?.experienceStrength || aiResult.atsReport.breakdown?.experience || 0,
      projectQuality: aiResult.atsReport.breakdown?.projectQuality || aiResult.atsReport.breakdown?.projects || 0,
      formatting: aiResult.atsReport.breakdown?.formatting || 0,
      readability: aiResult.atsReport.breakdown?.readability || 0,
      leadershipSignals: aiResult.atsReport.breakdown?.leadershipSignals || 0,
      impactStatements: aiResult.atsReport.breakdown?.impactStatements || 0,
    },
    matchedSkills: Array.isArray(aiResult.atsReport.matchedSkills) ? aiResult.atsReport.matchedSkills : [],
    missingSkills: Array.isArray(aiResult.atsReport.missingSkills) ? aiResult.atsReport.missingSkills : [],
    weakSkills: (aiResult.atsReport.weakSkills || []).map(skill => 
      typeof skill === 'string' ? { skill, reason: 'Identified as weak match' } : skill
    ),
    strengths: Array.isArray(aiResult.atsReport.strengths) ? aiResult.atsReport.strengths : [],
    improvements: Array.isArray(aiResult.atsReport.improvements) ? aiResult.atsReport.improvements : [],
    executiveSummary: aiResult.atsReport.executiveSummary || aiResult.atsReport.summary || "",
    jobMatchingInsights: {
      strongestMatchingStacks: (aiResult.atsReport.jobMatchingInsights?.strongestMatchingStacks || []),
      weakMatchingStacks: (aiResult.atsReport.jobMatchingInsights?.weakMatchingStacks || []),
      estimatedMarketFit: aiResult.atsReport.jobMatchingInsights?.estimatedMarketFit || 0,
      recommendedRoles: (aiResult.atsReport.jobMatchingInsights?.recommendedRoles || []),
      avoidRoles: (aiResult.atsReport.jobMatchingInsights?.avoidRoles || []),
    },
    actionPlan: (aiResult.atsReport.actionPlan || []),
    aiMetadata: {
      modelUsed: 'gemini-1.5-flash',
      analysisDurationMs: aiResult.atsReport.analysisDurationMs || 0,
      tokenUsage: aiResult.atsReport.tokenUsage || 0,
      analyzedAt: new Date(),
    },
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