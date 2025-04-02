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
exports.resetPassswordService = exports.forgetPasswordService = exports.deleteAddressService = exports.updatePasswordServices = exports.updateProfilesService = exports.getProfiles = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_const_1 = require("../constants/env.const");
const http_codes_1 = require("../constants/http.codes");
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const mongoose_1 = __importDefault(require("mongoose"));
const generateOTP_1 = require("../utils/generateOTP");
const sendOTPEmail_1 = require("../utils/sendOTPEmail ");
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phone, idNumber, role, password, profileImage, } = userData;
    const userExist = yield userModel_1.default.findOne({
        $or: [{ email }, { phone }, { idNumber }],
    });
    if (userExist) {
        throw new HttpError_1.default("User already exists", http_codes_1.CONFLICT);
    }
    const otp = (0, generateOTP_1.generateOTP)();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const newUser = yield userModel_1.default.create({
        firstName,
        lastName,
        email,
        phone,
        idNumber,
        role,
        password,
        profileImage,
        otp,
        otpExpires,
        isVerified: false,
    });
    yield (0, sendOTPEmail_1.sendOTPEmail)(email, otp);
    return newUser;
});
exports.registerUser = registerUser;
const loginUser = (userData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = userData;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        throw new HttpError_1.default("Invalid email or password", http_codes_1.UNAUTHORIZED);
    }
    if (!user.isVerified) {
        throw new HttpError_1.default("Please verify your email first", http_codes_1.BAD_REQUEST);
    }
    if (!user || !(yield user.matchPassword(password))) {
        throw new HttpError_1.default("Invalid email or password", http_codes_1.UNAUTHORIZED);
    }
    (0, generateToken_1.generateToken)(res, user._id);
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, env_const_1.JWT_SECRET, {
        expiresIn: "7d",
    });
    user.refreshToken = refreshToken;
    yield user.save();
    return { user, refreshToken };
});
exports.loginUser = loginUser;
const getProfiles = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    return user;
});
exports.getProfiles = getProfiles;
const updateProfilesService = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = typeof req.body.phone === "number" ? req.body.phone : user.phone;
    user.idNumber =
        typeof req.body.idNumber === "number" ? req.body.idNumber : user.idNumber;
    user.profileImage = req.body.profileImage || user.profileImage;
    if (!user.address) {
        user.address = [];
    }
    if (Array.isArray(req.body.address)) {
        req.body.address.forEach((newAddress) => {
            if (!newAddress._id) {
                user.address.push(Object.assign(Object.assign({}, newAddress), { _id: new mongoose_1.default.Types.ObjectId(), street: newAddress.street || "", city: newAddress.city || "", state: newAddress.state || "", zipCode: newAddress.zipCode || "" }));
            }
            else {
                const existingAddressIndex = user.address.findIndex((addr) => { var _a, _b; return ((_a = addr._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = newAddress._id) === null || _b === void 0 ? void 0 : _b.toString()); });
                if (existingAddressIndex !== -1) {
                    user.address[existingAddressIndex] = Object.assign(Object.assign({}, user.address[existingAddressIndex]), newAddress);
                }
                else {
                    user.address.push(Object.assign(Object.assign({}, newAddress), { street: newAddress.street || "", city: newAddress.city || "", state: newAddress.state || "", zipCode: newAddress.zipCode || "" }));
                }
            }
        });
    }
    else if (req.body.address) {
        throw new HttpError_1.default("Address must be an array", http_codes_1.BAD_REQUEST);
    }
    if (req.body.password) {
        user.password = req.body.password;
    }
    yield user.save();
    return user;
});
exports.updateProfilesService = updateProfilesService;
const updatePasswordServices = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    if (!oldPassword || !newPassword) {
        throw new HttpError_1.default("Old password and new password are required", http_codes_1.BAD_REQUEST);
    }
    if (newPassword.length < 6) {
        throw new HttpError_1.default("Password must be at least 6 characters", http_codes_1.BAD_REQUEST);
    }
    const isMatch = yield user.matchPassword(oldPassword);
    if (!isMatch) {
        throw new HttpError_1.default("Invalid old password", http_codes_1.UNAUTHORIZED);
    }
    user.password = newPassword;
    yield user.save();
    return user;
});
exports.updatePasswordServices = updatePasswordServices;
const deleteAddressService = (userId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.UNAUTHORIZED);
    }
    const addressIndex = user.address.findIndex((address) => address._id.toString() == addressId);
    if (addressIndex === -1) {
        throw new HttpError_1.default("Address not found", http_codes_1.NOT_FOUND);
    }
    user.address.splice(addressIndex, 1);
    yield user.save();
    return { message: "Address deleted successfully" };
});
exports.deleteAddressService = deleteAddressService;
const forgetPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: email.toString() });
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    const otp = (0, generateOTP_1.generateOTP)();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    yield user.save();
    yield (0, sendOTPEmail_1.sendOTPEmail)(user.email, otp);
    return user;
});
exports.forgetPasswordService = forgetPasswordService;
const resetPassswordService = (email, newPassword, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    if (!user.otp || user.otp !== otp) {
        throw new HttpError_1.default("Invalid or expired OTP", http_codes_1.BAD_REQUEST);
    }
    if (!user.isVerified) {
        throw new HttpError_1.default("Please verify your email first", http_codes_1.BAD_REQUEST);
    }
    user.set("password", newPassword, { omitUndefined: true });
    user.otp = null;
    user.otpExpires = null;
    yield user.save();
    return user;
});
exports.resetPassswordService = resetPassswordService;
//# sourceMappingURL=userService.js.map