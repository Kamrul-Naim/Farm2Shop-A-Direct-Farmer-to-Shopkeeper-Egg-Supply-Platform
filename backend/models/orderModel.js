
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // Shopkeeper who placed the order
        shopkeeper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shopkeeper",
            required: true
        },

        // Farmer who owns the product
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true
        },

        // Product being ordered
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Egg category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryPrice",
            required: true
        },

        // Number of eggs ordered
        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // Category price at the time of order
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        // quantity × unitPrice
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        // Delivery address saved with the order
        deliveryAddress: {
            type: String,
            required: true,
            trim: true
        },

        // Order delivery status
        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "processing",
                "ready_for_delivery",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "placed"
        },

        // Payment method
        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            required: true
        },

        // Payment status
        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        // SSLCommerz information
        sslcommerzTransactionId: {
            type: String,
            default: ""
        },

        sslcommerzValidationId: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const orderModel =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default orderModel;

