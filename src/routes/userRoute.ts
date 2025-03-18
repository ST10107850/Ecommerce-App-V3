import { Router } from "express";
import {
  authUser,
  createUser,
  getUserProfile,
  logout,
} from "../controllers/userController";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validators/userValidation";
import { protect } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.post("/", registerValidation, createUser);
userRoute.post("/auth", loginValidation, authUser);
userRoute.get("/profile", protect, getUserProfile);
userRoute.post("/logout", logout);

export default userRoute;
