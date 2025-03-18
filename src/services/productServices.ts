import mongoose from "mongoose";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../constants/http.codes";
import { productTypes } from "../types/productTypes";
import HttpError from "../utils/HttpError";
import Category from "../models/categoryModel";
import Product from "../models/productModel";

export const createProductServies = async (
  product: productTypes,
  userId: string
) => {
  const {
    productName,
    ImageUri,
    price,
    description,
    categoryId,
    size,
    colours,
  } = product;

  console.log("Category Id: ", categoryId);

  if (!userId) {
    throw new HttpError("User not found", UNAUTHORIZED);
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new HttpError("Category not found", NOT_FOUND);
  }

  const categoryExist = await Category.findById(categoryId);
  if (!categoryExist) {
    throw new HttpError("Category doean't exist", NOT_FOUND);
  }

  const productExist = await Product.findOne({ productName });
  if (productExist) {
    throw new HttpError("Product already exist", NOT_FOUND);
  }

  const newProduct = await Product.create({
    userId,
    productName,
    ImageUri,
    price,
    description,
    categoryId: new mongoose.Types.ObjectId(categoryId),
    size,
    colours,
  });

  return newProduct;
};

export const getProductByCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new HttpError("Invali category ID ", BAD_REQUEST);
  }

  const product = await Product.find({ categoryId });

  if (product.length === 0) {
    throw new HttpError("No products found for this category", NOT_FOUND);
  }

  return product;
};
