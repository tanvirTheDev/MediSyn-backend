import { addHours, addMinutes, format } from "date-fns";
import { Prisma } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import {
  calculatePagination,
  IPaginationOptions,
} from "../../helpers/paginationHelpers";
import { IAuthUser } from "../../Interface/common";
import { ISchedulePayload } from "./schedule.interface";

const insertFromDB = async (payload: ISchedulePayload) => {
  if (!payload) throw new Error("payload missing");
  const {
    startDate: startDateStr,
    endDate: endDateStr,
    startTime,
    endTime,
  } = payload;
  if (!startDateStr || !endDateStr || !startTime || !endTime)
    throw new Error("missing required fields");

  const results: any[] = [];
  const currentDate = new Date(startDateStr);
  const lastDate = new Date(endDateStr);

  // Validate date order
  if (isNaN(currentDate.getTime()) || isNaN(lastDate.getTime()))
    throw new Error("invalid date format");
  if (currentDate > lastDate) throw new Error("startDate must be <= endDate");

  // pre-parse time parts
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  if (
    Number.isNaN(startHour) ||
    Number.isNaN(startMinute) ||
    Number.isNaN(endHour) ||
    Number.isNaN(endMinute)
  )
    throw new Error("invalid time format");

  // iterate day by day
  let day = new Date(currentDate); // clone
  while (day <= lastDate) {
    // Build a Date at midnight for this day, then add hours/minutes
    const dayBase = new Date(format(day, "yyyy-MM-dd")); // midnight of `day`
    const dayStart = addMinutes(addHours(dayBase, startHour), startMinute);
    const dayEnd = addMinutes(addHours(dayBase, endHour), endMinute);

    let slotStart = new Date(dayStart);
    while (slotStart < dayEnd) {
      const slotEnd = addMinutes(slotStart, 30);

      // check existing
      const existing = await prisma.schedule.findFirst({
        where: { startTime: slotStart, endTime: slotEnd },
      });

      if (!existing) {
        const created = await prisma.schedule.create({
          data: {
            startTime: slotStart,
            endTime: slotEnd,
          },
        });
        results.push(created);
      }

      slotStart = addMinutes(slotStart, 30);
    }

    day.setDate(day.getDate() + 1); // next day
  }

  return results;
};

const allUserFromDB = async (
  params: any,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startTime, endTime } = params;
  console.log("othersParams", startTime, endTime);

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startTime && endTime) {
    andConditions.push({
      startTime: {
        gte: new Date(startTime as string),
        lte: new Date(endTime as string),
      },
      endTime: {
        gte: new Date(startTime as string),
        lte: new Date(endTime as string),
      },
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.ScheduleOrderByWithRelationInput =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" };
  // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));
  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  console.log("doctorSchedules", doctorSchedules);

  const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
  console.log("scheduleIds", scheduleIds);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds as string[],
      },
    },
    skip,
    take: limit,
    orderBy,
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds as string[],
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

export const ScheduleService = { insertFromDB, allUserFromDB };
