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
exports.getAllCarts = exports.deleteCart = exports.createCart = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cartService_1 = require("../services/cartService");
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const crudHandlerFactory_1 = require("../services/crudHandlerFactory");
const cartModel_1 = __importDefault(require("../models/cartModel"));
exports.createCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const { items } = req.body;
    const userId = req.user._id;
    const cart = yield (0, cartService_1.createCartService)(userId, items);
    res.status(http_codes_1.CREATED).json({
        status: "success",
        message: "Product has been added to cart",
        data: cart,
    });
}));
exports.deleteCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const { id } = req.params;
    const userId = req.user._id;
    const updatedCart = yield (0, cartService_1.deleteCartItemService)(userId, id);
    res.json({
        success: true,
        message: "Item removed from cart",
        data: updatedCart,
    });
}));
exports.getAllCarts = (0, crudHandlerFactory_1.getUserDoc)(cartModel_1.default, "items.product");
//# sourceMappingURL=cartController.js.map