import express from "express";

import {
    loginAdmin,
    getCurrentAdmin,
    logoutAdmin,
    getDashboardStats,
    getAdminEarnings
} from "../controllers/adminController.js";

import { createCategoryPrice,getAllCategories,updateCategoryPrice,toggleCategoryStatus,updateCategory,deleteCategory } from "../controllers/categoryPriceController.js";

import {
    getAllShopkeepersForAdmin,getShopkeeperDetailsForAdmin
} from "../controllers/adminShopkeeperController.js";

import {
    getAllFarmersForAdmin,getFarmerDetails
} from "../controllers/adminFarmerController.js";

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

// Update category name + price
adminRouter.patch(
    "/categories/:categoryId",
    adminAuthMiddleware,
    updateCategory
);

// Delete category
adminRouter.delete(
    "/categories/:categoryId",
    adminAuthMiddleware,
    deleteCategory
);

// Get all shopkeepers
adminRouter.get(
    "/shopkeepers",
    adminAuthMiddleware,
    getAllShopkeepersForAdmin
);

// Get shopkeeper details
adminRouter.get(
    "/shopkeepers/:shopkeeperId",
    adminAuthMiddleware,
    getShopkeeperDetailsForAdmin
);


// Get all farmers
adminRouter.get(
    "/farmers",
    adminAuthMiddleware,
    getAllFarmersForAdmin
);

// Get farmer details
adminRouter.get(
    "/farmers/:farmerId",
    adminAuthMiddleware,
    getFarmerDetails
);


// Admin/platform earnings
adminRouter.get(
    "/earnings",
    adminAuthMiddleware,
    getAdminEarnings
);

export default adminRouter;