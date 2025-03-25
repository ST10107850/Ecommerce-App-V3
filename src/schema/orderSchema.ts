import mongoose from "mongoose";
import { z } from "zod";

export const orderSchema = z.object({
  userId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid user ObjectId",
  }),

  // cartId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
  //   message: "Invalid product iD format",
  // }),
  shippingAddress: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid product iD format",
    }),
  deliveryOption: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["card", "cash"]),
  totalAmount: z.number().positive(),
  taxAmount: z.number().positive(),
  deliveryFee: z.number().positive().default(50),
  discount: z.number().positive().optional(),
  orderStatus: z
    .enum(["Processing", "Shipped", "Delivered", "Cancelled"])
    .default("Processing"),
  createdAt: z.date().default(() => new Date()),
});
