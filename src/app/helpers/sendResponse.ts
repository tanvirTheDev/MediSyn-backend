import { Response } from "express";

export type TJsonData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T | null;
};

export const sendResponse = <T>(
  res: Response,
  jsonData: TJsonData<T>
): void => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    meta: jsonData.meta || null,
    data: jsonData.data || null,
  });
};
