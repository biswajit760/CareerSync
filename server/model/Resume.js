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

    fileName: {
      type: String,
      required: true,
    },

    scanIdentifier: {
      type: String,
      required: true,
      index: true,
    },

    scanNumber: {
      type: Number,
      default: 1,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);