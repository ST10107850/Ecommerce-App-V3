import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

const cardDetailsSchema = z.object({
  cardType: z.enum(["mastercard", "visa"], {
    errorMap: () => ({ message: "Card type must be 'mastercard' or 'visa'" }),
  }),
  cardNumber: z
    .string()
    .length(16, { message: "Card number must be 16 digits" }),
  cardHolder: z.string().min(3, { message: "Cardholder name is required" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: "Expiry date must be in MM/YY format",
  }),
  cvv: z.string().length(3, { message: "CVV must be 3 digits" }),
});

export const PaymentSchema = z.object({
  orderId: objectIdSchema,
  userId: objectIdSchema,
  paymentMethod: z.enum(["card", "cash"]),
  cardDetails: z.array(cardDetailsSchema).optional(),
});
