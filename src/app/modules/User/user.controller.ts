// user.controller.ts
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import ApiError from "../../errors/ApiError";
import { sendResponse } from "../../helpers/sendResponse";
import { IAuthUser } from "../../Interface/common";
import { userfilterableField } from "./user.constant";
import { UserService } from "./user.service";

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, file: req.file };
    const result = await UserService.createAdmin(data);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, file: req.file };
    const result = await UserService.createDoctor(data);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  }
);

const createPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, file: req.file };
    const result = await UserService.createPatient(data);
    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  }
);

const getAllUsersFromDB = catchAsync(async (req, res) => {
  const filteredData = pick(req.query, userfilterableField);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUsers(filteredData, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.getMyProfile(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile fetched successfully",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    // ✅ Convert null-prototype object to a normal JS object
    const body = Object.assign({}, req.body);

    let payload: any = {};
    if (body.data) {
      try {
        payload = JSON.parse(body.data);
      } catch (error) {
        console.error("Failed to parse JSON in payload.data:", error);
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Invalid JSON format in form data"
        );
      }
    }
    if (req.file) {
      payload.profilePhoto = (req.file as any).url ?? req.file.path;
    }

    const result = await UserService.updateMyProfile(
      user as IAuthUser,
      payload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile updated successfully",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
