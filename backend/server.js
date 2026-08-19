import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import farmerRouter from "./routes/farmerRoutes.js"
import shopkeeperRouter from "./routes/shopkeeperRoutes.js"
import authRouter from "./routes/authRoutes.js"
import connectCloudinary from "./config/cloudinary.js"
import cookieParser from "cookie-parser"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// api endpoints
app.use("/api/farmers", farmerRouter);
app.use("/api/shopkeepers", shopkeeperRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API Working")
});

// if (!process.env.VERCEL && !process.env.NETLIFY) {
//   app.listen(port, () => console.log(`Server started on PORT:${port}`))
// }

app.listen(port, () => console.log(`Server started on PORT:${port}`))

export default app