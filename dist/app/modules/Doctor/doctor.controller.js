"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../helpers/sendResponse");
const doctor_constant_1 = require("./doctor.constant");
const doctor_service_1 = require("./doctor.service");
const updateDoctor = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    console.log(id, req.body);
    const result = await doctor_service_1.DoctorService.updateFromDB(id, req.body);
    res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        data: result,
    });
});
const getAllDoctorFromDB = (0, catchAsync_1.default)(async (req, res, next) => {
    const filteredData = (0, pick_1.default)(req.query, doctor_constant_1.doctorSearchableFilterdField);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctor_service_1.DoctorService.getAllDoctorFromDB(filteredData, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getByIDFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.getByIDFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor single fetched successfully",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.deleteFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted single data deleted successfully",
        data: result,
    });
});
exports.DoctorController = {
    updateDoctor,
    getAllDoctorFromDB,
    getByIDFromDB,
    deleteFromDB,
};
