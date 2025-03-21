import mongoose, { Schema } from "mongoose";
import { cartTypes } from "../types/cartTypes";

const CartSchema = new Schema<cartTypes>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        color: { type: String },
        size: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
