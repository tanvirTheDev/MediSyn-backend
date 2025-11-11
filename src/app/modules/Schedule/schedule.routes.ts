import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertFromDB);

router.get("/", ScheduleController.getAllFromDB);

export const ScheduleRoutes = router;
