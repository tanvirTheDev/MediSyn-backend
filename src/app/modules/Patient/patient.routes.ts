import express, { Router } from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PatientController } from "./patient.controller";
import { updatePatientSchema } from "./patient.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.getAllPatientFromDB
);
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.getByIDFromDB
);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updatePatientSchema),
  PatientController.updatePatientControllerDB
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.deleteFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.softDeleteFromDB
);

export const PatientRoutes: Router = router;
