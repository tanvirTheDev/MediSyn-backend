"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.medicalReportSchema = exports.patientHealthDataSchema = void 0;
const zod_1 = __importDefault(require("zod"));
//  Health data validation
exports.patientHealthDataSchema = zod_1.default.object({
    dateOfBirth: zod_1.default.string().datetime().optional(),
    gender: zod_1.default.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: zod_1.default.enum([
        "A_POSITIVE",
        "B_POSITIVE",
        "O_POSITIVE",
        "AB_POSITIVE",
        "A_NEGATIVE",
        "B_NEGATIVE",
        "O_NEGATIVE",
        "AB_NEGATIVE",
    ]),
    hasAllergies: zod_1.default.boolean().optional(),
    hasDiabetes: zod_1.default.boolean().optional(),
    height: zod_1.default.string().nullable().optional(),
    weight: zod_1.default.string().nullable().optional(),
    smokingStatus: zod_1.default.boolean().optional(),
    dietaryPreferences: zod_1.default.string().nullable().optional(),
    pregnancyStatus: zod_1.default.boolean().optional(),
    mentalHealthHistory: zod_1.default.string().nullable().optional(),
    immunizationStatus: zod_1.default.string().nullable().optional(),
    hasPastSurgeries: zod_1.default.boolean().optional(),
    recentAnxiety: zod_1.default.boolean().optional(),
    recentDepression: zod_1.default.boolean().optional(),
    maritalStatus: zod_1.default
        .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
        .optional(),
});
//  Medical report validation
exports.medicalReportSchema = zod_1.default.object({
    reportName: zod_1.default.string(),
    reportLink: zod_1.default.string().url().or(zod_1.default.string()), // accepts either URL or normal string
});
//  Patient update validation
exports.updatePatientSchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().email().optional(),
    profilePhoto: zod_1.default.string().url().optional(),
    contactNumber: zod_1.default.string().optional(),
    address: zod_1.default.string().optional(),
    isDeleted: zod_1.default.boolean().optional(),
    patientHelthData: exports.patientHealthDataSchema.optional(),
    medicalReport: exports.medicalReportSchema.optional(),
});
