"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryschema = exports.categorySchema = exports.ImageUriSchema = exports.categoryNameSchema = void 0;
const zod_1 = require("zod");
exports.categoryNameSchema = zod_1.z
    .string()
    .nonempty("Category name is required")
    .max(50, "Category name must be at most 50 characters long")
    .min(2, "Category name must be at least 2 characters long");
exports.ImageUriSchema = zod_1.z
    .string()
    .nonempty("Image is required")
    .url("Invalid image url")
    .regex(/\.(jpg|jpeg|png|gif|svg)$/, "URL must point to a valid image file (jpg, jpeg, png, gif, svg)");
exports.categorySchema = zod_1.z.object({
    categoryName: exports.categoryNameSchema,
    ImageUri: exports.ImageUriSchema,
});
exports.updateCategoryschema = exports.categorySchema.partial();
//# sourceMappingURL=categorySchema.js.map