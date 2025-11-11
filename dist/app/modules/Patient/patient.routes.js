"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../../../generated/prisma");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const patient_controller_1 = require("./patient.controller");
const patient_validation_1 = require("./patient.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), patient_controller_1.PatientController.getAllPatientFromDB);
router.get("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), patient_controller_1.PatientController.getByIDFromDB);
router.patch("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), (0, validateRequest_1.default)(patient_validation_1.updatePatientSchema), patient_controller_1.PatientController.updatePatientControllerDB);
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), patient_controller_1.PatientController.deleteFromDB);
router.delete("/soft/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), patient_controller_1.PatientController.softDeleteFromDB);
exports.PatientRoutes = router;
