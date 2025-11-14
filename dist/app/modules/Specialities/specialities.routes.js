"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const specialities_controller_1 = require("./specialities.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), fileUploader_1.fileUploader.upload.single("file"), specialities_controller_1.SpecialitiesController.createSpecialities);
router.get("/", specialities_controller_1.SpecialitiesController.getAllSpecialities);
router.delete("/:id", specialities_controller_1.SpecialitiesController.deleteSpecialitiesById);
router.get("/:id", specialities_controller_1.SpecialitiesController.getDoctorsBySpecialityId);
exports.SpecialitiesRoutes = router;
