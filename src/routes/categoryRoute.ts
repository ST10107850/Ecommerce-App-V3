import express from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import {
  updateValidate,
  validateCategory,
} from "../middleware/validators/categoryValidation";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController";

const categoryRoute = express.Router();

categoryRoute.post(
  "/",
  protect,
  roleMiddleware(["admin"]),
  validateCategory,
  createCategory
);
categoryRoute.get("/", getAllCategory);
categoryRoute.put(
  "/:id",
  protect,
  roleMiddleware(["admin"]),
  updateValidate,
  updateCategory
);

categoryRoute.delete(
  "/:id",
  protect,
  roleMiddleware(["admin"]),
  deleteCategory
);

export default categoryRoute;
