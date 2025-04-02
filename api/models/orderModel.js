"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Users",
        required: true,
    },
    orderNumber: {
        type: String,
        required: true,
    },
    cart: [
        {
            cartId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Cart",
                required: true,
            },
            items: [
                {
                    product: {
                        type: mongoose_1.default.Types.ObjectId,
                        ref: "Products",
                        require: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        default: 1,
                    },
                    color: { type: String },
                    size: { type: String },
                },
            ],
        },
    ],
    shippingAddress: {
        addressId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users.address",
            required: true,
        },
        street: { type: String, required: true },
        town: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
    },
    deliveryOption: {
        type: String,
        enum: ["delivery", "pickup"],
        required: true,
    },
    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 50 },
    discount: { type: Number, default: 0 },
    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
    },
    createdAt: { type: Date, default: Date.now },
});
orderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        this.orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    }
    next();
});
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
//# sourceMappingURL=orderModel.js.map