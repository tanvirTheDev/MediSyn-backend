"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctorFromDB = async (params, options) => {
    const { searchTerm, specialities, ...othersData } = params;
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    console.log("params", specialities);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: doctor_constant_1.doctorSearchableField.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(othersData).length > 0) {
        andConditions.push({
            AND: Object.keys(othersData).map((key) => ({
                [key]: {
                    equals: othersData[key],
                },
            })),
        });
    }
    if (specialities && specialities.length > 0) {
        andConditions.push({
            doctorSpecialities: {
                some: {
                    specialities: {
                        title: {
                            contains: specialities,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }
    const whereConditions = { AND: andConditions };
    const orderBy = {
        [sortBy]: sortOrder,
    };
    const doctorData = await prisma_1.default.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true,
                },
            },
        },
    });
    const total = await prisma_1.default.doctor.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: doctorData,
    };
};
const updateFromDB = async (id, data) => {
    const { specialities, ...doctorData } = data;
    const doctorInfo = await prisma_1.default.doctor.findUniqueOrThrow({
        where: { id },
    });
    await prisma_1.default.$transaction(async (tx) => {
        // Update doctor basic info
        await tx.doctor.update({
            where: { id },
            data: doctorData,
        });
        // Delete specialities
        if (specialities && specialities.length > 0) {
            const deleteSpecialitiesIds = specialities.filter((s) => s.isDeleted);
            for (const speciality of deleteSpecialitiesIds) {
                await tx.doctorSpecialities.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId,
                    },
                });
            }
        }
        // Create new specialities
        if (specialities && specialities.length > 0) {
            const createSpecialitiesIds = specialities.filter((s) => !s.isDeleted);
            for (const speciality of createSpecialitiesIds) {
                await tx.doctorSpecialities.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId, // ✅ string only
                    },
                });
            }
        }
    });
    // Fetch updated doctor
    const result = await prisma_1.default.doctor.findUnique({
        where: { id },
        include: {
            doctorSpecialities: {
                include: { specialities: true },
            },
        },
    });
    return result;
};
const getByIDFromDB = async (id) => {
    console.log(id);
    const result = await prisma_1.default.doctor.findUnique({
        where: {
            id,
        },
        include: {
            doctorSchedules: true,
            doctorSpecialities: {
                include: {
                    specialities: true,
                },
            },
        },
    });
    return result;
};
const deleteFromDB = async (id) => {
    const doctor = await prisma_1.default.doctor.findUniqueOrThrow({
        where: { id },
    });
    const result = await prisma_1.default.$transaction(async (tx) => {
        await tx.user.delete({
            where: { email: doctor.email },
        });
        const deletedDoctor = await tx.doctor.delete({
            where: { id },
        });
        return deletedDoctor;
    });
    return result;
};
exports.DoctorService = {
    updateFromDB,
    getAllDoctorFromDB,
    getByIDFromDB,
    deleteFromDB,
};
