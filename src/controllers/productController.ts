import expressAsyncHandler from "express-async-handler";
import {
  createProductServies,
  getProductByCategory,
} from "../services/productServices";
import { Request, Response } from "express";
import { OK, CREATED, UNAUTHORIZED } from "../constants/http.codes";
import HttpError from "../utils/HttpError";
import {
  deleteOneDoc,
  getOneDoc,
  getPagnation,
  updateDoc,
} from "../services/crudHandlerFactory";
import Product from "../models/productModel";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const createProduct = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const product = await createProductServies(req.body, req.user._id);
    res
      .status(CREATED)
      .json({ success: true, message: "Product created", data: product });
  }
);
export const getCategoryProduct = expressAsyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const products = await getProductByCategory(categoryId);

  res
    .status(OK)
    .json({ success: true, message: "Product found", data: products });
});



export const getAllProduct = getPagnation(Product);

export const updateProduct = updateDoc(Product);

export const getProductDetails = getOneDoc(Product);

export const deleteProduct = deleteOneDoc(Product);
