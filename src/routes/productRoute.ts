import { Router } from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import {
  updateProductValidation,
  validateProduct,
} from "../middleware/validators/productValidation";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getCategoryProduct,
  getProductDetails,
  updateProduct,
} from "../controllers/productController";

const productRoute = Router();

productRoute.post(
  "/create",
  protect,
  roleMiddleware(["admin"]),
  validateProduct,
  createProduct
);
productRoute.get("/category/:categoryId", getCategoryProduct);
productRoute.get("/", getAllProduct);

productRoute.put(
  "/:id",
  protect,
  roleMiddleware(["admin"]),
  updateProductValidation,
  updateProduct
);

productRoute.delete("/:id", protect, roleMiddleware(["admin"]), deleteProduct);
productRoute.get("/:id", getProductDetails);

export default productRoute;
