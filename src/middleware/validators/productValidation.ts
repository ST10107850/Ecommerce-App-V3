import expressAsyncHandler from "express-async-handler";
import { productSchema, updateProductSchema } from "../../schema/productSchema";
import HttpError from "../../utils/HttpError";
import { BAD_REQUEST } from "../../constants/http.codes";

export const validateProduct = expressAsyncHandler(async (req, res, next) => {
  const result = await productSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
});

export const updateProductValidation = expressAsyncHandler(
  async (req, res, next) => {
    const result = await updateProductSchema.safeParse(req.body);

    if (!result.success) {
      return next(new HttpError(result.error.errors[0].message, BAD_REQUEST));
    }

    next();
  }
);
