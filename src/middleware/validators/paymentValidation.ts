import { PaymentSchema } from "../../schema/PaymentSchema";

export const validatePayment = (data: unknown) => {
  const parsed = PaymentSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Validation errors:", parsed.error.format());
    throw new Error("Invalid payment data");
  }

  return parsed.data;
};
