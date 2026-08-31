import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../controllers/notificationController.js";


const notificationRouter = express.Router();


// Get logged-in user's notifications
notificationRouter.get(
    "/",
    authMiddleware,
    getNotifications
);


// Mark one notification as read
notificationRouter.patch(
    "/:notificationId/read",
    authMiddleware,
    markNotificationAsRead
);


// Mark all notifications as read
notificationRouter.patch(
    "/read-all",
    authMiddleware,
    markAllNotificationsAsRead
);


export default notificationRouter;