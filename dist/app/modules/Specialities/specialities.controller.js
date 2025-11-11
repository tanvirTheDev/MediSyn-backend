"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const specialities_service_1 = require("./specialities.service");
const createSpecialities = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await specialities_service_1.SpecialitiesService.createSpecialities(req);
    console.log(result);
    res.status(200).json({
        success: true,
        message: "Specialities created successfully",
        data: result,
    });
});
const getAllSpecialities = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await specialities_service_1.SpecialitiesService.getAllSpecialities();
    console.log(result);
    res.status(200).json({
        success: true,
        message: "All specialities showed successfully",
        data: result,
    });
});
const deleteSpecialitiesById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await specialities_service_1.SpecialitiesService.deleteSpecialitiesById(id);
    console.log(result);
    res.status(200).json({
        success: true,
        message: "Deleted Speciality successfully",
        data: result,
    });
});
exports.SpecialitiesController = {
    createSpecialities,
    getAllSpecialities,
    deleteSpecialitiesById,
};
