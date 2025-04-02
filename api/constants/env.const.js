"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_PASS = exports.EMAIL = exports.NODE_ENV = exports.JWT_SECRET = exports.PORT = exports.MONGO_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGO_URI = process.env.MONGO_URI;
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.NODE_ENV = process.env.NODE_ENV;
exports.EMAIL = process.env.EMAIL;
exports.EMAIL_PASS = process.env.EMAIL_PASS;
//# sourceMappingURL=env.const.js.map