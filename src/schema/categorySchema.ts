import mongoose from "mongoose";
import { z } from "zod";

export const categoryNameSchema = z
  .string()
  .nonempty("Category name is required")
  .max(50, "Category name must be at most 50 characters long")
  .min(2, "Category name must be at least 2 characters long");

export const ImageUriSchema = z
  .string()
  .nonempty("Image is required")
  .url("Invalid image url")
  .regex(
    /\.(jpg|jpeg|png|gif|svg)$/,
    "URL must point to a valid image file (jpg, jpeg, png, gif, svg)"
  );

export const categorySchema = z.object({
  // userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
  //   message: "Invalid ID format",
  // }),
  categoryName: categoryNameSchema,
  ImageUri: ImageUriSchema,
});

export const updateCategoryschema = categorySchema.partial();
