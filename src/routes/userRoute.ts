import { Router } from "express";
import { createUser } from "../controllers/userController";
import { registerValidation } from "../middleware/validators/userValidation";

const userRoute = Router();

userRoute.post("/", registerValidation, createUser);

export default userRoute;
