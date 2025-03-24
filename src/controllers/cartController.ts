import expressAsyncHandler from "express-async-handler";
import {
  createCartService,
  deleteCartItemService,
} from "../services/cartService";
import { CREATED, UNAUTHORIZED } from "../constants/http.codes";
import { Request, Response } from "express";
import HttpError from "../utils/HttpError";
import mongoose, { ObjectId } from "mongoose";
import { getUserDoc } from "../services/crudHandlerFactory";
import Cart from "../models/cartModel";

interface AuthenticatedRequest extends Request {
  user?: { _id: ObjectId };
}

export const createCart = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const { items } = req.body;
    const userId = req.user._id;

    const cart = await createCartService(userId, items);

    res.status(CREATED).json({
      status: "success",
      message: "Product has been added to cart",
      data: cart,
    });
  }
);

export const deleteCart = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new HttpError("User not authenticated", UNAUTHORIZED);
    }

    const {id} = req.params;
    const userId = req.user._id;

    const updatedCart = await deleteCartItemService(userId, id);

    res.json({
      success: true,
      message: "Item removed from cart",
      data: updatedCart,
    });
  }
);

export const getAllCarts = getUserDoc(Cart, "items.product");
