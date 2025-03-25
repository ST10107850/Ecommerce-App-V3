import { z } from "zod";

export const emailSchema = z.string().email("Invalid email");
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long");
export const firstNameSchema = z
  .string()
  .min(2, "First name must be at least 2 characters long");
export const lastNameSchema = z
  .string()
  .min(2, "Last name must be at least 2 characters long");
export const streetSchema = z
  .string()
  .min(2, "Street must be at least 2 characters long");
export const townSchema = z
  .string()
  .min(2, "Town must be at least 2 characters long");
export const citySchema = z
  .string()
  .min(2, "City must be at least 2 characters long");
export const postalCodeSchema = z
  .number()
  .min(2, "City must be at least 2 characters long");

const addressSchema = z.object({
  street: streetSchema,
  town: townSchema,
  city: citySchema,
  postalCode: postalCodeSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema
  .extend({
    //You were not passing the lastName and firstName in this schema
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    confirmPassword: passwordSchema,
    role: z.enum(["admin", "customer"]).default("customer"),
    phone: z.number().optional(),
    idNumber: z.number().optional(),
    address: z.array(addressSchema).optional(),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.number().optional(),
  idNumber: z.number().optional(),
  address: z
    .array(
      z.object({
        street: z.string().optional(),
        town: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.number().optional(),
      })
    )
    .optional(),
  statu: z.enum(["active", "inactive"]).optional(),
});
