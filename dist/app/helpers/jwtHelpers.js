"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const options = {
        algorithm: "HS256",
        expiresIn: expiresIn,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    return token;
};
const verifyToken = (token, secret) => {
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }
    return decoded;
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
