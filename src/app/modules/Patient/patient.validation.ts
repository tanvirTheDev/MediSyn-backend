import z from "zod";

//  Health data validation
export const patientHealthDataSchema = z.object({
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bloodGroup: z.enum([
    "A_POSITIVE",
    "B_POSITIVE",
    "O_POSITIVE",
    "AB_POSITIVE",
    "A_NEGATIVE",
    "B_NEGATIVE",
    "O_NEGATIVE",
    "AB_NEGATIVE",
  ]),
  hasAllergies: z.boolean().optional(),
  hasDiabetes: z.boolean().optional(),
  height: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  smokingStatus: z.boolean().optional(),
  dietaryPreferences: z.string().nullable().optional(),
  pregnancyStatus: z.boolean().optional(),
  mentalHealthHistory: z.string().nullable().optional(),
  immunizationStatus: z.string().nullable().optional(),
  hasPastSurgeries: z.boolean().optional(),
  recentAnxiety: z.boolean().optional(),
  recentDepression: z.boolean().optional(),
  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
    .optional(),
});

//  Medical report validation
export const medicalReportSchema = z.object({
  reportName: z.string(),
  reportLink: z.string().url().or(z.string()), // accepts either URL or normal string
});

//  Patient update validation
export const updatePatientSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  profilePhoto: z.string().url().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  patientHelthData: patientHealthDataSchema.optional(),
  medicalReport: medicalReportSchema.optional(),
});
