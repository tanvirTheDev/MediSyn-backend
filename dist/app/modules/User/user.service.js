"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// user.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
const prisma_1 = require("../../../../generated/prisma");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const user_constant_1 = require("./user.constant");
const createAdmin = async (data) => {
    // 1️⃣ Upload file to Cloudinary if provided
    if (data.file) {
        const uploadResult = await cloudinary_1.v2.uploader.upload(data.file.path, {
            folder: "uploads",
            public_id: data.file.originalname.split(".")[0],
            transformation: [{ width: 800, height: 800, crop: "limit" }],
        });
        data.admin.profilePhoto = uploadResult.secure_url;
    }
    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
    // 3️⃣ Prepare user data
    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: prisma_1.UserRole.ADMIN,
    };
    // 4️⃣ Transaction to create User + Admin
    const result = await prisma_2.default.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
        });
        const admin = await tx.admin.create({
            data: {
                name: data.admin.name,
                email: data.admin.email,
                contactNumber: data.admin.contactNumber,
                profilePhoto: data.admin.profilePhoto || null,
            },
        });
        return { user, admin };
    });
    return result;
};
const createDoctor = async (data) => {
    console.log("data", data);
    // 1️⃣ Upload file to Cloudinary if provided
    if (data.file && data.file.path) {
        const uploadResult = await cloudinary_1.v2.uploader.upload(data.file.path, {
            folder: "uploads",
            public_id: data.file.originalname.split(".")[0],
            transformation: [{ width: 800, height: 800, crop: "limit" }],
        });
        data.doctor.profilePhoto = uploadResult.secure_url;
    }
    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
    // 3️⃣ Prepare user data
    const userData = {
        email: data.doctor.email,
        password: hashedPassword,
        role: prisma_1.UserRole.DOCTOR,
    };
    // 4️⃣ Transaction to create User + Doctor
    const result = await prisma_2.default.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
        });
        const createDoctorData = await tx.doctor.create({
            data: {
                ...data.doctor,
                email: user.email, // ensure the relation works
            },
        });
        return createDoctorData;
    });
    return result;
};
const createPatient = async (data) => {
    console.log("data", data);
    if (data.file && data.file.path) {
        const uploadResult = await cloudinary_1.v2.uploader.upload(data.file.path, {
            folder: "uploads",
            public_id: data.file.originalname.split(".")[0],
            transformation: [{ width: 800, height: 800, crop: "limit" }],
        });
        data.patient.profilePhoto = uploadResult.secure_url;
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
    const userData = {
        email: data.patient.email,
        password: hashedPassword,
        role: prisma_1.UserRole.PATIENT,
    };
    const result = await prisma_2.default.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
        });
        const createPatientData = await tx.patient.create({
            data: {
                ...data.patient,
                email: user.email,
            },
        });
        return createPatientData;
    });
    return result;
};
const getAllUsers = async (params, options) => {
    console.log(params);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    const { searchTerm, ...otherParams } = params;
    console.log("othersParams", otherParams);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: user_constant_1.UserSearchableField.map((field) => {
                console.log("field", field);
                return {
                    [field]: {
                        contains: params.searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    if (Object.keys(otherParams).length > 0) {
        andConditions.push({
            AND: Object.keys(otherParams).map((key) => ({
                [key]: {
                    equals: otherParams[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const orderBy = {
        [sortBy]: sortOrder,
    };
    // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
    const result = await prisma_2.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = await prisma_2.default.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const changeProfileStatus = async (id, status) => {
    console.log(id, status);
    const userData = prisma_2.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updateUserStatus = await prisma_2.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return updateUserStatus;
};
const getMyProfile = async (payload) => {
    const userData = await prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
        },
    });
    let profileInfo;
    if (userData.role === prisma_1.UserRole.ADMIN) {
        profileInfo = await prisma_2.default.admin.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    else if (userData.role === prisma_1.UserRole.DOCTOR) {
        profileInfo = await prisma_2.default.doctor.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    if (userData.role === prisma_1.UserRole.PATIENT) {
        profileInfo = await prisma_2.default.patient.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    return { ...userData, ...profileInfo };
};
const updateMyProfile = async (user, payload) => {
    const userData = await prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            // status: UserStatus.ACTIVE,
        },
    });
    let profileInfo;
    if (userData.role === prisma_1.UserRole.ADMIN) {
        profileInfo = await prisma_2.default.admin.update({
            where: {
                email: userData.email,
            },
            data: payload,
        });
    }
    else if (userData.role === prisma_1.UserRole.DOCTOR) {
        profileInfo = await prisma_2.default.doctor.update({
            where: {
                email: userData.email,
            },
            data: payload,
        });
    }
    if (userData.role === prisma_1.UserRole.PATIENT) {
        profileInfo = await prisma_2.default.patient.update({
            where: {
                email: userData.email,
            },
            data: payload,
        });
    }
    return profileInfo;
};
exports.UserService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile,
};
