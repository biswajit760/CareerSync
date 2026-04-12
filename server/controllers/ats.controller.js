const ATSReport = require("../model/AtsReport.model");

exports.getATSReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await ATSReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "ATS Report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    console.error("Get ATS Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ATS report",
    });
  }
};