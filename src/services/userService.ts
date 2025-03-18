import { CONFLICT, UNAUTHORIZED } from "../constants/http.codes";
import Users from "../models/userModel";
import { User } from "../types/userTypes";
import HttpError from "../utils/HttpError";

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

export const loginUser = async (userData: User) => {
  const { email, password } = userData;

  const user = await Users.findOne({ email });

  if (!user || (await user.matchPassword(password))) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED);
  }
};
