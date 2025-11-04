import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { UserStatus } from "../../../../generated/prisma";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../helpers/jwtHelpers";

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

export const AuthServices = {
  loginUser,
  refreshToken,
};
