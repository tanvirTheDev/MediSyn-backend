"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../helpers/sendResponse");
const patient_constant_1 = require("./patient.constant");
const patient_service_1 = require("./patient.service");
const getAllPatientFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filteredData = (0, pick_1.default)(req.query, patient_constant_1.patientSearchableFilterdField);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await patient_service_1.PatientService.getPatients(filteredData, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Patient fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getByIDFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.getByIDFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Patinet single fetched successfully",
        data: result,
    });
});
const updatePatientControllerDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.updateFromDB(id, req.body);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Patient single data updated successfully",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.deleteFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Patient single data deleted successfully",
        data: result,
    });
});
const softDeleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.softDeleteFromDB(id);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Patient single data soft deleted successfully",
        data: result,
    });
});
exports.PatientController = {
    getAllPatientFromDB,
    getByIDFromDB,
    deleteFromDB,
    updatePatientControllerDB,
    softDeleteFromDB,
};
