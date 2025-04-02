"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
});
const cardDetailsSchema = zod_1.z.object({
    cardType: zod_1.z.enum(["mastercard", "visa"], {
        errorMap: () => ({ message: "Card type must be 'mastercard' or 'visa'" }),
    }),
    cardNumber: zod_1.z
        .string()
        .length(16, { message: "Card number must be 16 digits" }),
    cardHolder: zod_1.z.string().min(3, { message: "Cardholder name is required" }),
    expiryDate: zod_1.z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: "Expiry date must be in MM/YY format",
    }),
    cvv: zod_1.z.string().length(3, { message: "CVV must be 3 digits" }),
});
exports.PaymentSchema = zod_1.z.object({
    orderId: objectIdSchema,
    userId: objectIdSchema,
    paymentMethod: zod_1.z.enum(["card", "cash"]),
    cardDetails: zod_1.z.array(cardDetailsSchema).optional(),
});
//# sourceMappingURL=PaymentSchema.js.map