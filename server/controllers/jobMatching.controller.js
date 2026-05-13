const UserJobProfile = require("../model/UserJobProfile");

const jobRecommendationService = require(
  "../services/jobRecommendation.service"
);

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

//
// ======================================================
// GET PERSONALIZED JOBS
// ======================================================
//
exports.getPersonalizedJobs = asyncHandler(
  async (req, res, next) => {

    const userId = req.user?.id;
    const { forceRefresh = false } = req.query;

    if (!userId) {
      return next(new AppError("Unauthorized access", 401));
    }

    /**
     * 1. PROFILE VALIDATION
     */
    const profile = await UserJobProfile.findOne({ userId });

    if (!profile) {
      return next(
        new AppError("No career profile found. Please analyze a resume first.", 400)
      );
    }

    /**
     * 2. PROFILE COMPLETENESS CHECK
     */
    if (profile.profileHealth.completenessScore < 20) {
      return res.status(200).json({
        success: true,
        data: {
          jobs: [],
          metadata: {
            recommendationType: "global-profile",
            message: "Complete your profile to unlock better recommendations.",
          },
          userProfile: {
            primaryRole: profile.primaryRole,
            seniority: profile.seniority,
            profileCompleteness: profile.profileHealth.completenessScore,
          }
        }
      });
    }

    /**
     * 3. CENTRALIZED RECOMMENDATION ENGINE
     */
    const recommendations = await jobRecommendationService.getRecommendations({
      userId,
      forceRefresh: forceRefresh === "true"
    });

    /**
     * 4. UPDATE METADATA
     * Note: Skill normalization is now handled automatically 
     * by the Model's pre-save hook.
     */
    profile.recommendationMetadata = profile.recommendationMetadata || {};
    profile.recommendationMetadata.lastRecommendationRefresh = new Date();
    profile.recommendationMetadata.totalJobsViewed = 
      (profile.recommendationMetadata.totalJobsViewed || 0) + (recommendations.jobs?.length || 0);

    await profile.save();

    /**
     * 5. RESPONSE
     */
    res.status(200).json({
      success: true,
      data: {
        ...recommendations,
        userProfile: {
          primaryRole: profile.primaryRole,
          seniority: profile.seniority,
          profileCompleteness: profile.profileHealth.completenessScore,
          dominantRole: recommendations.metadata?.dominantRole,
          dominantStack: recommendations.metadata?.dominantStack,
        }
      }
    });
  }
);

//
// ======================================================
// GET USER PROFILE
// ======================================================
//
exports.getUserProfile = asyncHandler(
  async (req, res, next) => {

    const userId = req.user?.id;

    if (!userId) {
      return next(
        new AppError(
          "Unauthorized access",
          401
        )
      );
    }

    const profile =
      await UserJobProfile
        .findOne({ userId })
        .lean();

    if (!profile) {
      return next(
        new AppError(
          "No profile found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
);

//
// ======================================================
// UPDATE PROFILE PREFERENCES
// ======================================================
//
exports.updateProfilePreferences =
  asyncHandler(async (req, res, next) => {

    const userId = req.user?.id;

    if (!userId) {
      return next(
        new AppError(
          "Unauthorized access",
          401
        )
      );
    }

    const {
      preferredRoles,
      preferredIndustries,
      workModel,
      companySize,
    } = req.body;

    const profile =
      await UserJobProfile
        .findOneAndUpdate(
          { userId },

          {
            ...(preferredRoles && {
              preferredRoles
            }),

            ...(preferredIndustries && {
              preferredIndustries
            }),

            ...(workModel && {
              workModel
            }),

            ...(companySize && {
              companySize
            }),

            statusFlags: {
              needsUpdate: false,
            },
          },

          { new: true }
        );

    if (!profile) {
      return next(
        new AppError(
          "Profile not found",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  });