import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.inserIntoDB);

router.get(
  "/my-schedules",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getAllFromDB
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
