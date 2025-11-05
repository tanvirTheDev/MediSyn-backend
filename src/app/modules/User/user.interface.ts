export interface CreatePatientInput {
  patient: {
    name: string;
    email: string;
    contactNumber: string;
    address?: string;
    profilePhoto?: string;
  };
  password: string;
  file?: Express.Multer.File;
}
