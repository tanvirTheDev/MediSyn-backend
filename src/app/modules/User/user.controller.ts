// user.controller.ts
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
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

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  changeProfileStatus,
};
