import express from "express";

import {
    removeProductByAdmin,
    getAllProductsForAdmin,
    getProductByIdForAdmin
} from "../controllers/productController.js";

import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

const adminProductRouter = express.Router();


// Admin removes any product
adminProductRouter.patch(
    "/:productId/remove",
    adminAuthMiddleware,
    removeProductByAdmin
);

// Admin gets all products
adminProductRouter.get(
    "/",
    adminAuthMiddleware,
    getAllProductsForAdmin
);

// Admin gets single product
adminProductRouter.get(
    "/:productId",
    adminAuthMiddleware,
    getProductByIdForAdmin
);


export default adminProductRouter;