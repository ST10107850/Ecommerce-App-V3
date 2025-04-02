"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const ordersValidation_1 = require("../middleware/validators/ordersValidation");
const orderController_1 = require("../controllers/orderController");
const orderRoute = (0, express_1.Router)();
orderRoute.post("/create", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), ordersValidation_1.orderValidation, orderController_1.createOrders);
orderRoute.get("/", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), orderController_1.getUserOrders);
orderRoute.get("/:id", authMiddleware_1.protect, orderController_1.getOrderDetails);
orderRoute.put("/:id", authMiddleware_1.protect, orderController_1.updateOrderStatus);
orderRoute.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), orderController_1.deleteOrder);
exports.default = orderRoute;
//# sourceMappingURL=orderRoute.js.map