import mongoose, { Document } from "mongoose";

export interface Address {
  _id: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User extends Document {
  _id: string;
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
  isVerified: boolean;
  refreshToken?: string | null;
  otp: string | null;
  otpExpires: Date | null;
  omitFields(fields: string[]): any;
  matchPassword: (password: string) => Promise<boolean>;
}
