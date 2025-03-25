import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  createOrdersService,
  deleteOrderService,
  updateOrderStatusService,
} from "../services/orderServices";
import { CREATED, NOT_FOUND, OK } from "../constants/http.codes";
import { getUserDoc } from "../services/crudHandlerFactory";
import Order from "../models/orderModel";
import HttpError from "../utils/HttpError";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const createOrders = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { shippingAddress, paymentMethod, cardDetails, deliveryOption } =
      req.body;
    const userId = req.user?._id;

    const order = await createOrdersService(
      userId,
      shippingAddress,
      paymentMethod,
      cardDetails,
      deliveryOption
    );

    res.status(CREATED).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  }
);

export const getUserOrders = getUserDoc(Order, {
  path: "cart.cartId",
  populate: {
    path: "items.product",
    model: "Products",
  },
});

export const getOrderDetails = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({
        path: "cart.cartId",
        populate: {
          path: "items.product",
          model: "Products",
        },
      })
      .lean();

    if (!order) {
      return next(new HttpError("No order found with that ID", NOT_FOUND));
    }

    res.status(OK).json({
      success: true,
      id: req.params.id,
      data: order,
    });
  }
);

export const updateOrderStatus = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await updateOrderStatusService(
      // new mongoose.Schema.Types.ObjectId(id),
      id,
      orderStatus
    );

    res.status(OK).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  }
);

export const deleteOrder = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    await deleteOrderService(id);

    res.status(OK).json({ message: "Order deleted successfully" });
  }
);
