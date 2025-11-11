"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = exports.deleteFromCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = __importDefault(require("../../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary.cloudinary_api_key,
    api_secret: config_1.default.cloudinary.cloudinary_api_secret,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: "uploads",
            // format: file.mimetype.split("/")[1],
            public_id: file.originalname,
            transformation: [{ width: 800, height: 800, crop: "limit" }],
        };
    },
});
const upload = (0, multer_1.default)({ storage });
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.fileUploader = {
    upload,
    deleteFromCloudinary: exports.deleteFromCloudinary,
};
