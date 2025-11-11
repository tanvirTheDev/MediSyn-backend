import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
import { IAuthUser } from "../../Interface/common";
import { DoctorScheduleService } from "./doctorSchedule.service";

const inserIntoDB = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await DoctorScheduleService.inserIntoDB(user, req.body);

    res.status(200).json({
      success: true,
      message: "Doctor Schedules created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["startTime", "endTime", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await DoctorScheduleService.allUserFromDB(
      filters,
      options,
      user!
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule deleted successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
