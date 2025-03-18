import { Document, Types } from "mongoose";

export interface productTypes extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  productName: string;
  ImageUri: string;
  description: string;
  price: number;
  colours: string[];
  size: string[];
  discount: number;
}
