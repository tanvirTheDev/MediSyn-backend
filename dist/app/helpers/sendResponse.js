"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, jsonData) => {
    const response = {
        success: jsonData.success,
        message: jsonData.message,
        data: jsonData.data ?? null,
    };
    // ✅ Only include meta if provided
    if (jsonData.meta) {
        response.meta = jsonData.meta;
    }
    res.status(jsonData.statusCode).json(response);
};
exports.sendResponse = sendResponse;
