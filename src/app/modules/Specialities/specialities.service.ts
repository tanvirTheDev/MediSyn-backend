import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import prisma from "../../../shared/prisma";

// interface SpecialityInput {
//   title: string;
//   file?: Express.Multer.File;
// }

const createSpecialities = async (req: Request) => {
  const title =
    req.body.title || (req.body.data && JSON.parse(req.body.data).title);
  const file = req.file;

  const data: any = { title };

  if (file && file.path) {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "specialities",
      public_id: file.originalname.split(".")[0],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    data.icon = uploadResult.secure_url;
  }

  const result = await prisma.specialities.create({
    data,
  });

  return result;
};

const getAllSpecialities = async () => {
  const specialitiesData = prisma.specialities.findMany({});
  return specialitiesData;
};

const deleteSpecialitiesById = async (id: string) => {
  console.log("get all specialities");

  await prisma.doctorSpecialities.deleteMany({
    where: { specialitiesId: id },
  });

  const specialitiesData = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return specialitiesData;
};

const getDoctorsBySpecialityId = async (specialityId: string) => {
  console.log(specialityId);

  const specialityWithDoctors = await prisma.specialities.findUnique({
    where: { id: specialityId },
    include: {
      doctorSpecialities: {
        include: {
          doctor: true,
        },
      },
    },
  });

  if (!specialityWithDoctors) {
    throw new Error("Speciality not found");
  }

  // Flatten doctors array
  const doctors = specialityWithDoctors.doctorSpecialities.map(
    (ds: any) => ds.doctor
  );

  return doctors;
};

export const SpecialitiesService = {
  createSpecialities,
  getAllSpecialities,
  deleteSpecialitiesById,
  getDoctorsBySpecialityId,
};
