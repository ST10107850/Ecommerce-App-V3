import expressAsyncHandler from "express-async-handler";
import { categorySchema, updateCategoryschema } from "../../schema/categorySchema";
import HttpError from "../../utils/HttpError";
import { BAD_REQUEST } from "../../constants/http.codes";


export const validateCategory = expressAsyncHandler(async (req, res, next) => {
  const result = await categorySchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
});

export const updateValidate = expressAsyncHandler(async (req, res, next) => {
  const result = await updateCategoryschema.safeParse(req.body);

  if (!result.success) {
    return next(new HttpError(result.error.errors[0].message, BAD_REQUEST));
  }
  next();
});
