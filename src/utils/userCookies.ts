export const clearAuthCookies = (res: any) => {
  res.clearCookie("jwt");
  res.clearCookie("refreshToken");
};
