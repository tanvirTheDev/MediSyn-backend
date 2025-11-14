import { Doctor, Prisma } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../helpers/paginationHelpers";
import { doctorSearchableField } from "./doctor.constant";

const getAllDoctorFromDB = async (params: any, options: any) => {
  const { searchTerm, specialities, ...othersData } = params;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  console.log("params", specialities);
  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: doctorSearchableField.map((field) => ({
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

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };
  const orderBy: Prisma.AdminOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };
  const doctorData = await prisma.doctor.findMany({
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
  const total = await prisma.doctor.count({
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

const updateFromDB = async (id: string, data: any) => {
  const { specialities, ...doctorData } = data;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (tx) => {
    // Update doctor basic info
    await tx.doctor.update({
      where: { id },
      data: doctorData,
    });

    // Delete specialities
    if (specialities && specialities.length > 0) {
      const deleteSpecialitiesIds = specialities.filter(
        (s: any) => s.isDeleted
      );

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
      const createSpecialitiesIds = specialities.filter(
        (s: any) => !s.isDeleted
      );

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
  const result = await prisma.doctor.findUnique({
    where: { id },
    include: {
      doctorSpecialities: {
        include: { specialities: true },
      },
    },
  });

  return result;
};

const getByIDFromDB = async (id: string) => {
  console.log(id);
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSchedules: true,
      doctorSpecialities: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
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

export const DoctorService = {
  updateFromDB,
  getAllDoctorFromDB,
  getByIDFromDB,
  deleteFromDB,
};
