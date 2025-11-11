"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../helpers/sendResponse");
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const inserIntoDB = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    const result = await doctorSchedule_service_1.DoctorScheduleService.inserIntoDB(user, req.body);
    res.status(200).json({
        success: true,
        message: "Doctor Schedules created successfully",
        data: result,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, ["startTime", "endTime", "isBooked"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctorSchedule_service_1.DoctorScheduleService.allUserFromDB(filters, options, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const result = await doctorSchedule_service_1.DoctorScheduleService.deleteFromDB(user, id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
    });
});
exports.DoctorScheduleController = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB,
};
