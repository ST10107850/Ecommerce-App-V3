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
exports.getProductByCategory = exports.createProductServies = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const createProductServies = (product, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, ImageUri, price, description, categoryId, size, colours, } = product;
    console.log("Category Id: ", categoryId);
    if (!userId) {
        throw new HttpError_1.default("User not found", http_codes_1.UNAUTHORIZED);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
        throw new HttpError_1.default("Category not found", http_codes_1.NOT_FOUND);
    }
    const categoryExist = yield categoryModel_1.default.findById(categoryId);
    if (!categoryExist) {
        throw new HttpError_1.default("Category doean't exist", http_codes_1.NOT_FOUND);
    }
    const productExist = yield productModel_1.default.findOne({ productName });
    if (productExist) {
        throw new HttpError_1.default("Product already exist", http_codes_1.NOT_FOUND);
    }
    const newProduct = yield productModel_1.default.create({
        userId,
        productName,
        ImageUri,
        price,
        description,
        categoryId: new mongoose_1.default.Types.ObjectId(categoryId),
        size,
        colours,
    });
    return newProduct;
});
exports.createProductServies = createProductServies;
const getProductByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
        throw new HttpError_1.default("Invali category ID ", http_codes_1.BAD_REQUEST);
    }
    const product = yield productModel_1.default.find({ categoryId });
    if (product.length === 0) {
        throw new HttpError_1.default("No products found for this category", http_codes_1.NOT_FOUND);
    }
    return product;
});
exports.getProductByCategory = getProductByCategory;
//# sourceMappingURL=productServices.js.map