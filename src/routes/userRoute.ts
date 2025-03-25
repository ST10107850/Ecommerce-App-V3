import { Router } from "express";
import {
  authUser,
  createUser,
  deleteAddress,
  getCustomerUsers,
  getUserProfile,
  logout,
  updatePassword,
  updateUserProfile,
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
userRoute.put("/profile", protect, validateUpdate, updateUserProfile);
userRoute.get("/", protect, roleMiddleware(["admin"]), getCustomerUsers);
userRoute.put("/update-password", protect, validateUpdate, updatePassword);
userRoute.delete(
  "/delete-address/:addressId",
  protect,
  roleMiddleware(["customer"]),
  deleteAddress
);
export default userRoute;
