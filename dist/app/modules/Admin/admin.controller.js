"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../helpers/sendResponse");
const admin_constant_1 = require("./admin.constant");
const admin_service_1 = require("./admin.service");
const getAllAdminsFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filteredData = (0, pick_1.default)(req.query, [...admin_constant_1.adminSearchableField, "searchTerm"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await admin_service_1.AdminService.getAdmins(filteredData, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getByIDFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.getByIDFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin single fetched successfully",
        data: result,
    });
});
const updateAdminControllerDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.updateFromDB(id, req.body);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin single data updated successfully",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.deleteFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin single data deleted successfully",
        data: result,
    });
});
const softDeleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.softDeleteFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin single data soft deleted successfully",
        data: result,
    });
});
exports.AdminController = {
    getAllAdminsFromDB,
    getByIDFromDB,
    deleteFromDB,
    updateAdminControllerDB,
    softDeleteFromDB,
};
