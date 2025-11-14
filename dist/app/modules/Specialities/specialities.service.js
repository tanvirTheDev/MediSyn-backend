"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesService = void 0;
const cloudinary_1 = require("cloudinary");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// interface SpecialityInput {
//   title: string;
//   file?: Express.Multer.File;
// }
const createSpecialities = async (req) => {
    const title = req.body.title || (req.body.data && JSON.parse(req.body.data).title);
    const file = req.file;
    const data = { title };
    if (file && file.path) {
        const uploadResult = await cloudinary_1.v2.uploader.upload(file.path, {
            folder: "specialities",
            public_id: file.originalname.split(".")[0],
            transformation: [{ width: 800, height: 800, crop: "limit" }],
        });
        data.icon = uploadResult.secure_url;
    }
    const result = await prisma_1.default.specialities.create({
        data,
    });
    return result;
};
const getAllSpecialities = async () => {
    const specialitiesData = prisma_1.default.specialities.findMany({});
    return specialitiesData;
};
const deleteSpecialitiesById = async (id) => {
    console.log("get all specialities");
    await prisma_1.default.doctorSpecialities.deleteMany({
        where: { specialitiesId: id },
    });
    const specialitiesData = await prisma_1.default.specialities.delete({
        where: {
            id,
        },
    });
    return specialitiesData;
};
const getDoctorsBySpecialityId = async (specialityId) => {
    console.log(specialityId);
    const specialityWithDoctors = await prisma_1.default.specialities.findUnique({
        where: { id: specialityId },
        include: {
            doctorSpecialities: {
                include: {
                    doctor: true,
                },
            },
        },
    });
    if (!specialityWithDoctors) {
        throw new Error("Speciality not found");
    }
    // Flatten doctors array
    const doctors = specialityWithDoctors.doctorSpecialities.map((ds) => ds.doctor);
    return doctors;
};
exports.SpecialitiesService = {
    createSpecialities,
    getAllSpecialities,
    deleteSpecialitiesById,
    getDoctorsBySpecialityId,
};
