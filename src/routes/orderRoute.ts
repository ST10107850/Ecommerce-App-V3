import { Router } from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import { orderValidation } from "../middleware/validators/ordersValidation";
import {
  createOrders,
  deleteOrder,
  getOrderDetails,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController";

const orderRoute = Router();

orderRoute.post(
  "/create",
  protect,
  roleMiddleware(["customer"]),
  orderValidation,
  createOrders
);

orderRoute.get("/", protect, roleMiddleware(["customer"]), getUserOrders);
orderRoute.get("/:id", protect, getOrderDetails);
orderRoute.put("/:id", protect, updateOrderStatus);
orderRoute.delete("/:id", protect, roleMiddleware(["customer"]), deleteOrder);

export default orderRoute;
