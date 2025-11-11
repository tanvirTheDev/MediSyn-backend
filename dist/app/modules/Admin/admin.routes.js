"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../../../generated/prisma");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.AdminController.getAllAdminsFromDB);
router.get("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.AdminController.getByIDFromDB);
router.patch("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.adminZodValidation.updateSchema), admin_controller_1.AdminController.updateAdminControllerDB);
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.AdminController.deleteFromDB);
router.delete("/soft/:id", (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), admin_controller_1.AdminController.softDeleteFromDB);
exports.AdminRoutes = router;
