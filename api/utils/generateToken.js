"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_const_1 = require("../constants/env.const");
const date_const_1 = require("../constants/date.const");
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, env_const_1.JWT_SECRET, {
        expiresIn: "30d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: env_const_1.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: (0, date_const_1.AFTER_30_DAYS)(),
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map