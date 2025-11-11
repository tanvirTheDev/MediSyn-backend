import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
import { doctorSearchableFilterdField } from "./doctor.constant";
import { DoctorService } from "./doctor.service";
const updateDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id, req.body);

    const result = await DoctorService.updateFromDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: result,
    });
  }
);

const getAllDoctorFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filteredData = pick(req.query, doctorSearchableFilterdField);

    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await DoctorService.getAllDoctorFromDB(
      filteredData,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIDFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.getByIDFromDB(id);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor single fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DoctorService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted single data deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  updateDoctor,
  getAllDoctorFromDB,
  getByIDFromDB,
  deleteFromDB,
};
