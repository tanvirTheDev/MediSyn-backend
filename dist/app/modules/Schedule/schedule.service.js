"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const insertFromDB = async (payload) => {
    if (!payload)
        throw new Error("payload missing");
    const { startDate: startDateStr, endDate: endDateStr, startTime, endTime, } = payload;
    if (!startDateStr || !endDateStr || !startTime || !endTime)
        throw new Error("missing required fields");
    const results = [];
    const currentDate = new Date(startDateStr);
    const lastDate = new Date(endDateStr);
    // Validate date order
    if (isNaN(currentDate.getTime()) || isNaN(lastDate.getTime()))
        throw new Error("invalid date format");
    if (currentDate > lastDate)
        throw new Error("startDate must be <= endDate");
    // pre-parse time parts
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    if (Number.isNaN(startHour) ||
        Number.isNaN(startMinute) ||
        Number.isNaN(endHour) ||
        Number.isNaN(endMinute))
        throw new Error("invalid time format");
    // iterate day by day
    let day = new Date(currentDate); // clone
    while (day <= lastDate) {
        // Build a Date at midnight for this day, then add hours/minutes
        const dayBase = new Date((0, date_fns_1.format)(day, "yyyy-MM-dd")); // midnight of `day`
        const dayStart = (0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(dayBase, startHour), startMinute);
        const dayEnd = (0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(dayBase, endHour), endMinute);
        let slotStart = new Date(dayStart);
        while (slotStart < dayEnd) {
            const slotEnd = (0, date_fns_1.addMinutes)(slotStart, 30);
            // check existing
            const existing = await prisma_1.default.schedule.findFirst({
                where: { startTime: slotStart, endTime: slotEnd },
            });
            if (!existing) {
                const created = await prisma_1.default.schedule.create({
                    data: {
                        startTime: slotStart,
                        endTime: slotEnd,
                    },
                });
                results.push(created);
            }
            slotStart = (0, date_fns_1.addMinutes)(slotStart, 30);
        }
        day.setDate(day.getDate() + 1); // next day
    }
    return results;
};
const allUserFromDB = async (params, options, user) => {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePagination)(options);
    const { startTime, endTime } = params;
    console.log("othersParams", startTime, endTime);
    const andConditions = [];
    if (startTime && endTime) {
        andConditions.push({
            startTime: {
                gte: new Date(startTime),
                lte: new Date(endTime),
            },
            endTime: {
                gte: new Date(startTime),
                lte: new Date(endTime),
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const orderBy = sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" };
    // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
    const doctorSchedules = await prisma_1.default.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user?.email,
            },
        },
    });
    console.log("doctorSchedules", doctorSchedules);
    const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    console.log("scheduleIds", scheduleIds);
    const result = await prisma_1.default.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: scheduleIds,
            },
        },
        skip,
        take: limit,
        orderBy,
    });
    const total = await prisma_1.default.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: scheduleIds,
            },
        },
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
exports.ScheduleService = { insertFromDB, allUserFromDB };
