"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../helpers/sendResponse");
const schedule_constant_1 = require("./schedule.constant");
const schedule_service_1 = require("./schedule.service");
const insertFromDB = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await schedule_service_1.ScheduleService.insertFromDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule Created successfully",
        data: result,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, schedule_constant_1.schedulefilterableField);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await schedule_service_1.ScheduleService.allUserFromDB(filters, options, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.ScheduleController = {
    insertFromDB,
    getAllFromDB,
};
