import expressAsyncHandler from "express-async-handler";
import { registerUser } from "../services/userService";
import Users from "../models/userModel";
import { CREATED } from "../constants/http.codes";

export const createUser = expressAsyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  const data = new Users(user).omitFields(["password", "refreshToken"]);

  res
    .status(CREATED)
    .json({
      success: true,
      status: " User successfully registered",
      data: data,
    });
});
