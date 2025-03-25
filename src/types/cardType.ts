import { Document, ObjectId } from "mongoose";

export interface CardDetaileType {
  cardType: "mastercard" | "visa";
  cardNumber: number;
  cardHolder: string;
  expiryDate: Date;
  cvv: number;
}

export interface PaymentMethodType extends Document {
  orderId: ObjectId;
  userId: ObjectId;
  paymentMethod: "card" | "cash";
  cardDetails: CardDetaileType[];
}
