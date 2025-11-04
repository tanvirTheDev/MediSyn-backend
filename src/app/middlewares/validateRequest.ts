import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodObject } from "zod";

const validateRequest = (schema: ZodObject<any>): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("DATA", req.body);
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
