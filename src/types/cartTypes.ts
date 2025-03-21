import { Document, ObjectId } from "mongoose";

export interface itemsTypes {
  productId: ObjectId;
  product: ObjectId;
  quantity: number;
  color: string;
  size: string;
}


export interface cartTypes extends Document {
  user: ObjectId;
  items:[itemsTypes];
}
