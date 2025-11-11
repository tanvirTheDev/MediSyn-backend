import express from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { SpecialitiesController } from "./specialities.controller";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  SpecialitiesController.createSpecialities
);

router.get("/", SpecialitiesController.getAllSpecialities);

router.delete("/:id", SpecialitiesController.deleteSpecialitiesById);

export const SpecialitiesRoutes = router;
