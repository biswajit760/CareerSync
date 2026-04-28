const Resume = require("../model/Resume");
const ATSReport = require("../model/AtsReport.model");
const User = require("../model/User");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const generateResumeHash = require("../utils/generateResumeHash");
const extractJobInfo = require("../utils/extractJobInfo");
const pdfParse = require("pdf-parse");
const { analyzeResumeWithAI } = require("../services/ai.service");

exports.analyzeFullFlow = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume and Job Description required",
      });
    }

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are supported",
      });
    }

    // 1️⃣ Upload
    const uploadResult = await uploadToCloudinary(file.buffer);

    // 2️⃣ Parse
    const parsed = await pdfParse(file.buffer);

    // 3️⃣ Generate resume identifier hash
    const scanIdentifier = generateResumeHash(parsed.text);

    // 4️⃣ Extract job info from description
    const { jobTitle, companyName } = extractJobInfo(jobDescription);

    // 5️⃣ Calculate scan number for this user
    const userScanCount = await Resume.countDocuments({ userId: req.user.id });
    const scanNumber = userScanCount + 1;

    // 6️⃣ Save Resume
    const resume = await Resume.create({
      userId: req.user.id,
      cloudinaryUrl: uploadResult.secure_url,
      rawText: parsed.text,
      jobDescription,
      fileName: file.originalname,
      scanIdentifier,
      scanNumber,
    });

    // 7️⃣ AI Analysis
    const aiResult = await analyzeResumeWithAI(
      parsed.text,
      jobDescription
    );

    if (!aiResult || typeof aiResult.score !== "number") {
      throw new Error("Invalid AI response");
    }

    // 8️⃣ Save Report
    const report = await ATSReport.create({
      resumeId: resume._id,
      userId: req.user.id,
      atsScore: aiResult.score,
      scoreBreakdown: {
        keywordMatch: aiResult.breakdown?.keywordMatch || 0,
        skillsMatch: aiResult.breakdown?.skillsMatch || 0,
        experience: aiResult.breakdown?.experience || 0,
        projects: aiResult.breakdown?.projects || 0,
        formatting: aiResult.breakdown?.formatting || 0,
      },
      summary: aiResult.summary || "",
      matchedSkills: aiResult.matchedSkills || [],
      missingSkills: aiResult.missingSkills || [],
      strengths: aiResult.strengths || [],
      improvements: aiResult.improvements || [],
      jobTitle,
      companyName,
      scanIdentifier,
    });

    // 9️⃣ Increment user scan count
    const user = await User.findById(req.user.id);
    if (user) {
      await user.incrementScanCount();
    }

    res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    console.error("Analyze Error:", error);

    res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};