"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const prisma_1 = require("../../../../generated/prisma");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const patient_constant_1 = require("./patient.constant");
const getPatients = async (params, options) => {
    console.log(params);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    const { searchTerm, ...otherParams } = params;
    console.log("othersParams", otherParams);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: patient_constant_1.patientSearchableField.map((field) => {
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
    //   andConditions.push({
    //     isDeleted: false,
    //   });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const orderBy = {
        [sortBy]: sortOrder,
    };
    // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
    const result = await prisma_2.default.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
        include: {
            medicalReports: true,
            patientHealthData: true,
        },
    });
    const total = await prisma_2.default.patient.count({
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
    const result = await prisma_2.default.patient.findUnique({
        where: {
            id,
            //   isDeleted: false,
        },
    });
    console.log(result);
    return result;
};
const updateFromDB = async (id, data) => {
    const { patientHelthData, medicalReport, ...patientData } = data;
    console.log(patientHelthData, medicalReport);
    const patientInfo = await prisma_2.default.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = prisma_2.default.$transaction(async (tx) => {
        // update  patient data
        const updatedPatient = await prisma_2.default.patient.update({
            where: {
                id,
                //   isDeleted: false,
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReports: true,
            },
        });
        // create or update  patient health   data
        if (patientHelthData) {
            const heathData = await tx.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                update: patientHelthData,
                create: {
                    ...patientHelthData,
                    patientId: patientInfo.id,
                },
            });
            console.log(heathData);
        }
        // create MedicalReports
        if (medicalReport) {
            const medicalReportData = await tx.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id,
                },
            });
        }
        const responseData = await prisma_2.default.patient.findUnique({
            where: {
                id: patientInfo.id,
            },
            include: {
                patientHealthData: true,
                medicalReports: true,
            },
        });
        return responseData;
    });
    return result;
};
const deleteFromDB = async (id) => {
    await prisma_2.default.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = await prisma_2.default.$transaction(async (tx) => {
        // delete medical report
        await tx.medicalReport.deleteMany({
            where: {
                patientId: id,
            },
        });
        // delete patient health data
        await tx.patientHealthData.delete({
            where: {
                patientId: id,
            },
        });
        const deletePatient = await tx.patient.delete({
            where: {
                id,
            },
        });
        await tx.user.delete({
            where: {
                email: deletePatient.email,
            },
        });
        return deletePatient;
    });
    return result;
};
const softDeleteFromDB = async (id) => {
    const result = await prisma_2.default.$transaction(async (tx) => {
        const deletedPatient = tx.patient.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        await tx.user.update({
            where: {
                email: (await deletedPatient).email,
            },
            data: {
                status: prisma_1.UserStatus.DELETED,
            },
        });
        return deletedPatient;
    });
    return result;
};
exports.PatientService = {
    getPatients,
    getByIDFromDB,
    updateFromDB,
    deleteFromDB,
    softDeleteFromDB,
};
