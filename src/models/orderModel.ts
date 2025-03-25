import mongoose, { Schema } from "mongoose";
import { OrderType } from "../types/orderType";

const orderSchema = new Schema<OrderType>({
  userId: {
    type: mongoose.Schema.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
      },
      items: [
        {
          product: {
            type: mongoose.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
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

const Order = mongoose.model("Order", orderSchema);
export default Order;
