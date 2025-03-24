import expressAsyncHandler from "express-async-handler";
import { itemsTypes } from "../../types/cartTypes";
import { cartSchema } from "../../schema/cartSchema";
import { NextFunction, Request, Response } from "express";
import HttpError from "../../utils/HttpError";
import { BAD_REQUEST } from "../../constants/http.codes";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const cartValidation = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id.toString();
    let { items } = req.body;

    if (!Array.isArray(items)) {
      throw new HttpError("Cart items must be an array", BAD_REQUEST);
    }

    items = items.map((item: itemsTypes) => ({
      product: item.product,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
    }));

    const result = await cartSchema.safeParseAsync({ userId, items });

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  }
);
