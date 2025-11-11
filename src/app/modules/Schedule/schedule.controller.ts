import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
import { IAuthUser } from "../../Interface/common";
import { schedulefilterableField } from "./schedule.constant";
import { ScheduleService } from "./schedule.service";
const insertFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.insertFromDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule Created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, schedulefilterableField);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ScheduleService.allUserFromDB(
      filters,
      options,
      user as IAuthUser
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
export const ScheduleController = {
  insertFromDB,
  getAllFromDB,
};
