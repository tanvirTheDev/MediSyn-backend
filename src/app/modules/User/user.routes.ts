import express, { Router } from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.createAdmin
);

export const UserRoutes: Router = router;
