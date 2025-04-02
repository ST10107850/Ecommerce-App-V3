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
exports.verifyOPTService = void 0;
const http_codes_1 = require("../constants/http.codes");
const userModel_1 = __importDefault(require("../models/userModel"));
const generateOTP_1 = require("../utils/generateOTP");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const sendOTPEmail_1 = require("../utils/sendOTPEmail ");
const verifyOPTService = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
        const newOTP = (0, generateOTP_1.generateOTP)();
        user.otp = newOTP;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        yield user.save();
        yield (0, sendOTPEmail_1.sendOTPEmail)(user.email, newOTP);
        throw new HttpError_1.default("OTP expired. A new OTP has been sent to your email.", http_codes_1.BAD_REQUEST);
    }
    if (user.otp !== otp) {
        throw new HttpError_1.default("Invalid OTP", http_codes_1.BAD_REQUEST);
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    yield user.save();
    return user;
});
exports.verifyOPTService = verifyOPTService;
//# sourceMappingURL=verifyOPTService.js.map