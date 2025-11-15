"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const sendResponse_1 = require("../../helpers/sendResponse");
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: false, // ⚠ For production, use true
        httpOnly: true,
        sameSite: "none", // ⚠ Depending on frontend domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login Successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
        },
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
        throw new ApiError_1.default(401, "Refresh token is required");
    }
    const { accessToken, refreshToken: newRefreshToken } = await auth_service_1.AuthServices.refreshToken(oldRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken },
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await auth_service_1.AuthServices.changePassword(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Change Password Successfully",
        data: result,
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await auth_service_1.AuthServices.forgetPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Forget Password Successfully",
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const token = req.headers.authorization || "";
    console.log("token", token);
    await auth_service_1.AuthServices.resetPassword(token, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reset Password Successfully",
        data: null,
    });
});
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
