"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.get("/user", (req, res) => {
    res.send({ message: "Hello world" });
});
app.listen(Number(PORT), () => {
    console.log("App is running on port: ", PORT);
});
exports.default = app;
//# sourceMappingURL=server.js.map