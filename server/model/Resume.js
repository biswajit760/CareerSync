const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cloudinaryUrl: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
    },
    extractedProfile: {
    role: { type: String, default: "Software Developer" },
    seniority: { type: String, enum: ['Fresher', 'Junior', 'Senior'], default: 'Fresher' },
    yearsOfExp: { type: Number, default: 0 },
    skills: [String] // Top 5-10 technical skills
  },

  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);