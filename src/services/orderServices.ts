import { ObjectId } from "mongoose";
import { CardDetaileType, PaymentMethodType } from "../types/cardType";
import { OrderType, ShippingAddress } from "../types/orderType";
import HttpError from "../utils/HttpError";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http.codes";
import Cart from "../models/cartModel";
import Users from "../models/userModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import Payment from "../models/paymentModel";

type paymentMethods = "card" | "cash";
export const createOrdersService = async (
  userId: ObjectId,
  shippingAddress: ObjectId,
  paymentMethod: paymentMethods,
  cardDetails: CardDetaileType[] | null,
  deliveryOption: string
): Promise<OrderType> => {
  if (!userId) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  if (!shippingAddress) {
    throw new HttpError("Shipping address is required", BAD_REQUEST);
  }

  const carts = await Cart.find({ user: userId });

  if (!carts || carts.length === 0) {
    throw new HttpError("No carts found for the user.", BAD_REQUEST);
  }

  for (const cart of carts) {
    if (!cart._id) {
      throw new HttpError(`Invalid cart ID detected: ${cart}`, BAD_REQUEST);
    }
  }

  const user = await Users.findById(userId);

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  if (!user.address || !Array.isArray(user.address)) {
    throw new HttpError("User does not have any addresses", BAD_REQUEST);
  }

  const userAddress = user.address.find(
    (address) =>
      (address as ShippingAddress)._id.toString() === shippingAddress.toString()
    // address._id.equals(shippingAddress)
  );

  if (!userAddress) {
    throw new HttpError("Address not found", BAD_REQUEST);
  }

  let subtotal = 0;
  const cartItems = [];

  for (const cart of carts) {
    const items = await Promise.all(
      cart.items.map(async (cartItem) => {
        const product = await Product.findById(cartItem.product);

        if (!product) {
          throw new HttpError(
            `Product not found: ${cartItem.product}`,
            BAD_REQUEST
          );
        }

        if (typeof product.price !== "number" || isNaN(product.price)) {
          throw new HttpError(
            `Invalid product price: ${product._id}`,
            BAD_REQUEST
          );
        }

        const totalPrice = product.price * cartItem.quantity;
        subtotal += totalPrice;

        return {
          product: product._id,
          quantity: cartItem.quantity,
          size: cartItem.size || "N/A",
          color: cartItem.color || "N/A",
        };
      })
    );

    cartItems.push({
      cartId: cart._id,
      items,
    });
  }

  const deliveryFee = deliveryOption === "pickup" ? 0 : 50;
  const tax = subtotal * 0.1;
  const discount = 0;
  const totalAmount = subtotal + deliveryFee + tax - discount;

  if (isNaN(tax) || isNaN(totalAmount)) {
    throw new HttpError("Invalid tax or total amount calculation", BAD_REQUEST);
  }

  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  const order = new Order({
    userId,
    cart: cartItems,
    shippingAddress: {
      addressId: shippingAddress,
      street: userAddress.street,
      town: userAddress.town,
      city: userAddress.city,
      postalCode: userAddress.postalCode,
    },
    deliveryOption,
    paymentMethod,
    totalAmount,
    taxAmount: tax,
    deliveryFee,
    discount,
    orderNumber,
    orderStatus: "Processing",
  });

  await order.save();

  if (paymentMethod === "card" && cardDetails) {
    const payment = new Payment({
      orderId: order._id,
      userId,
      paymentMethod: paymentMethod as "card",
      cardDetails,
    });

    await payment.save();
  }

  await Cart.findOneAndDelete({ user: userId });

  return order;
};

export const updateOrderStatusService = async (
  id: string,
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled"
) => {
  const validateStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

  if (!validateStatuses.includes(orderStatus)) {
    throw new HttpError("Invalid order status", NOT_FOUND);
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new HttpError("Order not found", NOT_FOUND);
  }

  if (order.orderStatus === "Cancelled") {
    throw new HttpError(
      "Cannot update status. Order has already been cancelled.",
      BAD_REQUEST
    );
  }

  order.orderStatus = orderStatus;

  const updatedStatus = await order.save();

  return updatedStatus;
};

export const deleteOrderService = async (id: string) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new HttpError("Order not found", NOT_FOUND);
  }
  if(order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"){
    throw new HttpError("Only delivered and cancelled orders can be deleted", BAD_REQUEST);
  }


  const result = await Order.findByIdAndDelete(id);

  return result;
};
