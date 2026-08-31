import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
    initiateSSLCommerzPayment,
    sslCommerzSuccess,
    sslCommerzFail,
    sslCommerzCancel,
    sslCommerzIPN
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();


// Start payment
paymentRouter.post(
    "/sslcommerz/initiate",
    authMiddleware,
    initiateSSLCommerzPayment
);


// SSLCOMMERZ callbacks
paymentRouter.post(
    "/sslcommerz/success",
    sslCommerzSuccess
);

paymentRouter.post(
    "/sslcommerz/fail",
    sslCommerzFail
);

paymentRouter.post(
    "/sslcommerz/cancel",
    sslCommerzCancel
);

paymentRouter.post(
    "/sslcommerz/ipn",
    sslCommerzIPN
);


export default paymentRouter;