"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.orderSchema = zod_1.z.object({
    userId: zod_1.z.string().refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
        message: "Invalid user ObjectId",
    }),
    shippingAddress: zod_1.z
        .string()
        .refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid product iD format",
    }),
    deliveryOption: zod_1.z.enum(["delivery", "pickup"]),
    paymentMethod: zod_1.z.enum(["card", "cash"]),
    totalAmount: zod_1.z.number().positive(),
    taxAmount: zod_1.z.number().positive(),
    deliveryFee: zod_1.z.number().positive().default(50),
    discount: zod_1.z.number().positive().optional(),
    orderStatus: zod_1.z
        .enum(["Processing", "Shipped", "Delivered", "Cancelled"])
        .default("Processing"),
    createdAt: zod_1.z.date().default(() => new Date()),
});
//# sourceMappingURL=orderSchema.js.map