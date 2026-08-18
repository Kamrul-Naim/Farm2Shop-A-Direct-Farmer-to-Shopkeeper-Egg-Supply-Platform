import mongoose from "mongoose";

const shopkeeperSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        nid: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        profileImage: {
            type: String,
            default: ""
        },

        shopName: {
            type: String,
            required: true,
            trim: true
        },

        shopAddress: {
            type: String,
            required: true,
            trim: true
        },

        shopDescription: {
            type: String,
            default: "",
            trim: true
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const shopkeeperModel =
    mongoose.models.Shopkeeper ||
    mongoose.model("Shopkeeper", shopkeeperSchema);

export default shopkeeperModel;