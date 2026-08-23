import mongoose from "mongoose";

const categoryPriceSchema = new mongoose.Schema(
    {
        // Product category name
        category: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        // Current price per piece
        // Controlled only by Admin
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Allows Admin to temporarily disable a category
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const categoryPriceModel =
    mongoose.models.CategoryPrice ||
    mongoose.model("CategoryPrice", categoryPriceSchema);

export default categoryPriceModel;