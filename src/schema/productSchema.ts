import mongoose, { Mongoose } from "mongoose";
import { z } from "zod";

export const productNameSchema = z
  .string()
  .nonempty("Product Name is required")
  .min(2, "Product Name must be at least 2 characters long")
  .max(225, "Product Name must be at most 225 characters long");

export const ImageUriSchema = z.array(
  z
    .string()
    .nonempty("Image is required")
    .url("Invalid image url")
    .regex(
      /\.(jpg|jpeg|png|gif|svg)$/,
      "URL must point to a valid image file (jpg, jpeg, png, gif, svg)"
    )
);

export const descriptionSchema = z
  .string()
  .nonempty("Description is required")
  .min(2, "Description must be at least 2 characters long");

export const priceSchema = z
  .number()
  .int()
  .nonnegative("Price must be a positive number");

export const productSchema = z.object({
  productName: productNameSchema,
  ImageUri: ImageUriSchema,
  description: descriptionSchema,
  price: priceSchema,
  colours: z.array(z.string().nonempty("Colour is required")),
  size: z.array(z.string().nonempty("Size is required")),
  discount: z.number().int().optional(),
  categoryId: z
    .string()
    .nonempty("Category is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),
});

export const updateProductSchema = productSchema.partial();
