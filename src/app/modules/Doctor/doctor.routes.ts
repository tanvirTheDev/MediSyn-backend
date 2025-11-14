// user.routes.ts
import express, { Router } from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { DoctorController } from "./doctor.controller";
// import { UserController } from "./user.controller";

const router = express.Router();

// export const parseAndValidateDoctor = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const parsedData =
//       typeof req.body.data === "string"
//         ? JSON.parse(req.body.data)
//         : req.body.data;

//     if (req.file && req.file.path) {
//       parsedData.doctor.profilePhoto = req.file.path;
//     }

//     req.body = {
//       password: parsedData.password,
//       doctor: userValidation.createDoctor.parse(parsedData.doctor),
//     };

//     console.log(req.body);

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

router.patch(
  "/:id",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  // fileUploader.upload.single("profilePhoto"),
  //   parseAndValidateAdmin,
  DoctorController.updateDoctor
);

router.get(
  "/",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.getAllDoctorFromDB
);

router.get("/:id", DoctorController.getByIDFromDB);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteFromDB
);

export const DoctorRoutes: Router = router;
