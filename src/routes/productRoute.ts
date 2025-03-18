import { Router } from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import { validateProduct } from "../middleware/validators/productValidation";
import { createProduct, getAllProduct, getCategoryProduct } from "../controllers/productController";

const productRoute = Router();

productRoute.post(
  "/create",
  protect,
  roleMiddleware(["admin"]),
  validateProduct,
  createProduct
);
productRoute.get("/category/:categoryId", getCategoryProduct)
productRoute.get("/", getAllProduct);

export default productRoute;
