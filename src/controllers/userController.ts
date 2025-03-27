import expressAsyncHandler from "express-async-handler";
import {
  deleteAddressService,
  forgetPasswordService,
  getProfiles,
  loginUser,
  registerUser,
  resetPassswordService,
  updatePasswordServices,
  updateProfilesService,
} from "../services/userService";
import Users from "../models/userModel";
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.codes";
import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/HttpError";
import { clearAuthCookies } from "../utils/userCookies";
import { verifyOPTService } from "../services/verifyOPTService";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const createUser = expressAsyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  const data = new Users(user).omitFields(["password", "refreshToken"]);

  res.status(CREATED).json({
    success: true,
    status: " User successfully registered",
    data: data,
  });
});

export const authUser = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { user } = await loginUser(req.body, res);

    const data = new Users(user).omitFields(["password", "refreshToken"]);

    res.status(OK).json({
      success: true,
      status: "User successfully logged in",
      data: data,
    });
  }
);

export const getUserProfile = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const user = await getProfiles(req.user._id);

    const data = new Users(user).omitFields(["password", "refreshToken"]);

    res.status(OK).json({ success: true, data: data });
  }
);

export const logout = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    clearAuthCookies(res);
    res.status(OK).json({ success: true, message: "Logout successfully....." });
  }
);

export const updateUserProfile = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const updatedUser = await updateProfilesService(req.user._id, req);

    const data = new Users(updatedUser).omitFields([
      "password",
      "refreshToken",
    ]);

    res.status(OK).json({
      success: true,
      status: "Profile updated successfully",
      data: data,
    });
  }
);

export const getCustomerUsers = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const users = await Users.find({ role: "customer" });

    res.status(OK).json({ success: true, data: users });
  }
);

export const updatePassword = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const { oldPassword, newPassword } = req.body;

    await updatePasswordServices(req.user._id, oldPassword, newPassword);

    res
      .status(OK)
      .json({ success: true, status: "Password updated successfully" });
  }
);

export const deleteAddress = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const { addressId } = req.params;

    const addresses = await deleteAddressService(req.user._id, addressId);
    res.status(OK).json(addresses);
  }
);

export const verifyOTP = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, otp } = req.body;

    const user = await verifyOPTService(email, otp);

    const data = new Users(user).omitFields(["password", "refreshToken"]);

    res.status(OK).json({ message: "Email verified successfully", data: data });
  }
);

export const forgetPassword = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.body;

    await forgetPasswordService(email);

    res
      .status(OK)
      .json({ message: "OTP sent to your email. Please check your inbox." });
  }
);

export const resetPasssword = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const {email, newPassword, otp} =req.body;

    await resetPassswordService(email, newPassword, otp);

    res.status(OK).json({message: "Password reset successfully." })
  }
);
