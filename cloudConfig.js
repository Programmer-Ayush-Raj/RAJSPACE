const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const useCloudinary = process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}

const storage = useCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "rajspace_dev",
        allowedFormats: ["png", "jpg", "jpeg"],
      },
    })
  : multer.memoryStorage();

module.exports = {
  cloudinary,
  storage,
};