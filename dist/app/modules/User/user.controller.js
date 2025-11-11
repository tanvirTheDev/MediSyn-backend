"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const sendResponse_1 = require("../../helpers/sendResponse");
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const createAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = { ...req.body, file: req.file };
    const result = await user_service_1.UserService.createAdmin(data);
    res.status(200).json({
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});
const createDoctor = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = { ...req.body, file: req.file };
    const result = await user_service_1.UserService.createDoctor(data);
    res.status(200).json({
        success: true,
        message: "Doctor created successfully",
        data: result,
    });
});
const createPatient = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = { ...req.body, file: req.file };
    const result = await user_service_1.UserService.createPatient(data);
    res.status(200).json({
        success: true,
        message: "Patient created successfully",
        data: result,
    });
});
const getAllUsersFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filteredData = (0, pick_1.default)(req.query, user_constant_1.userfilterableField);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await user_service_1.UserService.getAllUsers(filteredData, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const changeProfileStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.changeProfileStatus(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.UserService.getMyProfile(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Profile fetched successfully",
        data: result,
    });
});
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    // ✅ Convert null-prototype object to a normal JS object
    const body = Object.assign({}, req.body);
    let payload = {};
    if (body.data) {
        try {
            payload = JSON.parse(body.data);
        }
        catch (error) {
            console.error("Failed to parse JSON in payload.data:", error);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON format in form data");
        }
    }
    if (req.file) {
        payload.profilePhoto = req.file.url ?? req.file.path;
    }
    const result = await user_service_1.UserService.updateMyProfile(user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Profile updated successfully",
        data: result,
    });
});
exports.UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsersFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile,
};
