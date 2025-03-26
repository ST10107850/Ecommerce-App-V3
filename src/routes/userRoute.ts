import { Router } from "express";
import {
  authUser,
  createUser,
  deleteAddress,
  forgetPassword,
  getCustomerUsers,
  getUserProfile,
  logout,
  resetPasssword,
  updatePassword,
  updateUserProfile,
  verifyOTP,
} from "../controllers/userController";
import {
  loginValidation,
  registerValidation,
  validateUpdate,
} from "../middleware/validators/userValidation";
import { protect, roleMiddleware } from "../middleware/authMiddleware";

const userRoute = Router();

userRoute.post("/", registerValidation, createUser);
userRoute.post("/auth", loginValidation, authUser);
userRoute.get("/profile", protect, getUserProfile);
userRoute.post("/logout", logout);
userRoute.put("/profile", protect, validateUpdate, updateUserProfile);//protect, roleMiddleware(["admin"]),
userRoute.get("/",  getCustomerUsers);
userRoute.put("/update-password", protect, validateUpdate, updatePassword);
userRoute.delete(
  "/delete-address/:addressId",
  protect,
  roleMiddleware(["customer"]),
  deleteAddress
);

userRoute.post("/verify-email", verifyOTP);
userRoute.post("/forget-password", forgetPassword);
userRoute.post("/reset-password", resetPasssword);
export default userRoute;
