import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.const";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http.codes";
import Users from "../models/userModel";
import { User } from "../types/userTypes";
import { generateToken } from "../utils/generateToken";
import HttpError from "../utils/HttpError";
import { Response } from "express";
import mongoose from "mongoose";
import { Request } from "express";
import { generateOTP } from "../utils/generateOTP";
import { sendOTPEmail } from "../utils/sendOTPEmail ";
import bcrypt from "bcrypt";

export const registerUser = async (userData: User) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    role,
    password,
    profileImage,
  } = userData;

  const userExist = await Users.findOne({
    $or: [{ email }, { phone }, { idNumber }],
  });

  if (userExist) {
    throw new HttpError("User already exists", CONFLICT);
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    role,
    password,
    profileImage,
    otp,
    otpExpires,
    isVerified: false,
  });

  await sendOTPEmail(email, otp);
  return newUser;
};

export const loginUser = async (userData: User, res: Response) => {
  const { email, password } = userData;

  const user = await Users.findOne({ email });

  if (!user) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new HttpError("Please verify your email first", BAD_REQUEST);
  }

  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED);
  }

  generateToken(res, user._id);

  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await user.save();

  return { user, refreshToken };
};

export const getProfiles = async (userId: any) => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  return user;
};

interface Address {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
}

interface UpdateProfileRequest extends Request {
  body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    idNumber?: string;
    profileImage?: string;
    address?: Address[];
    password?: string;
  };
}

export const updateProfilesService = async (
  userId: string,
  req: UpdateProfileRequest
) => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  user.phone = typeof req.body.phone === "number" ? req.body.phone : user.phone;
  user.idNumber =
    typeof req.body.idNumber === "number" ? req.body.idNumber : user.idNumber;
  user.profileImage = req.body.profileImage || user.profileImage;

  if (!user.address) {
    user.address = [];
  }

  if (Array.isArray(req.body.address)) {
    req.body.address.forEach((newAddress: Address) => {
      if (!newAddress._id) {
        // Handle new address case
        user.address.push({
          ...newAddress,
          _id: new mongoose.Types.ObjectId(),
          street: newAddress.street || "",
          city: newAddress.city || "",
          state: newAddress.state || "",
          zipCode: newAddress.zipCode || "",
        });
      } else {
        const existingAddressIndex = user.address.findIndex(
          (addr: Address) => addr._id?.toString() === newAddress._id?.toString()
        );

        if (existingAddressIndex !== -1) {
          user.address[existingAddressIndex] = {
            ...user.address[existingAddressIndex],
            ...newAddress,
          };
        } else {
          user.address.push({
            ...newAddress,
            street: newAddress.street || "",
            city: newAddress.city || "",
            state: newAddress.state || "",
            zipCode: newAddress.zipCode || "",
          });
        }
      }
    });
  } else if (req.body.address) {
    throw new HttpError("Address must be an array", BAD_REQUEST);
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  return user;
};

export const updatePasswordServices = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  if (!oldPassword || !newPassword) {
    throw new HttpError(
      "Old password and new password are required",
      BAD_REQUEST
    );
  }

  if (newPassword.length < 6) {
    throw new HttpError("Password must be at least 6 characters", BAD_REQUEST);
  }

  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    throw new HttpError("Invalid old password", UNAUTHORIZED);
  }

  user.password = newPassword;
  await user.save();

  return user;
};

export const deleteAddressService = async (
  userId: string,
  addressId: string
) => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new HttpError("User not found", UNAUTHORIZED);
  }

  const addressIndex = user.address.findIndex(
    (address) => address._id.toString() == addressId
  );

  if (addressIndex === -1) {
    throw new HttpError("Address not found", NOT_FOUND);
  }

  user.address.splice(addressIndex, 1);
  await user.save();

  return { message: "Address deleted successfully" };
};

export const forgetPasswordService = async (email: string) => {
  const user = await Users.findOne({ email: email.toString() });

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOTPEmail(user.email, otp);

  return user;
};

export const resetPassswordService = async (
  email: string,
  newPassword: string,
  otp: string
) => {
  const user = await Users.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  if (!user.otp || user.otp !== otp ) {
    throw new HttpError("Invalid or expired OTP", BAD_REQUEST);
  }


  if (!user.isVerified ) {
    throw new HttpError("Please verify your email first", BAD_REQUEST);
  }

  user.set("password", newPassword, { omitUndefined: true });

  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return user;
};
