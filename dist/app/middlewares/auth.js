"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            console.log("token", token);
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized!");
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret);
            req.user = verifiedUser;
            console.log("verify", verifiedUser);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = auth;
