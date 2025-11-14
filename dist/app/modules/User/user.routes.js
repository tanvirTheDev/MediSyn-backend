"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = exports.parseAndValidatePatient = exports.parseAndValidateDoctor = exports.parseAndValidateAdmin = void 0;
// user.routes.ts
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
const parseAndValidateAdmin = (req, res, next) => {
    try {
        const parsedData = typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
        if (req.file && req.file.path) {
            parsedData.admin.profilePhoto = req.file.path;
        }
        req.body = user_validation_1.userValidation.createAdmin.parse(parsedData);
        console.log(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.parseAndValidateAdmin = parseAndValidateAdmin;
const parseAndValidateDoctor = (req, res, next) => {
    try {
        const parsedData = typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
        if (req.file && req.file.path) {
            parsedData.doctor.profilePhoto = req.file.path;
        }
        req.body = {
            password: parsedData.password,
            doctor: user_validation_1.userValidation.createDoctor.parse(parsedData.doctor),
        };
        console.log(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.parseAndValidateDoctor = parseAndValidateDoctor;
const parseAndValidatePatient = (req, res, next) => {
    try {
        const parsedData = typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
        if (req.file && req.file.path) {
            parsedData.patient.profilePhoto = req.file.path;
        }
        req.body = {
            password: parsedData.password,
            patient: user_validation_1.userValidation.createPatient.parse(parsedData.patient),
        };
        console.log(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.parseAndValidatePatient = parseAndValidatePatient;
router.get("/", user_controller_1.UserController.getAllUsersFromDB);
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), exports.parseAndValidateAdmin, user_controller_1.UserController.createAdmin);
router.post("/create-doctor", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), exports.parseAndValidateDoctor, user_controller_1.UserController.createDoctor);
router.post("/create-patient", fileUploader_1.fileUploader.upload.single("file"), exports.parseAndValidatePatient, user_controller_1.UserController.createPatient);
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserController.changeProfileStatus);
router.get("/me", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), user_controller_1.UserController.getMyProfile);
router.patch("/update-my-profile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), fileUploader_1.fileUploader.upload.single("file"), user_controller_1.UserController.updateMyProfile);
exports.UserRoutes = router;
