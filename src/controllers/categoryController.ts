import expressAsyncHandler from "express-async-handler";
import { createCategoryService } from "../services/categoryService";
import { CREATED, UNAUTHORIZED } from "../constants/http.codes";
import { Request, Response } from "express";
import HttpError from "../utils/HttpError";
import {
  deleteOneDoc,
  getAllDoc,
  updateDoc,
} from "../services/crudHandlerFactory";
import Category from "../models/categoryModel";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const createCategory = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const userId = req.user._id;

    console.log("User Id: ", userId);

    const category = await createCategoryService(req.body, userId);

    res.status(CREATED).json({
      successs: true,
      message: "Category created successfully",
      data: category,
    });
  }
);

export const updateCategory = updateDoc(Category, "categoryName");

export const getAllCategory = getAllDoc(Category);

export const deleteCategory = deleteOneDoc(Category);
