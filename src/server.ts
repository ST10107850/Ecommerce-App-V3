import express from "express";
import { PORT } from "./constants/env.const";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/dbConnection";
import { errorHandle, notFound } from "./middleware/errorMiddleware";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

app.use(notFound);
app.use(errorHandle);
app.listen(PORT, () => {
  console.log("App is running on port: ", PORT);
  dbConnection();
});
