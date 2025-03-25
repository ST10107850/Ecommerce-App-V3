import { Document, ObjectId } from "mongoose";
import Cart from "../models/cartModel";
import HttpError from "../utils/HttpError";
import { NOT_FOUND } from "../constants/http.codes";
import { CartItemWithId, itemsTypes } from "../types/cartTypes";
import { cartTypes } from "../types/cartTypes";

export const createCartService = async (
  userId: ObjectId,
  items: itemsTypes[]
): Promise<cartTypes> => {
  if (!userId) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: items.map(({ product, quantity, color, size }) => ({
        product,
        quantity,
        color,
        size,
      })),
    });
  } else {
    items.forEach(({ product, quantity, color, size }) => {
      if (!cart) return;

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity, color, size });
      }
    });
  }

  return await cart.save();
};

export const deleteCartItemService = async (
  userId: ObjectId,
  itemId: string
) => {
  if (!userId) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new HttpError("Cart not found", NOT_FOUND);
  }

  const itemIndex = cart.items.findIndex(
    (item) => (item as (CartItemWithId))._id.toString() === itemId.toString()
  );

  if (itemIndex === -1) {
    throw new HttpError("Item not found in cart", NOT_FOUND);
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  return updatedCart;
};
