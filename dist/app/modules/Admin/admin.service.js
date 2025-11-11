"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../../../../generated/prisma");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const admin_constant_1 = require("./admin.constant");
const getAdmins = async (params, options) => {
    console.log(params);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    const { searchTerm, ...otherParams } = params;
    console.log("othersParams", otherParams);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: admin_constant_1.adminSearchableField.map((field) => {
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
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const orderBy = {
        [sortBy]: sortOrder,
    };
    // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
    const result = await prisma_2.default.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
    });
    const total = await prisma_2.default.admin.count({
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
const getByIDFromDB = async (id) => {
    console.log(id);
    const result = await prisma_2.default.admin.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    console.log(result);
    return result;
};
const updateFromDB = async (id, data) => {
    await prisma_2.default.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_2.default.admin.update({
        where: {
            id,
            isDeleted: false,
        },
        data,
    });
    return result;
};
const deleteFromDB = async (id) => {
    await prisma_2.default.admin.findFirstOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_2.default.$transaction(async (tx) => {
        const adminDataDelete = tx.admin.delete({
            where: {
                id,
            },
        });
        const deleteUser = await tx.user.delete({
            where: {
                email: (await adminDataDelete).email,
            },
        });
        return adminDataDelete;
    });
    return result;
};
const softDeleteFromDB = async (id) => {
    // await prisma.admin.findFirstOrThrow({
    //   where: {
    //     id,
    //   },
    // });
    const result = await prisma_2.default.$transaction(async (tx) => {
        const adminDataDelete = tx.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const deleteUser = await tx.user.update({
            where: {
                email: (await adminDataDelete).email,
            },
            data: {
                status: prisma_1.UserStatus.DELETED,
            },
        });
        return adminDataDelete;
    });
    return result;
};
exports.AdminService = {
    getAdmins,
    getByIDFromDB,
    updateFromDB,
    deleteFromDB,
    softDeleteFromDB,
};
