import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name as string,
  api_key: config.cloudinary.cloudinary_api_key as string,
  api_secret: config.cloudinary.cloudinary_api_secret as string,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads",
      // format: file.mimetype.split("/")[1],
      public_id: file.originalname,
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    };
  },
});

const upload = multer({ storage });

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export const fileUploader = {
  upload,
  deleteFromCloudinary,
};
