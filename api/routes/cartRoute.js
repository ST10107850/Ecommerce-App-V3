"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cartValidation_1 = require("../middleware/validators/cartValidation");
const cartController_1 = require("../controllers/cartController");
const cartRoute = (0, express_1.Router)();
cartRoute.post("/", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(['customer']), cartValidation_1.cartValidation, cartController_1.createCart);
cartRoute.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), cartController_1.deleteCart);
cartRoute.get("/", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["customer"]), cartController_1.getAllCarts);
exports.default = cartRoute;
//# sourceMappingURL=cartRoute.js.map