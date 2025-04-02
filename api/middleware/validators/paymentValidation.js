"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayment = void 0;
const PaymentSchema_1 = require("../../schema/PaymentSchema");
const validatePayment = (data) => {
    const parsed = PaymentSchema_1.PaymentSchema.safeParse(data);
    if (!parsed.success) {
        console.error("Validation errors:", parsed.error.format());
        throw new Error("Invalid payment data");
    }
    return parsed.data;
};
exports.validatePayment = validatePayment;
//# sourceMappingURL=paymentValidation.js.map