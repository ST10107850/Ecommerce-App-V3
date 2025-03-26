import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { dbConnection } from "../src/config/dbConnection";
import { PORT } from "../src/constants/env.const";
import { notFound, errorHandle } from "../src/middleware/errorMiddleware";
import cartRoute from "../src/routes/cartRoute";
import categoryRoute from "../src/routes/categoryRoute";
import orderRoute from "../src/routes/orderRoute";
import productRoute from "../src/routes/productRoute";
import userRoute from "../src/routes/userRoute";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self' https://vercel.live/; style-src 'self' https://vercel.live/; img-src 'self' data:; connect-src 'self' https://your-api-endpoint.com/;"
  );
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Connect to DB Before Registering Routes
dbConnection()
  .then(() => {
    console.log("✅ DB Connection Established. Registering Routes...");

    app.use("/api/users", userRoute);
    app.use("/api/category", categoryRoute);
    app.use("/api/product", productRoute);
    app.use("/api/cart", cartRoute);
    app.use("/api/orders", orderRoute);

    app.use(notFound);
    app.use(errorHandle);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });

export default app;
