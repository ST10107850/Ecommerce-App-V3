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
exports.createCategoryService = void 0;
const http_codes_1 = require("../constants/http.codes");
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const createCategoryService = (categoryData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName, ImageUri } = categoryData;
    if (!userId) {
        throw new HttpError_1.default("User not found", http_codes_1.NOT_FOUND);
    }
    const categoryExist = yield categoryModel_1.default.findOne({ categoryName });
    if (categoryExist) {
        throw new HttpError_1.default("Category already exist", http_codes_1.CONFLICT);
    }
    const newCategory = yield categoryModel_1.default.create({
        userId: userId,
        categoryName,
        ImageUri,
    });
    return newCategory;
});
exports.createCategoryService = createCategoryService;
//# sourceMappingURL=categoryService.js.map