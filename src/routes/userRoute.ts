import { Router } from "express";
import { authUser, createUser, getUserProfile } from "../controllers/userController";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validators/userValidation";
import { protect } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.post("/", registerValidation, createUser);
userRoute.post("/auth", loginValidation, authUser);
userRoute.get("/profile", protect, getUserProfile)

export default userRoute;
