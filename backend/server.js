import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import farmerRouter from "./routes/farmerRoutes.js"
import shopkeeperRouter from "./routes/shopkeeperRoutes.js"
// import adminRouter from "./routes/adminRoute.js"
import connectCloudinary from "./config/cloudinary.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
// app.use(cors({
//     origin: [
//         'http://localhost:5173',
//         'http://localhost:5174',
//         'https://pulse-care-medical-appointment-mana.vercel.app',
//         'https://pulse-care-medical-appointment-mana-pi.vercel.app'
//     ],
//     credentials: true
// }))

app.use(cors())


// api endpoints
app.use("/api/farmers", farmerRouter);
app.use("/api/shopkeepers", shopkeeperRouter);
// app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// if (!process.env.VERCEL && !process.env.NETLIFY) {
//   app.listen(port, () => console.log(`Server started on PORT:${port}`))
// }

app.listen(port, () => console.log(`Server started on PORT:${port}`))

export default app