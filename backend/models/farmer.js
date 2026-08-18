import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
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

        farmName: {
            type: String,
            required: true,
            trim: true
        },

        farmAddress: {
            type: String,
            required: true,
            trim: true
        },

        farmDescription: {
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

const farmerModel =
    mongoose.models.Farmer ||
    mongoose.model("Farmer", farmerSchema);

export default farmerModel;