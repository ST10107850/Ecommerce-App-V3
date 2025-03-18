import express from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware";
import { validateCategory } from "../middleware/validators/categoryValidation";
import { createCategory } from "../controllers/categoryController";


const categoryRoute = express.Router();

categoryRoute.post("/", protect, roleMiddleware(["admin"]), validateCategory, createCategory);
// router.get("/", getAllCategories);
// router.put("/:id", protect, roleMiddleware(["admin"]),updateValidate, updateCategory);
// router.delete("/:id",protect, roleMiddleware(["admin"]), deleteCategory);

export default categoryRoute;
