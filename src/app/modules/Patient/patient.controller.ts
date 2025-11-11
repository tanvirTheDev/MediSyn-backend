import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
import { patientSearchableFilterdField } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllPatientFromDB = catchAsync(async (req, res) => {
  const filteredData = pick(req.query, patientSearchableFilterdField);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientService.getPatients(filteredData, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIDFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.getByIDFromDB(id);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patinet single fetched successfully",
    data: result,
  });
});

const updatePatientControllerDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientService.updateFromDB(id, req.body);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient single data updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientService.deleteFromDB(id);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient single data deleted successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientService.softDeleteFromDB(id);
  // console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient single data soft deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatientFromDB,
  getByIDFromDB,
  deleteFromDB,
  updatePatientControllerDB,
  softDeleteFromDB,
};
