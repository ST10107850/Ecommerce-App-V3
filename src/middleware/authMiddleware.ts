import expressAsyncHandler from "express-async-handler";
import HttpError from "../utils/HttpError";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/http.codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.const";
import Users from "../models/userModel";
import { NextFunction, Response, Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}
interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protect = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new HttpError("Not authorized, no token", UNAUTHORIZED));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await Users.findById(decoded.userId);

    if (!user) {
      console.log("User not found for decoded ID:", decoded.userId);
      return next(new HttpError("User not found", UNAUTHORIZED));
    }

    req.user = user;
    next();
  }
);

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {;
      throw new HttpError("Unauthorized: No user logged in", UNAUTHORIZED);
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      throw new HttpError("Access Denied: Insufficient permission", FORBIDDEN);
    }
    next();
  };
};
