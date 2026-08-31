import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";


const NotificationBell = () => {
    const { backendUrl } = useContext(AppContext);

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);


    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${backendUrl}/api/notifications`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setNotifications(data.notifications);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(
                "Fetch notifications error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);


    // Count unread notifications
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;


    // Mark notification as read
    const handleNotificationClick = async (notification) => {
        if (notification.isRead) return;

        try {
            const { data } = await axios.patch(
                `${backendUrl}/api/notifications/${notification._id}/read`,
                {},
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
                );
            }

        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );
        }
    };


    // Mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            const { data } = await axios.patch(
                `${backendUrl}/api/notifications/read-all`,
                {},
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        isRead: true
                    }))
                );
            }

        } catch (error) {
            console.error(
                "Mark all notifications as read error:",
                error
            );
        }
    };


    return (
        <div className="relative">

            {/* Notification Button */}
            <button
                onClick={() =>
                    setShowNotifications((prev) => !prev)
                }
                className="relative w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                aria-label="Notifications"
            >
                <span className="text-xl">
                    🔔
                </span>

                {/* Unread Count */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>


            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

                        <div>
                            <h3 className="font-bold text-gray-800">
                                Notifications
                            </h3>

                            {unreadCount > 0 && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {unreadCount} unread
                                </p>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-[#176B3A] hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}

                    </div>


                    {/* Notifications */}
                    <div className="max-h-[420px] overflow-y-auto">

                        {loading ? (
                            <div className="p-6 text-center text-sm text-gray-500">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">

                                <div className="text-3xl mb-2">
                                    🔔
                                </div>

                                <p className="text-sm font-medium text-gray-700">
                                    No notifications
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    You're all caught up.
                                </p>

                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification._id}
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                                        !notification.isRead
                                            ? "bg-green-50/50"
                                            : "bg-white"
                                    }`}
                                >
                                    <div className="flex gap-3">

                                        {/* Status Dot */}
                                        <div className="pt-1.5">
                                            <span
                                                className={`block w-2 h-2 rounded-full ${
                                                    notification.isRead
                                                        ? "bg-gray-300"
                                                        : "bg-[#176B3A]"
                                                }`}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <p className="text-sm font-semibold text-gray-800">
                                                {notification.title}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {notification.message}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>
                                </button>
                            ))
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};


export default NotificationBell;