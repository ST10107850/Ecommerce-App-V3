import mongoose, { Schema } from "mongoose";
import { productTypes } from "../types/productTypes";

const productSchema = new Schema<productTypes>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    ImageUri: [
      {
        type: String,
        required: true,
      }
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    colours: [
      {
        type: String,
        required: true,
      },
    ],
    size: [
      {
        type: String,
        required: true,
      },
    ],
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Products", productSchema);
export default Product;
