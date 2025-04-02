"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = exports.priceSchema = exports.descriptionSchema = exports.ImageUriSchema = exports.productNameSchema = void 0;
const zod_1 = require("zod");
exports.productNameSchema = zod_1.z
    .string()
    .nonempty("Product Name is required")
    .min(2, "Product Name must be at least 2 characters long")
    .max(225, "Product Name must be at most 225 characters long");
exports.ImageUriSchema = zod_1.z.array(zod_1.z
    .string()
    .nonempty("Image is required")
    .url("Invalid image url")
    .regex(/\.(jpg|jpeg|png|gif|svg)$/, "URL must point to a valid image file (jpg, jpeg, png, gif, svg)"));
exports.descriptionSchema = zod_1.z
    .string()
    .nonempty("Description is required")
    .min(2, "Description must be at least 2 characters long");
exports.priceSchema = zod_1.z
    .number()
    .int()
    .nonnegative("Price must be a positive number");
exports.productSchema = zod_1.z.object({
    productName: exports.productNameSchema,
    ImageUri: exports.ImageUriSchema,
    description: exports.descriptionSchema,
    price: exports.priceSchema,
    colours: zod_1.z.array(zod_1.z.string().nonempty("Colour is required")),
    size: zod_1.z.array(zod_1.z.string().nonempty("Size is required")),
    discount: zod_1.z.number().int().optional(),
    categoryId: zod_1.z
        .string()
        .nonempty("Category is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),
});
exports.updateProductSchema = exports.productSchema.partial();
//# sourceMappingURL=productSchema.js.map