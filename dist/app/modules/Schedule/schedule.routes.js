"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = require("./schedule.controller");
const router = express_1.default.Router();
router.post("/", schedule_controller_1.ScheduleController.insertFromDB);
router.get("/", schedule_controller_1.ScheduleController.getAllFromDB);
exports.ScheduleRoutes = router;
