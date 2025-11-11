"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../helpers/fileUploader");
const specialities_controller_1 = require("./specialities.controller");
const router = express_1.default.Router();
router.post("/", fileUploader_1.fileUploader.upload.single("file"), specialities_controller_1.SpecialitiesController.createSpecialities);
router.get("/", specialities_controller_1.SpecialitiesController.getAllSpecialities);
router.delete("/:id", specialities_controller_1.SpecialitiesController.deleteSpecialitiesById);
exports.SpecialitiesRoutes = router;
