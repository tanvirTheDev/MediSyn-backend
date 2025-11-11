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
  console.log("get all specialities");
  const specialitiesData = prisma.specialities.findMany({});
  return specialitiesData;
};

const deleteSpecialitiesById = async (id: string) => {
  console.log("get all specialities");
  const specialitiesData = prisma.specialities.delete({
    where: {
      id,
    },
  });
  return specialitiesData;
};

export const SpecialitiesService = {
  createSpecialities,
  getAllSpecialities,
  deleteSpecialitiesById,
};
