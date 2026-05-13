const Resume = require("../model/Resume");

const asyncHandler =
  require("../utils/asyncHandler");

const AppError =
  require("../utils/AppError");

const jobRecommendationService =
  require("../services/jobRecommendation.service");

//
// ======================================================
// GET RESUME-SPECIFIC RECOMMENDATIONS
// ======================================================
//
exports.getRecommendedJobs =
  asyncHandler(async (req, res, next) => {

    const { resumeId } =
      req.params;

    const userId =
      req.user?.id;

    /**
     * VALIDATION
     */
    if (!resumeId) {
      return next(
        new AppError(
          "Resume ID is required",
          400
        )
      );
    }

    if (!userId) {
      return next(
        new AppError(
          "Unauthorized access",
          401
        )
      );
    }

    /**
     * VERIFY RESUME EXISTS
     */
    const resume =
      await Resume.findById(resumeId);

    if (!resume) {
      return next(
        new AppError(
          "Resume not found",
          404
        )
      );
    }

    /**
     * OWNERSHIP CHECK
     */
    if (
      resume.userId.toString()
      !==
      userId
    ) {
      return next(
        new AppError(
          "Forbidden access",
          403
        )
      );
    }

    /**
     * PROFILE VALIDATION
     */
    if (
      !resume.extractedProfile
      &&
      !resume.extractedIntelligence
    ) {
      return next(
        new AppError(
          "Resume analysis not found",
          400
        )
      );
    }

    /**
     * CENTRALIZED RECOMMENDATION ENGINE
     */
    const recommendations =
      await jobRecommendationService
        .getRecommendations({

          userId,

          resumeId,

          forceRefresh:
            req.query.forceRefresh
              === "true",
        });

    /**
     * RESPONSE
     */
    res.status(200).json({
      success: true,

      data: {
        ...recommendations,

        resumeContext: {
          resumeId:
            resume._id,

          uploadedAt:
            resume.createdAt,

          role:
            resume.extractedProfile?.role
            ||
            resume.extractedIntelligence
              ?.role,

          seniority:
            resume.extractedProfile
              ?.seniority
            ||
            resume.extractedIntelligence
              ?.seniority,

          skills:
            resume.extractedProfile
              ?.skills
            ||
            resume.extractedIntelligence
              ?.skills
            ||
            [],
        }
      }
    });
});