// models/atsReport.model.js
const mongoose = require("mongoose");

const atsReportSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    atsScore: {
      type: Number,
      required: true,
    },

    scoreBreakdown: {
      keywordMatch: Number,
      skillsMatch: Number,
      experience: Number,
      projects: Number,
      formatting: Number,
    },

    summary: String,
    matchedSkills: [String],
    missingSkills: [String],
    strengths: [String],
    improvements: [String],

    jobTitle: {
      type: String,
      default: "Untitled Position",
    },

    companyName: {
      type: String,
      default: "",
    },

    scanIdentifier: {
      type: String,
      required: true,
      index: true,
    },

    modelUsed: {
      type: String,
      default: "gemini-1.5-flash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ATSReport", atsReportSchema);