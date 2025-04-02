"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const cartItemSchema = zod_1.z.object({
    product: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid product iD format",
    }),
    quantity: zod_1.z.number().gte(1, "Quantity must be at least 1"),
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
});
exports.cartSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .nonempty("User ID is required")
        .refine((id) => mongoose_1.default.Types.ObjectId.isValid(id)),
    items: zod_1.z.array(cartItemSchema),
});
//# sourceMappingURL=cartSchema.js.map