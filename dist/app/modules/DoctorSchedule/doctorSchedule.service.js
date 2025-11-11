"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const inserIntoDB = async (user, payload) => {
    console.log(user);
    console.log(payload.scheduleIds);
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId,
    }));
    console.log(doctorScheduleData);
    const result = await prisma_1.default.doctorSchedule.createMany({
        data: doctorScheduleData,
    });
    return result;
};
const allUserFromDB = async (params, options, user) => {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    const { startTime, endTime, ...othersData } = params;
    console.log("othersParams", startTime, endTime, othersData);
    const andConditions = [];
    if (startTime && endTime) {
        andConditions.push({
            schedule: {
                startTime: {
                    gte: new Date(startTime),
                    lte: new Date(endTime),
                },
                endTime: {
                    gte: new Date(startTime),
                    lte: new Date(endTime),
                },
            },
        });
    }
    if (Object.keys(othersData).length > 0) {
        if (typeof othersData.isBooked === "string" &&
            othersData.isBooked === "true") {
            othersData.isBooked = true;
        }
        else if (typeof othersData.isBooked === "string" &&
            othersData.isBooked === "false") {
            othersData.isBooked = false;
        }
        console.log("othersData", othersData);
        andConditions.push({
            AND: Object.keys(othersData).map((key) => ({
                [key]: {
                    equals: othersData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" };
    // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
    const result = await prisma_1.default.doctorSchedule.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
    });
    const total = await prisma_1.default.doctorSchedule.count({
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
const deleteFromDB = async (user, scheduleId) => {
    console.log(user, scheduleId);
    console.log("deleteFromDB");
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isBookedSchedule = await prisma_1.default.doctorSchedule.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId,
            },
            isBooked: true,
        },
    });
    if (isBookedSchedule) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You can't delete this schedule because it is booked");
    }
    const result = await prisma_1.default.doctorSchedule.delete({
        where: {
            doctorId_scheduleId: { doctorId: doctorData.id, scheduleId },
        },
    });
    return result;
};
exports.DoctorScheduleService = {
    inserIntoDB,
    allUserFromDB,
    deleteFromDB,
};
