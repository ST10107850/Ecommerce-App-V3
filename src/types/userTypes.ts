import mongoose, { Document } from "mongoose";

export interface Address {
  id: mongoose.Types.ObjectId;
  street: string;
  town: string;
  city: string;
  postalCode: number;
}

export interface User extends Document {
  profileImage?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: number;
  idNumber?: number;
  address: Address[];
  role: "admin" | "customer";
  status: "active" | "inactive";
  password: string;
  refreshToken?: string | null;
  omitFields(fields: string[]): any;
  matchPassword(password: string) : any;
}
