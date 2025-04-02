"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userValidation_1 = require("../middleware/validators/userValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRoute = (0, express_1.Router)();
userRoute.post("/", userValidation_1.registerValidation, userController_1.createUser);
userRoute.post("/auth", userValidation_1.loginValidation, userController_1.authUser);
userRoute.get("/profile", authMiddleware_1.protect, userController_1.getUserProfile);
userRoute.post("/logout", userController_1.logout);
userRoute.put("/profile", authMiddleware_1.protect, userValidation_1.validateUpdate, userController_1.updateUserProfile);
userRoute.get("/", userController_1.getCustomerUsers);
userRoute.put("/update-password", authMiddleware_1.protect, userValidation_1.validateUpdate, userController_1.updatePassword);
userRoute.delete("/delete-address/:addressId", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), userController_1.deleteAddress);
userRoute.post("/verify-email", userController_1.verifyOTP);
userRoute.post("/forget-password", userController_1.forgetPassword);
userRoute.post("/reset-password", userController_1.resetPasssword);
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map