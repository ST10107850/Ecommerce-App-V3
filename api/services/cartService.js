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
exports.deleteCartItemService = exports.createCartService = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const http_codes_1 = require("../constants/http.codes");
const createCartService = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    let cart = yield cartModel_1.default.findOne({ user: userId });
    if (!cart) {
        cart = new cartModel_1.default({
            user: userId,
            items: items.map(({ product, quantity, color, size }) => ({
                product,
                quantity,
                color,
                size,
            })),
        });
    }
    else {
        items.forEach(({ product, quantity, color, size }) => {
            if (!cart)
                return;
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === product.toString());
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ product, quantity, color, size });
            }
        });
    }
    return yield cart.save();
});
exports.createCartService = createCartService;
const deleteCartItemService = (userId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    const cart = yield cartModel_1.default.findOne({ user: userId });
    if (!cart) {
        throw new HttpError_1.default("Cart not found", http_codes_1.NOT_FOUND);
    }
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId.toString());
    if (itemIndex === -1) {
        throw new HttpError_1.default("Item not found in cart", http_codes_1.NOT_FOUND);
    }
    cart.items.splice(itemIndex, 1);
    yield cart.save();
    const updatedCart = yield cartModel_1.default.findOne({ user: userId }).populate("items.product");
    return updatedCart;
});
exports.deleteCartItemService = deleteCartItemService;
//# sourceMappingURL=cartService.js.map