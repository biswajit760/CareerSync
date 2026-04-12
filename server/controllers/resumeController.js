const Resume = require("../model/Resume");

/**
 * @desc    Get all resumes of logged-in user
 * @route   GET /api/resume
 * @access  Private
 */
exports.getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: resumes,
    });

  } catch (error) {
    console.error("Get Resumes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};


/**
 * @desc    Get single resume by ID
 * @route   GET /api/resume/:id
 * @access  Private
 */
exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // 🔐 Ensure user owns the resume
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    res.status(200).json({
      success: true,
      data: resume,
    });

  } catch (error) {
    console.error("Get Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};