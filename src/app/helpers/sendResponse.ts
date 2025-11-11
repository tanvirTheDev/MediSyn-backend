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
  const response: Record<string, any> = {
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data ?? null,
  };

  // ✅ Only include meta if provided
  if (jsonData.meta) {
    response.meta = jsonData.meta;
  }

  res.status(jsonData.statusCode).json(response);
};
