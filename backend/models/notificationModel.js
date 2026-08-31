import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        // User who should receive the notification
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        // Recipient's role
        recipientRole: {
            type: String,
            enum: ["farmer", "shopkeeper", "admin"],
            required: true
        },

        // Notification title
        title: {
            type: String,
            required: true,
            trim: true
        },

        // Notification message
        message: {
            type: String,
            required: true,
            trim: true
        },

        // Optional related order
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },

        // Whether the notification has been read
        isRead: {
            type: Boolean,
            default: false
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