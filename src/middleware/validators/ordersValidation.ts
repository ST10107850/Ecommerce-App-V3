import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import HttpError from "../../utils/HttpError";
import { BAD_REQUEST } from "../../constants/http.codes";
import { orderSchema } from "../../schema/orderSchema";
import { ObjectId } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: { _id: ObjectId };
}

export const orderValidation = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id.toString();

    let {
      cartId,
      shippingAddress,
      paymentMethod,
      cardDetails,
      deliveryOption,
      totalAmount,
      taxAmount,
    } = req.body;

    if (!cartId) {
      throw new HttpError("cartId is required", BAD_REQUEST);
    }

    const result = orderSchema.safeParse({
      userId,
      cartId,
      shippingAddress,
      paymentMethod,
      cardDetails,
      deliveryOption,
      totalAmount,
      taxAmount,
    });

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;

    next();
  }
);
