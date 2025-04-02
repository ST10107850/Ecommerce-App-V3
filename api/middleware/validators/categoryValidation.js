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
exports.updateValidate = exports.validateCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const categorySchema_1 = require("../../schema/categorySchema");
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const http_codes_1 = require("../../constants/http.codes");
exports.validateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categorySchema_1.categorySchema.safeParse(req.body);
    if (!result.success) {
        return next(result.error);
    }
    req.body = result.data;
    next();
}));
exports.updateValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categorySchema_1.updateCategoryschema.safeParse(req.body);
    if (!result.success) {
        return next(new HttpError_1.default(result.error.errors[0].message, http_codes_1.BAD_REQUEST));
    }
    next();
}));
//# sourceMappingURL=categoryValidation.js.map