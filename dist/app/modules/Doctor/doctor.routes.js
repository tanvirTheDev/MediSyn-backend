"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
// user.routes.ts
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const doctor_controller_1 = require("./doctor.controller");
// import { UserController } from "./user.controller";
const router = express_1.default.Router();
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
router.patch("/:id", 
// auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
// fileUploader.upload.single("profilePhoto"),
//   parseAndValidateAdmin,
doctor_controller_1.DoctorController.updateDoctor);
router.get("/", 
// auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
doctor_controller_1.DoctorController.getAllDoctorFromDB);
router.get("/:id", doctor_controller_1.DoctorController.getByIDFromDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), doctor_controller_1.DoctorController.deleteFromDB);
exports.DoctorRoutes = router;
