const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (fileBuffer) => {
  try {
    const base64 = fileBuffer.toString("base64");

    const dataURI = `data:application/pdf;base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "raw",
      folder: "resumes",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;