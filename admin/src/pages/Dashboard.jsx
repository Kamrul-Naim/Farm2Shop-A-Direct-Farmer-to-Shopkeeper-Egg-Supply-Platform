import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiUser,
    FiDollarSign
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
    const { backendUrl } = useContext(AppContext);

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalEggsSold: 0,
        totalShopkeepers: 0,
        totalFarmers: 0,
        platformEarnings: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDashboardData = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/dashboard`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setStats(response.data.stats);
                setRecentOrders(response.data.recentOrders || []);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const statCards = [
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: FiShoppingBag,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Total Eggs Sold",
            value: stats.totalEggsSold,
            icon: FiPackage,
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600"
        },
        {
            title: "Shopkeepers",
            value: stats.totalShopkeepers,
            icon: FiUsers,
            iconBg: "bg-green-50",
            iconColor: "text-[#176B3A]"
        },
        {
            title: "Farmers",
            value: stats.totalFarmers,
            icon: FiUser,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "placed":
                return "bg-blue-50 text-blue-600";

            case "confirmed":
                return "bg-indigo-50 text-indigo-600";

            case "processing":
                return "bg-yellow-50 text-yellow-600";

            case "ready_for_delivery":
                return "bg-orange-50 text-orange-600";

            case "out_for_delivery":
                return "bg-purple-50 text-purple-600";

            case "delivered":
                return "bg-green-50 text-green-600";

            case "cancelled":
                return "bg-red-50 text-red-600";

            default:
                return "bg-gray-50 text-gray-600";
        }
    };

    const formatStatus = (status) => {
        return status
            ?.replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-sm text-gray-500">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of your Farm2Shop platform
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {card.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                                        {card.value.toLocaleString()}
                                    </h2>
                                </div>

                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}
                                >
                                    <Icon
                                        size={22}
                                        className={card.iconColor}
                                    />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Platform Earnings */}
            <div className="bg-[#176B3A] rounded-xl p-6 text-white shadow-sm">
                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm text-white/80">
                            Platform Earnings
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ৳{stats.platformEarnings.toLocaleString()}
                        </h2>

                        <p className="text-sm text-white/70 mt-2">
                            Based on ৳1 platform fee per egg sold
                        </p>
                    </div>

                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                        <FiDollarSign size={28} />
                    </div>

                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent Orders
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Latest orders placed on Farm2Shop
                    </p>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No orders found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Order
                                    </th>

                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Shopkeeper
                                    </th>

                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Farmer
                                    </th>

                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Eggs
                                    </th>

                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Status
                                    </th>

                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-gray-800">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-700">
                                                {order.shopkeeper?.shopName ||
                                                    order.shopkeeper?.name ||
                                                    "N/A"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-700">
                                                {order.farmer?.farmName ||
                                                    order.farmer?.name ||
                                                    "N/A"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-gray-800">
                                                {order.quantity}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {formatStatus(
                                                    order.orderStatus
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </div>
    );
};

export default Dashboard;
