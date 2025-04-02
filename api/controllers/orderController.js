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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderDetails = exports.getUserOrders = exports.createOrders = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const orderServices_1 = require("../services/orderServices");
const http_codes_1 = require("../constants/http.codes");
const crudHandlerFactory_1 = require("../services/crudHandlerFactory");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
exports.createOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { shippingAddress, paymentMethod, cardDetails, deliveryOption } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const order = yield (0, orderServices_1.createOrdersService)(userId, shippingAddress, paymentMethod, cardDetails, deliveryOption);
    res.status(http_codes_1.CREATED).json({
        success: true,
        message: "Order placed successfully",
        data: order,
    });
}));
exports.getUserOrders = (0, crudHandlerFactory_1.getUserDoc)(orderModel_1.default, {
    path: "cart.cartId",
    populate: {
        path: "items.product",
        model: "Products",
    },
});
exports.getOrderDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield orderModel_1.default.findById(id)
        .populate({
        path: "cart.cartId",
        populate: {
            path: "items.product",
            model: "Products",
        },
    })
        .lean();
    if (!order) {
        return next(new HttpError_1.default("No order found with that ID", http_codes_1.NOT_FOUND));
    }
    res.status(http_codes_1.OK).json({
        success: true,
        id: req.params.id,
        data: order,
    });
}));
exports.updateOrderStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = yield (0, orderServices_1.updateOrderStatusService)(id, orderStatus);
    res.status(http_codes_1.OK).json({
        success: true,
        message: `Order status updated to ${orderStatus}`,
        data: order,
    });
}));
exports.deleteOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, orderServices_1.deleteOrderService)(id);
    res.status(http_codes_1.OK).json({ message: "Order deleted successfully" });
}));
//# sourceMappingURL=orderController.js.map