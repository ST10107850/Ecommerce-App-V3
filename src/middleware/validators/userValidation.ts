import expressAsyncHandler from "express-async-handler";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../../schema/useSchama";
import { NextFunction, Request, Response } from "express";
import HttpError from "../../utils/HttpError";
import { BAD_REQUEST } from "../../constants/http.codes";

export const loginValidation = expressAsyncHandler(
  async (req: Request, res: Response, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  }
);

export const registerValidation = expressAsyncHandler(
  async (req, res, next) => {
    //You were not passing the lastName and firstName in the registerSchema
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  }
);

export const validateUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    return next(new HttpError(result.error.errors[0].message, BAD_REQUEST));
  }

  next();
};
