"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = void 0;
const clearAuthCookies = (res) => {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
};
exports.clearAuthCookies = clearAuthCookies;
//# sourceMappingURL=userCookies.js.map