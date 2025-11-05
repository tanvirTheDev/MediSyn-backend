// user.service.ts
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { Patient, Prisma, UserRole } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import {
  calculatePagination,
  IPaginationOptions,
} from "../../helpers/paginationHelpers";
import { UserSearchableField } from "./user.constant";
import { CreatePatientInput } from "./user.interface";

interface AdminData {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string; // optional, will be set after upload
  };
  file?: Express.Multer.File; // optional uploaded file from controller
}

const createAdmin = async (data: AdminData) => {
  // 1️⃣ Upload file to Cloudinary if provided
  if (data.file) {
    const uploadResult = await cloudinary.uploader.upload(data.file.path, {
      folder: "uploads",
      public_id: data.file.originalname.split(".")[0],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });
    data.admin.profilePhoto = uploadResult.secure_url;
  }

  // 2️⃣ Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3️⃣ Prepare user data
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  // 4️⃣ Transaction to create User + Admin
  const result = await prisma.$transaction(async (tx) => {
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

const createDoctor = async (data: any) => {
  console.log("data", data);

  // 1️⃣ Upload file to Cloudinary if provided
  if (data.file && data.file.path) {
    const uploadResult = await cloudinary.uploader.upload(data.file.path, {
      folder: "uploads",
      public_id: data.file.originalname.split(".")[0],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    data.doctor.profilePhoto = uploadResult.secure_url;
  }

  // 2️⃣ Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3️⃣ Prepare user data
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  // 4️⃣ Transaction to create User + Doctor
  const result = await prisma.$transaction(async (tx) => {
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

const createPatient = async (data: CreatePatientInput): Promise<Patient> => {
  console.log("data", data);

  if (data.file && data.file.path) {
    const uploadResult = await cloudinary.uploader.upload(data.file.path, {
      folder: "uploads",
      public_id: data.file.originalname.split(".")[0],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });
    data.patient.profilePhoto = uploadResult.secure_url;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (tx) => {
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

const getAllUsers = async (params: any, options: IPaginationOptions) => {
  console.log(params);
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...otherParams } = params;
  console.log("othersParams", otherParams);

  const andConditions: Prisma.UserWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: UserSearchableField.map((field) => {
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.AdminOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };
  // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));

  const result = await prisma.user.findMany({
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
  const total = await prisma.user.count({
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

const changeProfileStatus = async (id: string, status: UserRole) => {
  console.log(id, status);

  const userData = prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return updateUserStatus;
};

export const UserService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
};
