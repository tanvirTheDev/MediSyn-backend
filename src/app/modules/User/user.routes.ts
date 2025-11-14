// user.routes.ts
import express, { NextFunction, Request, Response, Router } from "express";
import { UserRole } from "../../../../generated/prisma";
import { fileUploader } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { CreatePatientInput } from "./user.interface";
import { userValidation } from "./user.validation";

const router = express.Router();

export const parseAndValidateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    if (req.file && req.file.path) {
      parsedData.admin.profilePhoto = req.file.path;
    }

    req.body = userValidation.createAdmin.parse(parsedData);
    console.log(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

export const parseAndValidateDoctor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    if (req.file && req.file.path) {
      parsedData.doctor.profilePhoto = req.file.path;
    }

    req.body = {
      password: parsedData.password,
      doctor: userValidation.createDoctor.parse(parsedData.doctor),
    };

    console.log(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

export const parseAndValidatePatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData: CreatePatientInput =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    if (req.file && req.file.path) {
      parsedData.patient.profilePhoto = req.file.path;
    }

    req.body = {
      password: parsedData.password,
      patient: userValidation.createPatient.parse(parsedData.patient),
    };

    console.log(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", UserController.getAllUsersFromDB);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  parseAndValidateAdmin,
  UserController.createAdmin
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  parseAndValidateDoctor,
  UserController.createDoctor
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  parseAndValidatePatient,
  UserController.createPatient
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.changeProfileStatus
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
  UserController.getMyProfile
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
  fileUploader.upload.single("file"),
  UserController.updateMyProfile
);

export const UserRoutes: Router = router;
