import { Document, Types } from "mongoose";

export interface categoryTypes extends Document{
    userId: Types.ObjectId;
    categoryName: string;
    ImageUri: string;
}