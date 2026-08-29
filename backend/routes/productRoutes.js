import express from "express";

import {
    createProduct,
    getProducts,
    getMyProducts,
    getProductById,
    updateProduct,
    removeProduct
} from "../controllers/productController.js";

import farmerAuthMiddleware from "../middlewares/farmerAuthMiddleware.js";
import verifiedFarmerMiddleware from "../middlewares/verifiedFarmerMiddleware.js";

import productUpload from "../middlewares/productUpload.js";

const productRouter = express.Router();


// Create product
productRouter.post(
    "/",
    farmerAuthMiddleware,
    verifiedFarmerMiddleware,
    productUpload.array("images", 3),
    createProduct
);

// Get available products
productRouter.get(
    "/",
    getProducts
);

// Logged-in farmer's products
productRouter.get(
    "/my-products",
    farmerAuthMiddleware,
    getMyProducts
);

// Get single product
productRouter.get(
    "/:productId",
    getProductById
);

// Update product
productRouter.put(
    "/:productId",
    farmerAuthMiddleware,
    productUpload.array("images", 3),
    updateProduct
);

// Remove product
productRouter.patch(
    "/:productId/remove",
    farmerAuthMiddleware,
    removeProduct
);

export default productRouter;