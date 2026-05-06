const UserJobProfile = require("../model/UserJobProfile");
const jobCacheService = require("../services/jobCache.service");
const jobRankingEngine = require("../services/jobRanking.service");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

//
// ================= GET PERSONALIZED JOBS =================
//
exports.getPersonalizedJobs = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  const { forceRefresh = false } = req.query;

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  // 1️⃣ Get user profile
  const profile = await UserJobProfile.findOne({ userId });

  if (!profile) {
    return next(
      new AppError(
        "No career profile found. Please analyze a resume first.",
        400
      )
    );
  }

  // 2️⃣ Check profile completeness
  if (profile.profileCompleteness < 30) {
    return next(
      new AppError(
        "Profile is incomplete. Please analyze another resume.",
        400
      )
    );
  }

  const { primaryRole, seniority } = profile;

  if (!primaryRole || !seniority) {
    return next(new AppError("Invalid profile data", 400));
  }

  // 3️⃣ Fetch jobs (cache-aware)
  const jobs = await jobCacheService.getJobsWithCache(
    primaryRole,
    seniority,
    forceRefresh === "true" || forceRefresh === true
  );

  if (!jobs || jobs.length === 0) {
    return next(new AppError("No jobs found for your profile", 404));
  }

  // 4️⃣ Rank jobs
  const rankedJobs = jobRankingEngine.rankJobs(profile, jobs);

  // 5️⃣ Transform jobs (ensure id)
  const transformedJobs = rankedJobs.map((job) => ({
    ...job,
    id: job._id || job.id || job.jobId,
  }));

  // 6️⃣ Update profile metadata
  profile.metadata.lastJobFetch = new Date();
  profile.metadata.totalJobsViewed += transformedJobs.length;
  await profile.save();

  // 7️⃣ Response
  res.status(200).json({
    success: true,
    data: {
      jobs: transformedJobs,
      count: transformedJobs.length,
      userProfile: {
        primaryRole: profile.primaryRole,
        seniority: profile.seniority,
        yearsOfExperience: profile.yearsOfExperience,
        profileCompleteness: profile.profileCompleteness,
      },
      cacheInfo: {
        isCached: !(forceRefresh === "true" || forceRefresh === true),
        lastFetched: transformedJobs[0]?.createdAt,
        expiresAt: transformedJobs[0]?.expiresAt,
      },
    },
  });
});

//
// ================= GET USER PROFILE =================
//
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  const profile = await UserJobProfile.findOne({ userId }).lean();

  if (!profile) {
    return next(new AppError("No profile found", 404));
  }

  res.status(200).json({
    success: true,
    data: profile,
  });
});

//
// ================= UPDATE PROFILE PREFERENCES =================
//
exports.updateProfilePreferences = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("Unauthorized access", 401));
  }

  const {
    preferredRoles,
    preferredIndustries,
    workModel,
    companySize,
  } = req.body;

  const profile = await UserJobProfile.findOneAndUpdate(
    { userId },
    {
      ...(preferredRoles && { preferredRoles }),
      ...(preferredIndustries && { preferredIndustries }),
      ...(workModel && { workModel }),
      ...(companySize && { companySize }),
      statusFlags: {
        needsUpdate: false,
      },
    },
    { new: true }
  );

  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  res.status(200).json({
    success: true,
    data: profile,
  });
});