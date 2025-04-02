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
exports.deleteOrderService = exports.updateOrderStatusService = exports.createOrdersService = void 0;
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const http_codes_1 = require("../constants/http.codes");
const cartModel_1 = __importDefault(require("../models/cartModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const createOrdersService = (userId, shippingAddress, paymentMethod, cardDetails, deliveryOption) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    if (!shippingAddress) {
        throw new HttpError_1.default("Shipping address is required", http_codes_1.BAD_REQUEST);
    }
    const carts = yield cartModel_1.default.find({ user: userId });
    if (!carts || carts.length === 0) {
        throw new HttpError_1.default("No carts found for the user.", http_codes_1.BAD_REQUEST);
    }
    for (const cart of carts) {
        if (!cart._id) {
            throw new HttpError_1.default(`Invalid cart ID detected: ${cart}`, http_codes_1.BAD_REQUEST);
        }
    }
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    if (!user.address || !Array.isArray(user.address)) {
        throw new HttpError_1.default("User does not have any addresses", http_codes_1.BAD_REQUEST);
    }
    const userAddress = user.address.find((address) => address._id.toString() === shippingAddress.toString());
    if (!userAddress) {
        throw new HttpError_1.default("Address not found", http_codes_1.BAD_REQUEST);
    }
    let subtotal = 0;
    const cartItems = [];
    for (const cart of carts) {
        const items = yield Promise.all(cart.items.map((cartItem) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield productModel_1.default.findById(cartItem.product);
            if (!product) {
                throw new HttpError_1.default(`Product not found: ${cartItem.product}`, http_codes_1.BAD_REQUEST);
            }
            if (typeof product.price !== "number" || isNaN(product.price)) {
                throw new HttpError_1.default(`Invalid product price: ${product._id}`, http_codes_1.BAD_REQUEST);
            }
            const totalPrice = product.price * cartItem.quantity;
            subtotal += totalPrice;
            return {
                product: product._id,
                quantity: cartItem.quantity,
                size: cartItem.size || "N/A",
                color: cartItem.color || "N/A",
            };
        })));
        cartItems.push({
            cartId: cart._id,
            items,
        });
    }
    const deliveryFee = deliveryOption === "pickup" ? 0 : 50;
    const tax = subtotal * 0.1;
    const discount = 0;
    const totalAmount = subtotal + deliveryFee + tax - discount;
    if (isNaN(tax) || isNaN(totalAmount)) {
        throw new HttpError_1.default("Invalid tax or total amount calculation", http_codes_1.BAD_REQUEST);
    }
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const order = new orderModel_1.default({
        userId,
        cart: cartItems,
        shippingAddress: {
            addressId: shippingAddress,
            street: userAddress.street,
            town: userAddress.town,
            city: userAddress.city,
            postalCode: userAddress.postalCode,
        },
        deliveryOption,
        paymentMethod,
        totalAmount,
        taxAmount: tax,
        deliveryFee,
        discount,
        orderNumber,
        orderStatus: "Processing",
    });
    yield order.save();
    if (paymentMethod === "card" && cardDetails) {
        const payment = new paymentModel_1.default({
            orderId: order._id,
            userId,
            paymentMethod: paymentMethod,
            cardDetails,
        });
        yield payment.save();
    }
    yield cartModel_1.default.findOneAndDelete({ user: userId });
    return order;
});
exports.createOrdersService = createOrdersService;
const updateOrderStatusService = (id, orderStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const validateStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validateStatuses.includes(orderStatus)) {
        throw new HttpError_1.default("Invalid order status", http_codes_1.NOT_FOUND);
    }
    const order = yield orderModel_1.default.findById(id);
    if (!order) {
        throw new HttpError_1.default("Order not found", http_codes_1.NOT_FOUND);
    }
    if (order.orderStatus === "Cancelled") {
        throw new HttpError_1.default("Cannot update status. Order has already been cancelled.", http_codes_1.BAD_REQUEST);
    }
    order.orderStatus = orderStatus;
    const updatedStatus = yield order.save();
    return updatedStatus;
});
exports.updateOrderStatusService = updateOrderStatusService;
const deleteOrderService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(id);
    if (!order) {
        throw new HttpError_1.default("Order not found", http_codes_1.NOT_FOUND);
    }
    if (order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled") {
        throw new HttpError_1.default("Only delivered and cancelled orders can be deleted", http_codes_1.BAD_REQUEST);
    }
    const result = yield orderModel_1.default.findByIdAndDelete(id);
    return result;
});
exports.deleteOrderService = deleteOrderService;
//# sourceMappingURL=orderServices.js.map