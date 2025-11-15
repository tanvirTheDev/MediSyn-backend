"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = async (payload) => {
    console.log("logged in", payload);
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordValid = await bcrypt_1.default.compare(payload.password, userData.password);
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    console.log("accessToken", accessToken);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    console.log("refreshToken", refreshToken);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
};
const refreshToken = async (token) => {
    let decodeData;
    try {
        decodeData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
        if (!decodeData) {
            throw new Error("Invalid refresh token");
        }
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodeData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // Generate new access token
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    // Generate new refresh token
    const newRefreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken: newRefreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
};
const changePassword = async (user, payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordValid = await bcrypt_1.default.compare(payload.oldPassword, userData.password);
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password changed",
    };
};
const forgetPassword = async (payload) => {
    console.log(payload);
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPassToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    // console.log(resetPassToken);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    console.log(resetPassLink);
    await (0, emailSender_1.default)(userData.email, `
    <div>
      <p>Dear User,</p>
      <p>Your password reset link</p>
          <a href=${resetPassLink}>
            <button>
                Reset Password
            <button>
          <a/>
    </div>
    `);
};
const resetPassword = async (token, payload) => {
    console.log(payload);
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    console.log("isvalidtoken", isValidToken);
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
};
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    resetPassword,
    forgetPassword,
};
