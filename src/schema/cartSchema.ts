import mongoose from "mongoose";
import { z } from "zod";

const cartItemSchema = z.object({
  product: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid product iD format",
  }),
  quantity: z.number().gte(1, "Quantity must be at least 1"),
  color: z.string().optional(),
  size: z.string().optional(),
});

export const cartSchema = z.object({
  userId: z
    .string()
    .nonempty("User ID is required")
    .refine((id) => mongoose.Types.ObjectId.isValid(id)),
  items: z.array(cartItemSchema),
});
