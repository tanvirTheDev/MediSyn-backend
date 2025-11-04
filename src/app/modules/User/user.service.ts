import bcrypt from "bcrypt";
import { UserRole } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  console.log("data", data);

  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  console.log(hashedPassword);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const admin = await transactionClient.admin.create({
      data: {
        name: data.admin.name,
        email: data.admin.email,
        contactNumber: data.admin.contactNumber,
      },
    });
    return { user, admin };
  });

  console.log(result);

  return result;

  // const result = await prisma.admin.create({
  //   data: {
  //     name: data.admin.name,
  //     email: data.admin.email,
  //     contactNumber: data.admin.contactNumber,
  //     user: {
  //       create: {
  //         email: data.admin.email,
  //         password: hashedPassword,
  //         role: UserRole.ADMIN,
  //       },
  //     },
  //   },
  //   include: {
  //     user: true,
  //   },
  // });

  // return result;
};

export const UserService = {
  createAdmin,
};
