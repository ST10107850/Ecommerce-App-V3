import { CONFLICT, NOT_FOUND } from "../constants/http.codes";
import Category from "../models/categoryModel";
import { categoryTypes } from "../types/categoryTypes";
import HttpError from "../utils/HttpError";

export const createCategoryService = async (
  categoryData: categoryTypes,
  userId: string
) => {
  const { categoryName, ImageUri } = categoryData;

  if (!userId) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  const categoryExist = await Category.findOne({ categoryName });

  if (categoryExist) {
    throw new HttpError("Category already exist", CONFLICT);
  }

  const newCategory = await Category.create({
    userId: userId,
    categoryName,
    ImageUri,
  });

  return newCategory;
};
