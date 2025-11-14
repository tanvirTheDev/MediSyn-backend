import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { calculatePagination } from "../../helpers/paginationHelpers";
import { IAuthUser } from "../../Interface/common";
const inserIntoDB = async (user: any, payload: { scheduleIds: string[] }) => {
  console.log(user);

  console.log(payload.scheduleIds);
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  console.log(doctorScheduleData);

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });
  return result;
};

const allUserFromDB = async (params: any, options: any, user: IAuthUser) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startTime, endTime, ...othersData } = params;
  console.log("othersParams", startTime, endTime, othersData);

  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startTime && endTime) {
    andConditions.push({
      schedule: {
        startTime: {
          gte: new Date(startTime as string),
          lte: new Date(endTime as string),
        },
        endTime: {
          gte: new Date(startTime as string),
          lte: new Date(endTime as string),
        },
      },
    });
  }

  if (Object.keys(othersData).length > 0) {
    if (
      typeof othersData.isBooked === "string" &&
      othersData.isBooked === "true"
    ) {
      othersData.isBooked = true;
    } else if (
      typeof othersData.isBooked === "string" &&
      othersData.isBooked === "false"
    ) {
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

  const whereConditions: Prisma.DoctorScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.DoctorScheduleOrderByWithRelationInput =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" };
  // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));

  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
  });
  const total = await prisma.doctorSchedule.count({
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

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  console.log(user, scheduleId);
  console.log("deleteFromDB");
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user!.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't delete this schedule because it is booked"
    );
  }
  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: { doctorId: doctorData.id, scheduleId },
    },
  });
  return result;
};

export const DoctorScheduleService = {
  inserIntoDB,
  allUserFromDB,
  deleteFromDB,
};
