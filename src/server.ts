import express from "express";
import { PORT } from "./constants/env.const";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/dbConnection";
import { errorHandle, notFound } from "./middleware/errorMiddleware";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import orderRoute from "./routes/orderRoute";

const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api/users", userRoute);
// app.use("/api/category", categoryRoute);
// app.use("/api/product", productRoute);
// app.use("/api/cart", cartRoute);
// app.use("/api/orders", orderRoute);

// app.use(notFound);
// app.use(errorHandle);

app.get("/", (req, res)=>{
  res.send({message: "Hello world"})
})


app.listen(Number(PORT), () => {
  console.log("App is running on port: ", PORT);
  // dbConnection();
});

export default app;