"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.createDoctor = void 0;
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters"),
    admin: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required"),
        email: zod_1.z.string().nonempty("Email is required"),
        contactNumber: zod_1.z.string().nonempty("Contact Number is required"),
    }),
});
exports.createDoctor = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string(),
    profilePhoto: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().min(1, "Contact number is required"),
    address: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().min(1, "Registration number is required"),
    experience: zod_1.z.number().optional().default(0),
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "Gender is required",
    }),
    appointmentFee: zod_1.z
        .number({ message: "Appointments fee is required" })
        .optional(),
    qualification: zod_1.z.string().min(1, "Qualification is required"),
    currentWorkingPlace: zod_1.z.string().min(1, "Current working place is required"),
    designation: zod_1.z.string().min(1, "Designation is required"),
    isDeleted: zod_1.z.string().default("false").optional(),
});
const createPatient = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    profilePhoto: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().min(1, "Contact number is required"),
    address: zod_1.z.string().optional(),
});
exports.userValidation = {
    createAdmin,
    createDoctor: exports.createDoctor,
    createPatient,
};
