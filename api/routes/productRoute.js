"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const productValidation_1 = require("../middleware/validators/productValidation");
const productController_1 = require("../controllers/productController");
const productRoute = (0, express_1.Router)();
productRoute.post("/create", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), productValidation_1.validateProduct, productController_1.createProduct);
productRoute.get("/category/:categoryId", productController_1.getCategoryProduct);
productRoute.get("/", productController_1.getAllProduct);
productRoute.put("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), productValidation_1.updateProductValidation, productController_1.updateProduct);
productRoute.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), productController_1.deleteProduct);
productRoute.get("/:id", productController_1.getProductDetails);
exports.default = productRoute;
//# sourceMappingURL=productRoute.js.map