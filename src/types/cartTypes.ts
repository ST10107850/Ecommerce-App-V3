import { Document, ObjectId } from "mongoose";

export interface itemsTypes {
  product: ObjectId;
  quantity: number;
  color: string;
  size: string;
}

export interface CartItemWithId {
  _id: ObjectId;
  product: ObjectId;
  quantity: number;
  color: string;
  size: string;
}


export interface cartTypes extends Document {
  user: ObjectId;
  items: [itemsTypes];
}
