import orderModel from "../models/orderModel.js";
import shopkeeperModel from "../models/shopkeeper.js";
import initiatePayment from "../services/sslcommerzService.js";
import axios from "axios";
import productModel from "../models/Product.js";


// SSLCOMMERZ base URL
const SSLCOMMERZ_IS_SANDBOX =
    process.env.SSLCOMMERZ_IS_SANDBOX === "true";

const SSLCOMMERZ_BASE_URL = SSLCOMMERZ_IS_SANDBOX
    ? "https://sandbox.sslcommerz.com"
    : "https://securepay.sslcommerz.com";


// Complete online payment safely
const completeOnlinePayment = async (validation) => {
    try {
        const {
            tran_id,
            val_id,
            amount
        } = validation;

        // Find order using SSLCOMMERZ transaction ID
        const order = await orderModel.findOne({
            sslcommerzTransactionId: tran_id
        });

        if (!order) {
            return {
                success: false,
                message: "Order not found."
            };
        }

        // Already completed
        if (order.paymentStatus === "paid") {
            return {
                success: true,
                order,
                alreadyCompleted: true
            };
        }

        // Verify payment amount
        if (
            Number(amount) !==
            Number(order.totalAmount)
        ) {
            return {
                success: false,
                message: "Payment amount mismatch."
            };
        }

        // Only online payments
        if (order.paymentMethod !== "online") {
            return {
                success: false,
                message: "Invalid payment method."
            };
        }

        // Get product
        const product = await productModel.findById(
            order.product
        );

        if (!product) {
            return {
                success: false,
                message: "Product not found."
            };
        }

        // Make sure enough stock is available
        if (product.quantity < order.quantity) {
            return {
                success: false,
                message: "Insufficient product stock."
            };
        }

        // Reduce stock
        product.quantity -= order.quantity;

        // Mark unavailable when stock reaches zero
        if (product.quantity === 0) {
            product.isAvailable = false;
        }

        await product.save();

        // Mark payment as paid
        order.paymentStatus = "paid";

        order.sslcommerzValidationId =
            val_id;

        await order.save();

        return {
            success: true,
            order,
            alreadyCompleted: false
        };

    } catch (error) {
        console.error(
            "Complete online payment error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to complete online payment."
        };
    }
};

// Initiate SSLCOMMERZ payment
const initiateSSLCommerzPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required."
            });
        }

        const shopkeeper = await shopkeeperModel.findById(
            req.user.id
        );

        if (!shopkeeper) {
            return res.status(404).json({
                success: false,
                message: "Shopkeeper not found."
            });
        }

        const order = await orderModel
            .findOne({
                _id: orderId,
                shopkeeper: shopkeeper._id
            })
            .populate("product", "productName");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        if (order.paymentMethod !== "online") {
            return res.status(400).json({
                success: false,
                message: "This order does not use online payment."
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "This order has already been paid."
            });
        }

        const transactionId =
            `ORDER_${order._id}_${Date.now()}`;

        order.sslcommerzTransactionId =
            transactionId;

        await order.save();

        const paymentResponse = await initiatePayment({
          transactionId,
          amount: order.totalAmount,

          productName: order.product?.productName || "Egg Order",

          customerName: shopkeeper.name,

          customerEmail: shopkeeper.email,

          customerPhone: shopkeeper.phone,

          deliveryAddress: order.deliveryAddress,

          // Temporary testing value
          deliveryPostcode: "1207",

          successUrl: `${process.env.BACKEND_URL}/api/payment/sslcommerz/success`,

          failUrl: `${process.env.BACKEND_URL}/api/payment/sslcommerz/fail`,

          cancelUrl: `${process.env.BACKEND_URL}/api/payment/sslcommerz/cancel`,

          ipnUrl: `${process.env.BACKEND_URL}/api/payment/sslcommerz/ipn`,
        });

        if (
            paymentResponse.status !== "SUCCESS" ||
            !paymentResponse.GatewayPageURL
        ) {
            return res.status(500).json({
                success: false,
                message:
                    paymentResponse.failedreason ||
                    "Failed to initialize SSLCOMMERZ payment."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment session created.",
            paymentUrl:
                paymentResponse.GatewayPageURL
        });

    } catch (error) {
        console.error(
            "SSLCOMMERZ payment initiation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to initiate online payment."
        });
    }
};


// Validate payment with SSLCOMMERZ
const validateSSLCommerzPayment = async (valId) => {
    try {
        const response = await axios.get(
            `${SSLCOMMERZ_BASE_URL}/validator/api/validationserverAPI.php`,
            {
                params: {
                    val_id: valId,
                    store_id:
                        process.env.SSLCOMMERZ_STORE_ID,
                    store_passwd:
                        process.env.SSLCOMMERZ_STORE_PASSWORD,
                    format: "json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "SSLCOMMERZ validation error:",
            error.response?.data ||
            error.message
        );

        return null;
    }
};


// Payment success
const sslCommerzSuccess = async (req, res) => {
    try {
        const {
            val_id,
            tran_id
        } = req.body;

        if (!val_id || !tran_id) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/fail`
            );
        }

        // Validate payment with SSLCOMMERZ
        const validation =
            await validateSSLCommerzPayment(val_id);

        if (!validation) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/fail`
            );
        }

        // Check payment status
        if (
            validation.status !== "VALID" &&
            validation.status !== "VALIDATED"
        ) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/fail`
            );
        }

        // Make sure the transaction ID matches
        if (validation.tran_id !== tran_id) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/fail`
            );
        }

        // Complete payment safely
        const result =
            await completeOnlinePayment(validation);

        if (!result.success) {
            console.error(
                "Payment completion failed:",
                result.message
            );

            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/fail`
            );
        }

        // Payment successful
        return res.redirect(
            `${process.env.FRONTEND_URL}/shopkeeper/order/${result.order._id}`
        );

    } catch (error) {
        console.error(
            "SSLCOMMERZ success error:",
            error
        );

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/fail`
        );
    }
};


// Payment failed
const sslCommerzFail = async (req, res) => {
    try {
        const {
            tran_id
        } = req.body;

        if (tran_id) {
            await orderModel.findOneAndUpdate(
                {
                    sslcommerzTransactionId: tran_id,
                    paymentStatus: "pending"
                },
                {
                    paymentStatus: "failed"
                }
            );
        }

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/fail`
        );

    } catch (error) {
        console.error(
            "SSLCOMMERZ fail error:",
            error
        );

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/fail`
        );
    }
};


// Payment cancelled
const sslCommerzCancel = async (req, res) => {
    try {
        const {
            tran_id
        } = req.body;

        if (tran_id) {
            await orderModel.findOneAndUpdate(
                {
                    sslcommerzTransactionId: tran_id,
                    paymentStatus: "pending"
                },
                {
                    paymentStatus: "failed"
                }
            );
        }

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/cancel`
        );

    } catch (error) {
        console.error(
            "SSLCOMMERZ cancel error:",
            error
        );

        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/cancel`
        );
    }
};


// IPN
const sslCommerzIPN = async (req, res) => {
    try {
        const {
            val_id,
            tran_id
        } = req.body;

        if (!val_id || !tran_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid IPN data."
            });
        }

        // Validate payment with SSLCOMMERZ
        const validation =
            await validateSSLCommerzPayment(val_id);

        if (!validation) {
            return res.status(400).json({
                success: false,
                message: "Payment validation failed."
            });
        }

        // Check payment status
        if (
            validation.status !== "VALID" &&
            validation.status !== "VALIDATED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment."
            });
        }

        // Make sure transaction ID matches
        if (validation.tran_id !== tran_id) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID mismatch."
            });
        }

        // Complete payment safely
        const result =
            await completeOnlinePayment(validation);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: result.alreadyCompleted
                ? "Payment was already completed."
                : "Payment completed successfully."
        });

    } catch (error) {
        console.error(
            "SSLCOMMERZ IPN error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to process IPN."
        });
    }
};


export {
    initiateSSLCommerzPayment,
    sslCommerzSuccess,
    sslCommerzFail,
    sslCommerzCancel,
    sslCommerzIPN,
    completeOnlinePayment
};