import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../helpers/jwtHelpers";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log("token", token);

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not Authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      console.log("verify", verifiedUser);

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
