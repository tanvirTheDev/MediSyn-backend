import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "../../../../generated/prisma";
const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  console.log(hashedPassword);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: data.admin,
    });
    return createAdminData;
  });

  console.log(result);

  return result;
};

export const UserService = {
  createAdmin,
};
