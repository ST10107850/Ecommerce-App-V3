"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasssword = exports.forgetPassword = exports.verifyOTP = exports.deleteAddress = exports.updatePassword = exports.getCustomerUsers = exports.updateUserProfile = exports.logout = exports.getUserProfile = exports.authUser = exports.createUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userService_1 = require("../services/userService");
const userModel_1 = __importDefault(require("../models/userModel"));
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const userCookies_1 = require("../utils/userCookies");
const verifyOPTService_1 = require("../services/verifyOPTService");
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userService_1.registerUser)(req.body);
    const data = new userModel_1.default(user).omitFields(["password", "refreshToken"]);
    res.status(http_codes_1.CREATED).json({
        success: true,
        status: " User successfully registered",
        data: data,
    });
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = yield (0, userService_1.loginUser)(req.body, res);
    const data = new userModel_1.default(user).omitFields(["password", "refreshToken"]);
    res.status(http_codes_1.OK).json({
        success: true,
        status: "User successfully logged in",
        data: data,
    });
}));
exports.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const user = yield (0, userService_1.getProfiles)(req.user._id);
    const data = new userModel_1.default(user).omitFields(["password", "refreshToken"]);
    res.status(http_codes_1.OK).json({ success: true, data: data });
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userCookies_1.clearAuthCookies)(res);
    res.status(http_codes_1.OK).json({ success: true, message: "Logout successfully....." });
}));
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const updatedUser = yield (0, userService_1.updateProfilesService)(req.user._id, req);
    const data = new userModel_1.default(updatedUser).omitFields([
        "password",
        "refreshToken",
    ]);
    res.status(http_codes_1.OK).json({
        success: true,
        status: "Profile updated successfully",
        data: data,
    });
}));
exports.getCustomerUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({ role: "customer" });
    res.status(http_codes_1.OK).json({ success: true, data: users });
}));
exports.updatePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const { oldPassword, newPassword } = req.body;
    yield (0, userService_1.updatePasswordServices)(req.user._id, oldPassword, newPassword);
    res
        .status(http_codes_1.OK)
        .json({ success: true, status: "Password updated successfully" });
}));
exports.deleteAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const { addressId } = req.params;
    const addresses = yield (0, userService_1.deleteAddressService)(req.user._id, addressId);
    res.status(http_codes_1.OK).json(addresses);
}));
exports.verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield (0, verifyOPTService_1.verifyOPTService)(email, otp);
    const data = new userModel_1.default(user).omitFields(["password", "refreshToken"]);
    res.status(http_codes_1.OK).json({ message: "Email verified successfully", data: data });
}));
exports.forgetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield (0, userService_1.forgetPasswordService)(email);
    res
        .status(http_codes_1.OK)
        .json({ message: "OTP sent to your email. Please check your inbox." });
}));
exports.resetPasssword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, otp } = req.body;
    yield (0, userService_1.resetPassswordService)(email, newPassword, otp);
    res.status(http_codes_1.OK).json({ message: "Password reset successfully." });
}));
//# sourceMappingURL=userController.js.map