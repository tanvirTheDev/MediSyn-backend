import { Admin, Prisma, UserStatus } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import {
  calculatePagination,
  IPaginationOptions,
} from "../../helpers/paginationHelpers";
import { adminSearchableField } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";

const getAdmins = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  console.log(params);
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...otherParams } = params;
  console.log("othersParams", otherParams);

  const andConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableField.map((field) => {
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
          equals: (otherParams as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.AdminOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };
  // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
  });
  const total = await prisma.admin.count({
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

const getByIDFromDB = async (id: string): Promise<Admin | null> => {
  console.log(id);
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  console.log(result);

  return result;
};

const updateFromDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
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

const softDeleteFromDB = async (id: string): Promise<Admin> => {
  // await prisma.admin.findFirstOrThrow({
  //   where: {
  //     id,
  //   },
  // });
  const result = await prisma.$transaction(async (tx) => {
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
        status: UserStatus.DELETED,
      },
    });
    return adminDataDelete;
  });
  return result;
};

export const AdminService = {
  getAdmins,
  getByIDFromDB,
  updateFromDB,
  deleteFromDB,
  softDeleteFromDB,
};
