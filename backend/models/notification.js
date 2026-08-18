import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientType: {
            type: String,
            enum: ["farmer", "shopkeeper"],
            required: true
        },

        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        type: {
            type: String,
            enum: [
                "new_order",
                "order_accepted",
                "order_rejected",
                "order_cancelled",
                "order_dispatched",
                "order_delivered",
                "account_approved",
                "account_rejected",
                "price_updated",
                "general"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        },

        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const notificationModel =
    mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);

export default notificationModel;