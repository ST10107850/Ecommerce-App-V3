"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const categoryValidation_1 = require("../middleware/validators/categoryValidation");
const categoryController_1 = require("../controllers/categoryController");
const categoryRoute = express_1.default.Router();
categoryRoute.post("/", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), categoryValidation_1.validateCategory, categoryController_1.createCategory);
categoryRoute.get("/", categoryController_1.getAllCategory);
categoryRoute.put("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), categoryValidation_1.updateValidate, categoryController_1.updateCategory);
categoryRoute.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.roleMiddleware)(["admin"]), categoryController_1.deleteCategory);
exports.default = categoryRoute;
//# sourceMappingURL=categoryRoute.js.map