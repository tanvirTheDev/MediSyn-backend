import { z } from "zod";

const createAdmin = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),

  admin: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
  }),
});

export const createDoctor = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration number is required"),
  experience: z.number().optional().default(0),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required",
  }),
  appointmentFee: z
    .number({ message: "Appointments fee is required" })
    .optional(),
  qualification: z.string().min(1, "Qualification is required"),
  currentWorkingPlace: z.string().min(1, "Current working place is required"),
  designation: z.string().min(1, "Designation is required"),
  isDeleted: z.string().default("false").optional(),
});

const createPatient = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().optional(),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};
