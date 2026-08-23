import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // Product name
        productName: {
            type: String,
            required: true,
            trim: true
        },

        // Product category
        // The category also determines the current price.
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryPrice",
            required: true
        },

        // Product description
        description: {
            type: String,
            required: true,
            trim: true
        },

        // Product images
        // Minimum: 1
        // Maximum: 3
        images: {
            type: [String],
            required: true,
            validate: {
                validator: function (images) {
                    return images.length >= 1 && images.length <= 3;
                },
                message: "A product must have between 1 and 3 images."
            }
        },

        // Current available quantity
        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        // Minimum quantity a shopkeeper can order
        minimumOrderQuantity: {
            type: Number,
            required: true,
            min: 1
        },

        // Farmer who owns this product
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true
        },

        // Product availability
        isAvailable: {
            type: Boolean,
            default: true
        },

        // Product automatically expires after 7 days
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const productModel =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);

export default productModel;