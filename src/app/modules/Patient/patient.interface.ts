import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type IPatientFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};

export interface IPatientHealthDataInput {
  dateOfBirth: Date | string;
  gender: Gender;
  bloodGroup: BloodGroup;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height?: string | null;
  weight?: string | null;
  smokingStatus?: boolean;
  dietaryPreferences?: string | null;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string | null;
  immunizationStatus?: string | null;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MaritalStatus;
}

export interface IMedicalReportInput {
  reportName: string;
  reportLink: string;
}

export interface IUpdatePatientInput {
  name?: string;
  email?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  isDeleted?: boolean;
  patientHelthData?: IPatientHealthDataInput;
  medicalReport?: IMedicalReportInput;
}
