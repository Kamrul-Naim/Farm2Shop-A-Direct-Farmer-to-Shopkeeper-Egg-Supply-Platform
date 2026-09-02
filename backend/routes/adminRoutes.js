import express from "express";

import {
    loginAdmin,
    getCurrentAdmin,
    logoutAdmin,
    getDashboardStats
} from "../controllers/adminController.js";

import { createCategoryPrice,getAllCategories,updateCategoryPrice,toggleCategoryStatus } from "../controllers/categoryPriceController.js";

import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

const adminRouter = express.Router();


// Admin login
adminRouter.post("/login", loginAdmin);


// Get current admin
adminRouter.get(
    "/me",
    adminAuthMiddleware,
    getCurrentAdmin
);

// Admin dashboard statistics
adminRouter.get(
    "/dashboard",
    adminAuthMiddleware,
    getDashboardStats
);

// Admin logout
adminRouter.post(
    "/logout",
    adminAuthMiddleware,
    logoutAdmin
);

// Create category + initial price
adminRouter.post(
    "/categories",
    adminAuthMiddleware,
    createCategoryPrice
);

// Get all categories
adminRouter.get(
    "/categories",
    adminAuthMiddleware,
    getAllCategories
);

//Update Category Price
adminRouter.patch(
    "/categories/:categoryId/price",
    adminAuthMiddleware,
    updateCategoryPrice
);

// Toggle category status
adminRouter.patch(
    "/categories/:categoryId/status",
    adminAuthMiddleware,
    toggleCategoryStatus
);


export default adminRouter;