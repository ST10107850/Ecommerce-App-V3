"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandle = exports.notFound = void 0;
const http_codes_1 = require("../constants/http.codes");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const zod_1 = require("zod");
const env_const_1 = require("../constants/env.const");
const handleZodError = (err) => {
    const error = err.issues.map((issue) => ({
        path: issue.path.map((p) => String(p)),
        message: issue.message,
    }));
    return {
        statusCode: http_codes_1.BAD_REQUEST,
        body: {
            error,
            message: "Validation Error",
        },
    };
};
const notFound = (req, res, next) => {
    const error = new HttpError_1.default(`Not Found - ${req.originalUrl}`, http_codes_1.NOT_FOUND);
    next(error);
};
exports.notFound = notFound;
const errorHandle = (err, req, res, next) => {
    console.error("Error:", err);
    if (err instanceof HttpError_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
            stack: env_const_1.NODE_ENV === "development" ? err.stack : undefined,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        const { statusCode, body } = handleZodError(err);
        res.status(statusCode).json(body);
        return;
    }
    res.status(http_codes_1.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        stack: env_const_1.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.errorHandle = errorHandle;
//# sourceMappingURL=errorMiddleware.js.map