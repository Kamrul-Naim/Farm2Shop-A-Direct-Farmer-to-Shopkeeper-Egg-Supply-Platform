import notificationModel from "../models/notificationModel.js";


// Get notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel
            .find({
                recipient: req.user.id,
                recipientRole: req.user.role
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications."
        });
    }
};


// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await notificationModel.findOne({
            _id: notificationId,
            recipient: req.user.id,
            recipientRole: req.user.role
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            notification
        });

    } catch (error) {
        console.error(
            "Mark notification as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update notification."
        });
    }
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await notificationModel.updateMany(
            {
                recipient: req.user.id,
                recipientRole: req.user.role,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read."
        });

    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications."
        });
    }
};


export {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};