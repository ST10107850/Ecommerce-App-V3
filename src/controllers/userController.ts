import expressAsyncHandler from "express-async-handler";
import { getProfiles, loginUser, registerUser } from "../services/userService";
import Users from "../models/userModel";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http.codes";
import { Request, Response } from "express";
import HttpError from "../utils/HttpError";
import { clearAuthCookies } from "../utils/userCookies";
interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const createUser = expressAsyncHandler(async (req:AuthenticatedRequest, res:Response) => {
  const user = await registerUser(req.body);

  const data = new Users(user).omitFields(["password", "refreshToken"]);

  res.status(CREATED).json({
    success: true,
    status: " User successfully registered",
    data: data,
  });
});

export const authUser = expressAsyncHandler(async (req:AuthenticatedRequest, res: Response) => {
  const { user } = await loginUser(req.body, res);

  const data = new Users(user).omitFields(["password", "refreshToken"]);

  console.log("Daata: ", data);

  res
    .status(OK)
    .json({ success: true, status: "User successfully logged in", data: data });
});

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

export const logout = expressAsyncHandler(async (req: AuthenticatedRequest, res:Response) => {
  clearAuthCookies(res);
  res.status(OK).json({ success: true, message: "Logout successfully....." });
});
