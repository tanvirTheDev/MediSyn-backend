import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialitiesService } from "./specialities.service";

const createSpecialities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialitiesService.createSpecialities(req);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Specialities created successfully",
      data: result,
    });
  }
);

const getAllSpecialities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialitiesService.getAllSpecialities();
    console.log(result);

    res.status(200).json({
      success: true,
      message: "All specialities showed successfully",
      data: result,
    });
  }
);

const deleteSpecialitiesById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await SpecialitiesService.deleteSpecialitiesById(id);

    res.status(200).json({
      success: true,
      message: "Deleted Speciality successfully",
      data: result,
    });
  }
);

const getDoctorsBySpecialityId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await SpecialitiesService.getDoctorsBySpecialityId(id);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Filltered Speciality Doctor successfully",
      data: result,
    });
  }
);

export const SpecialitiesController = {
  createSpecialities,
  getAllSpecialities,
  deleteSpecialitiesById,
  getDoctorsBySpecialityId,
};
