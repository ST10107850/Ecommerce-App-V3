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
exports.cartValidation = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cartSchema_1 = require("../../schema/cartSchema");
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const http_codes_1 = require("../../constants/http.codes");
exports.cartValidation = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
    let { items } = req.body;
    if (!Array.isArray(items)) {
        throw new HttpError_1.default("Cart items must be an array", http_codes_1.BAD_REQUEST);
    }
    items = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
    }));
    const result = yield cartSchema_1.cartSchema.safeParseAsync({ userId, items });
    if (!result.success) {
        return next(result.error);
    }
    req.body = result.data;
    next();
}));
//# sourceMappingURL=cartValidation.js.map