import { UserRole } from "@prisma/client";
import express from "express";
import { fileUploader } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialitiesController } from "./specialities.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  SpecialitiesController.createSpecialities
);

router.get("/", SpecialitiesController.getAllSpecialities);

router.delete("/:id", SpecialitiesController.deleteSpecialitiesById);

router.get("/:id", SpecialitiesController.getDoctorsBySpecialityId);

export const SpecialitiesRoutes = router;
