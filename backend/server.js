import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import farmerRouter from "./routes/farmerRoutes.js"
import shopkeeperRouter from "./routes/shopkeeperRoutes.js"
import authRouter from "./routes/authRoutes.js"
import connectCloudinary from "./config/cloudinary.js"
import cookieParser from "cookie-parser"
import adminRouter from "./routes/adminRoutes.js"
import productRouter from "./routes/productRoutes.js"
import adminProductRouter from "./routes/adminProductRoutes.js"
import categoryRouter from "./routes/categoryRouter.js"
import orderRouter from "./routes/orderRoute.js"
import notificationRouter from "./routes/notificationRoute.js"
import adminVerificationRouter from "./routes/adminVerificationRoute.js"
import paymentRouter from "./routes/paymentRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));


// api endpoints
app.use("/api/farmers", farmerRouter);
app.use("/api/shopkeepers", shopkeeperRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use(
    "/api/admin/products",
    adminProductRouter
);
app.use(
    "/api/categories",
    categoryRouter
);
app.use("/api/orders", orderRouter);

app.use("/api/notifications", notificationRouter);

app.use(
    "/api/admin/verification",
    adminVerificationRouter
);

app.use(
    "/api/payment",
    paymentRouter
);

app.get("/", (req, res) => {
  res.send("API Working")
});

// if (!process.env.VERCEL && !process.env.NETLIFY) {
//   app.listen(port, () => console.log(`Server started on PORT:${port}`))
// }

app.listen(port, () => console.log(`Server started on PORT:${port}`))

export default app