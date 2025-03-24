import { Router } from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import { cartValidation } from "../middleware/validators/cartValidation";
import { createCart } from "../controllers/cartController";

const cartRoute = Router();

cartRoute.post("/", protect, roleMiddleware(['customer']), cartValidation, createCart);

export default cartRoute;