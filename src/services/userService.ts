import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.const";
import { CONFLICT, NOT_FOUND, UNAUTHORIZED } from "../constants/http.codes";
import Users from "../models/userModel";
import { User } from "../types/userTypes";
import { generateToken } from "../utils/generateToken";
import HttpError from "../utils/HttpError";
import { Response } from "express";

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

  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    role,
    password,
    profileImage,
  });

  return newUser;
};

export const loginUser = async (userData: User, res: Response) => {
  const { email, password } = userData;

  const user = await Users.findOne({ email });

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
