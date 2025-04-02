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
exports.deleteCategory = exports.getAllCategory = exports.updateCategory = exports.createCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const categoryService_1 = require("../services/categoryService");
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const crudHandlerFactory_1 = require("../services/crudHandlerFactory");
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
exports.createCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new HttpError_1.default("User not authenticated", http_codes_1.UNAUTHORIZED);
    }
    const userId = req.user._id;
    console.log("User Id: ", userId);
    const category = yield (0, categoryService_1.createCategoryService)(req.body, userId);
    res.status(http_codes_1.CREATED).json({
        successs: true,
        message: "Category created successfully",
        data: category,
    });
}));
exports.updateCategory = (0, crudHandlerFactory_1.updateDoc)(categoryModel_1.default, "categoryName");
exports.getAllCategory = (0, crudHandlerFactory_1.getAllDoc)(categoryModel_1.default);
exports.deleteCategory = (0, crudHandlerFactory_1.deleteOneDoc)(categoryModel_1.default);
//# sourceMappingURL=categoryController.js.map