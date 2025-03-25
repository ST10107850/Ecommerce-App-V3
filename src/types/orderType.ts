import { Document, ObjectId } from "mongoose";
import { itemsTypes } from "./cartTypes";

export interface CartType {
  cartId: ObjectId;
  items: itemsTypes[];
}

export interface ShippingAddress {
  _id: ObjectId;
  addressId: ObjectId;
  street: string;
  town: string;
  city: string;
  postalCode: number;
}

export interface OrderType extends Document {
  userId: ObjectId;
  orderNumber: string;
  cart: CartType[];
  shippingAddress: ShippingAddress;
  deliveryOption: "delivery" | "pickup";
  paymentMethod: "card" | "cash";
  totalAmount: number;
  taxAmount: number;
  deliveryFee: number;
  discount: number;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
}
