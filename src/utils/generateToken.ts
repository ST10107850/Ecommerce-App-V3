import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants/env.const";
import { AFTER_30_DAYS } from "../constants/date.const";
import { Response } from "express";

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET as string, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: AFTER_30_DAYS(),
  });
};
