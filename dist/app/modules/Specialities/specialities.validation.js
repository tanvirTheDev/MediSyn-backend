"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createSpecialitySchema = zod_1.default.object({
    title: zod_1.default.string().min(1, "Title is required"),
    icon: zod_1.default.string().optional(),
});
exports.SpecialitiesValidation = {
    createSpecialitySchema,
};
