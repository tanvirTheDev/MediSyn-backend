import { Patient, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import {
  calculatePagination,
  IPaginationOptions,
} from "../../helpers/paginationHelpers";
import { patientSearchableField } from "./patient.constant";
import { IUpdatePatientInput } from "./patient.interface";

const getPatients = async (params: any, options: IPaginationOptions) => {
  console.log(params);
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...otherParams } = params;
  console.log("othersParams", otherParams);

  const andConditions: Prisma.PatientWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: patientSearchableField.map((field) => {
        console.log("field", field);

        return {
          [field]: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (Object.keys(otherParams).length > 0) {
    andConditions.push({
      AND: Object.keys(otherParams).map((key) => ({
        [key]: {
          equals: (otherParams as any)[key],
        },
      })),
    });
  }

  //   andConditions.push({
  //     isDeleted: false,
  //   });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.PatientOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };
  // console.log("WHERE CONDITION =>", JSON.stringify(whereConditions, null, 2));

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    include: {
      medicalReports: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIDFromDB = async (id: string): Promise<Patient | null> => {
  console.log(id);
  const result = await prisma.patient.findUnique({
    where: {
      id,
      //   isDeleted: false,
    },
  });

  console.log(result);

  return result;
};

const updateFromDB = async (
  id: string,
  data: IUpdatePatientInput
): Promise<Patient | null> => {
  const { patientHelthData, medicalReport, ...patientData } = data;
  console.log(patientHelthData, medicalReport);

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = prisma.$transaction(async (tx: any) => {
    // update  patient data
    const updatedPatient = await prisma.patient.update({
      where: {
        id,
        //   isDeleted: false,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });

    // create or update  patient health   data
    if (patientHelthData) {
      const heathData = await tx.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHelthData,
        create: {
          ...patientHelthData,
          patientId: patientInfo.id,
        },
      });
      console.log(heathData);
    }

    // create MedicalReports
    if (medicalReport) {
      const medicalReportData = await tx.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: patientInfo.id,
        },
      });
    }

    const responseData = await prisma.patient.findUnique({
      where: {
        id: patientInfo.id,
      },
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });

    return responseData;
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Patient> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tx: any) => {
    // delete medical report
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // delete patient health data
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    const deletePatient = await tx.patient.delete({
      where: {
        id,
      },
    });

    await tx.user.delete({
      where: {
        email: deletePatient.email,
      },
    });
    return deletePatient;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Patient> => {
  const result = await prisma.$transaction(async (tx: any) => {
    const deletedPatient = tx.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: {
        email: (await deletedPatient).email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedPatient;
  });
  return result;
};

export const PatientService = {
  getPatients,
  getByIDFromDB,
  updateFromDB,
  deleteFromDB,
  softDeleteFromDB,
};
