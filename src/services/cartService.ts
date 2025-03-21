import expressAsyncHandler from "express-async-handler";
import HttpError from "../utils/HttpError";
import { NOT_FOUND } from "../constants/http.codes";
import Cart from "../models/cartModel";

export const createCartService = async (userId, items) => {
  if (!userId) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  let cart = await Cart.findOne({ user: userId });

  if(!cart){
    cart = new Cart({
        user: userId,
        items: items.map(({product, quantity, color, size}))
    })
  }
};
