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
exports.roleMiddleware = exports.protect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const http_codes_1 = require("../constants/http.codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_const_1 = require("../constants/env.const");
const userModel_1 = __importDefault(require("../models/userModel"));
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new HttpError_1.default("Not authorized, no token", http_codes_1.UNAUTHORIZED));
    }
    const decoded = jsonwebtoken_1.default.verify(token, env_const_1.JWT_SECRET);
    const user = yield userModel_1.default.findById(decoded.userId);
    if (!user) {
        console.log("User not found for decoded ID:", decoded.userId);
        return next(new HttpError_1.default("User not found", http_codes_1.UNAUTHORIZED));
    }
    req.user = user;
    next();
}));
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            ;
            throw new HttpError_1.default("Unauthorized: No user logged in", http_codes_1.UNAUTHORIZED);
        }
        const { role } = req.user;
        if (!allowedRoles.includes(role)) {
            throw new HttpError_1.default("Access Denied: Insufficient permission", http_codes_1.FORBIDDEN);
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=authMiddleware.js.map