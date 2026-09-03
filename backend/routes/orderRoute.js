
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {createOrder,getShopkeeperOrders,getFarmerOrders,getOrderById,updateOrderStatus,getAllOrdersForAdmin,getOrderByIdForAdmin,updatePaymentStatus} from "../controllers/orderController.js";
import farmerAuthMiddleware from "../middlewares/farmerAuthMiddleware.js";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

const orderRouter = express.Router();


// Create order
orderRouter.post(
    "/",
    authMiddleware,
    createOrder
);

// Get shopkeeper orders 
orderRouter.get( "/my-orders", authMiddleware, getShopkeeperOrders );

// Farmer orders
orderRouter.get( "/farmer-orders", farmerAuthMiddleware, getFarmerOrders );

// Get single order 
orderRouter.get( "/:orderId", authMiddleware, getOrderById );

// Admin updates order status 
orderRouter.patch( "/:orderId/status", adminAuthMiddleware, updateOrderStatus );

// Get all orders - Admin only
orderRouter.get(
    "/admin/all",
    adminAuthMiddleware,
    getAllOrdersForAdmin
);

orderRouter.get(
    "/admin/:orderId",
    adminAuthMiddleware,
    getOrderByIdForAdmin
);

orderRouter.patch(
    "/admin/:orderId/payment-status",
    adminAuthMiddleware,
    updatePaymentStatus
);


export default orderRouter;

