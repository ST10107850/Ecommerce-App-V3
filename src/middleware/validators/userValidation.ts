import expressAsyncHandler from "express-async-handler";
import { loginSchema, registerSchema } from "../../schema/useSchama";
import HttpError from "../../utils/HttpError";
import { CONFLICT } from "../../constants/http.codes";

export const loginValidation = expressAsyncHandler(async (req, res, next) => {
  const result = await loginSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
});

export const registerValidation = expressAsyncHandler(
  async (req, res, next) => {
    const result = await registerSchema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  }
);
