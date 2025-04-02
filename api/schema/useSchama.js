"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.registerSchema = exports.loginSchema = exports.postalCodeSchema = exports.citySchema = exports.townSchema = exports.streetSchema = exports.lastNameSchema = exports.firstNameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email("Invalid email");
exports.passwordSchema = zod_1.z
    .string()
    .min(6, "Password must be at least 6 characters long");
exports.firstNameSchema = zod_1.z
    .string()
    .min(2, "First name must be at least 2 characters long");
exports.lastNameSchema = zod_1.z
    .string()
    .min(2, "Last name must be at least 2 characters long");
exports.streetSchema = zod_1.z
    .string()
    .min(2, "Street must be at least 2 characters long");
exports.townSchema = zod_1.z
    .string()
    .min(2, "Town must be at least 2 characters long");
exports.citySchema = zod_1.z
    .string()
    .min(2, "City must be at least 2 characters long");
exports.postalCodeSchema = zod_1.z
    .number()
    .min(2, "City must be at least 2 characters long");
const addressSchema = zod_1.z.object({
    street: exports.streetSchema,
    town: exports.townSchema,
    city: exports.citySchema,
    postalCode: exports.postalCodeSchema,
});
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
exports.registerSchema = exports.loginSchema
    .extend({
    firstName: exports.firstNameSchema,
    lastName: exports.lastNameSchema,
    confirmPassword: exports.passwordSchema,
    role: zod_1.z.enum(["admin", "customer"]).default("customer"),
    phone: zod_1.z.number().optional(),
    idNumber: zod_1.z.number().optional(),
    address: zod_1.z.array(addressSchema).optional(),
    status: zod_1.z.enum(["active", "inactive"]).default("active"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.updateUserSchema = zod_1.z.object({
    email: exports.emailSchema.optional(),
    password: exports.passwordSchema.optional(),
    firstName: zod_1.z.string().min(2).optional(),
    lastName: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.number().optional(),
    idNumber: zod_1.z.number().optional(),
    address: zod_1.z
        .array(zod_1.z.object({
        street: zod_1.z.string().optional(),
        town: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        postalCode: zod_1.z.number().optional(),
    }))
        .optional(),
    statu: zod_1.z.enum(["active", "inactive"]).optional(),
});
//# sourceMappingURL=useSchama.js.map