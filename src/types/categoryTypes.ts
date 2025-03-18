import { Document } from "mongoose";

export interface Category extends Document{
    userId: string;
    categoryName: string;
    imageUri: string;
}