import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: "drzuhbx8a",
    api_key: "864178763383997",
    api_secret: process.env.CLOUDINARY_SECRET,
  });
};

export const uploadImageToCloudinary = async (path) => {
  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(path);
  } catch (error) {
    console.error("Error while uploading to cloudinary.");
  } finally {
    return uploadResult?.secure_url;
  }
};
