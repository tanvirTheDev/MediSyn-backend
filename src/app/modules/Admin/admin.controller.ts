import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { sendResponse } from "../../helpers/sendResponse";
import { adminSearchableField } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdminsFromDB = catchAsync(async (req, res) => {
  const filteredData = pick(req.query, [...adminSearchableField, "searchTerm"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAdmins(filteredData, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIDFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getByIDFromDB(id);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin single fetched successfully",
    data: result,
  });
});

const updateAdminControllerDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.updateFromDB(id, req.body);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin single data updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.deleteFromDB(id);
  // console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin single data deleted successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.softDeleteFromDB(id);
  // console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin single data soft deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdminsFromDB,
  getByIDFromDB,
  deleteFromDB,
  updateAdminControllerDB,
  softDeleteFromDB,
};
