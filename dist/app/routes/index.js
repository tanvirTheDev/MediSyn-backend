"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_routes_1 = require("../modules/Admin/admin.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const doctor_routes_1 = require("../modules/Doctor/doctor.routes");
const doctorSchedule_routes_1 = require("../modules/DoctorSchedule/doctorSchedule.routes");
const patient_routes_1 = require("../modules/Patient/patient.routes");
const schedule_routes_1 = require("../modules/Schedule/schedule.routes");
const specialities_routes_1 = require("../modules/Specialities/specialities.routes");
const user_routes_1 = require("../modules/User/user.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/specialities",
        route: specialities_routes_1.SpecialitiesRoutes,
    },
    {
        path: "/doctor",
        route: doctor_routes_1.DoctorRoutes,
    },
    {
        path: "/patient",
        route: patient_routes_1.PatientRoutes,
    },
    {
        path: "/schedule",
        route: schedule_routes_1.ScheduleRoutes,
    },
    {
        path: "/doctor-schedule",
        route: doctorSchedule_routes_1.DoctorScheduleRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
