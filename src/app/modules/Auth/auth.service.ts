import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { UserStatus } from "../../../../generated/prisma";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import emailSender from "./emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("logged in", payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  );
  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );
  console.log("accessToken", accessToken);

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );
  console.log("refreshToken", refreshToken);
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodeData;
  try {
    decodeData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
    if (!decodeData) {
      throw new Error("Invalid refresh token");
    }
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodeData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  console.log(payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );
  // console.log(resetPassToken);

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
  console.log(resetPassLink);

  await emailSender(
    userData.email,
    `
    <div>
      <p>Dear User,</p>
      <p>Your password reset link</p>
          <a href=${resetPassLink}>
            <button>
                Reset Password
            <button>
          <a/>
    </div>
    `
  );
};

const resetPassword = async (token: string, payload: any) => {
  console.log(payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );
  console.log("isvalidtoken", isValidToken);

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  resetPassword,
  forgetPassword,
};
