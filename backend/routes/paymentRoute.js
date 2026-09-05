import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { onlinePayment,handleSuccess,handleFail } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/online", authMiddleware, onlinePayment);
paymentRouter.post("/online/success/:tran_id", handleSuccess);
paymentRouter.post("/online/fail", handleFail);

export default paymentRouter;