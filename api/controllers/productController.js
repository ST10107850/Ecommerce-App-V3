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
exports.deleteProduct = exports.getProductDetails = exports.updateProduct = exports.getAllProduct = exports.getCategoryProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const productServices_1 = require("../services/productServices");
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const crudHandlerFactory_1 = require("../services/crudHandlerFactory");
const productModel_1 = __importDefault(require("../models/productModel"));
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const product = yield (0, productServices_1.createProductServies)(req.body, req.user._id);
    res
        .status(http_codes_1.CREATED)
        .json({ success: true, message: "Product created", data: product });
}));
exports.getCategoryProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const products = yield (0, productServices_1.getProductByCategory)(categoryId);
    res
        .status(http_codes_1.OK)
        .json({ success: true, message: "Product found", data: products });
}));
exports.getAllProduct = (0, crudHandlerFactory_1.getPagnation)(productModel_1.default);
exports.updateProduct = (0, crudHandlerFactory_1.updateDoc)(productModel_1.default);
exports.getProductDetails = (0, crudHandlerFactory_1.getOneDoc)(productModel_1.default);
exports.deleteProduct = (0, crudHandlerFactory_1.deleteOneDoc)(productModel_1.default);
//# sourceMappingURL=productController.js.map