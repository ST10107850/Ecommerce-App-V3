import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT || (5000 as number);
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV as string;

export const EMAIL = process.env.EMAIL as string;
export const EMAIL_PASS = process.env.EMAIL_PASS as string;
