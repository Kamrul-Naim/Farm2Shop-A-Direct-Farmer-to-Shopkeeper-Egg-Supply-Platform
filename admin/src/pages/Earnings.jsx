import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FiDollarSign,
    FiShoppingBag,
    FiRefreshCw,
    FiTrendingUp
} from "react-icons/fi";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Earnings = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        totalEggsSold: 0,
        platformEarnings: 0,
        completedOrders: 0
    });

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEarnings = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/admin/earnings`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setSummary(
                    response.data.summary || {
                        totalEggsSold: 0,
                        platformEarnings: 0,
                        completedOrders: 0
                    }
                );

                setOrders(response.data.orders || []);
            }
        } catch (error) {
            console.error(
                "Failed to fetch admin earnings:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-sm text-gray-500">
                Loading earnings...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <FiDollarSign size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Earnings
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Monitor Farm2Shop platform earnings
                        </p>
                    </div>

                </div>

                <button
                    onClick={fetchEarnings}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                >
                    <FiRefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />

                    Refresh
                </button>

            </div>


            {/* Main Earnings Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                    <div>

                        <p className="text-sm text-green-100">
                            Total Platform Earnings
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold mt-2">
                            ৳{summary.platformEarnings || 0}
                        </h2>

                        <p className="text-sm text-green-100 mt-3">
                            Based on {summary.totalEggsSold || 0} qualifying
                            eggs sold
                        </p>

                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                        <FiTrendingUp size={32} />
                    </div>

                </div>

            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Eggs Sold */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Eggs Sold
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                {summary.totalEggsSold || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <img src={assets.egg} alt="Egg" className="w-full h-full object-contain" />
                        </div>

                    </div>

                </div>


                {/* Completed Orders */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Completed Orders
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                {summary.completedOrders || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FiShoppingBag size={20} />
                        </div>

                    </div>

                </div>


                {/* Rate */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Platform Rate
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                ৳1
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Per egg sold
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FiDollarSign size={20} />
                        </div>

                    </div>

                </div>

            </div>


            {/* Earnings Policy */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

                <div className="flex items-start gap-4">

                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <FiDollarSign size={20} />
                    </div>

                    <div>

                        <h2 className="font-semibold text-gray-800">
                            Platform Earnings Policy
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Farm2Shop earns ৳1 for every egg sold through
                            a completed order.
                        </p>

                        <div className="mt-4 bg-gray-50 rounded-xl p-4">

                            <p className="text-sm text-gray-600">
                                Earnings Formula
                            </p>

                            <p className="text-lg font-semibold text-gray-800 mt-1">
                                Total Eggs Sold × ৳1
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Only orders with{" "}
                                <span className="font-medium text-gray-700">
                                    Delivered
                                </span>{" "}
                                order status and{" "}
                                <span className="font-medium text-gray-700">
                                    Paid
                                </span>{" "}
                                payment status are included.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Qualifying Orders */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-5 py-4 border-b border-gray-100">

                    <h2 className="font-semibold text-gray-800">
                        Earnings Orders
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                        Delivered and paid orders contributing to platform
                        earnings
                    </p>

                </div>


                {orders.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500">
                        No qualifying orders found.
                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden lg:block overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-gray-50 border-b border-gray-100">

                                    <tr>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Order ID
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Product
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Farmer
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Shopkeeper
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Eggs
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Platform Earning
                                        </th>

                                        <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="hover:bg-gray-50 transition cursor-pointer"
                                        >

                                            <td className="px-5 py-4">
                                                <span
                                                    className="text-xs text-gray-500 font-mono"
                                                    title={order._id}
                                                >
                                                    {order._id}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {order.product?.productName || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-700">
                                                {order.farmer?.name || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-700">
                                                {order.shopkeeper?.name || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-700">
                                                {order.quantity}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-green-600">
                                                ৳{order.quantity * 1}
                                            </td>

                                            <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>


                        {/* Mobile / Tablet */}
                        <div className="lg:hidden divide-y divide-gray-100">

                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="p-4 sm:p-5 hover:bg-gray-50 transition cursor-pointer"
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">

                                            <p className="text-xs text-gray-400">
                                                Order ID
                                            </p>

                                            <p
                                                className="text-xs text-gray-600 font-mono truncate mt-1"
                                                title={order._id}
                                            >
                                                {order._id}
                                            </p>

                                        </div>

                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDate(order.createdAt)}
                                        </span>

                                    </div>


                                    <div className="mt-4">

                                        <p className="font-medium text-gray-800">
                                            {order.product?.productName || "—"}
                                        </p>

                                        {order.category?.category && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {order.category.category}
                                            </p>
                                        )}

                                    </div>


                                    <div className="grid grid-cols-2 gap-4 mt-4">

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Farmer
                                            </p>

                                            <p className="text-sm text-gray-700 mt-1 truncate">
                                                {order.farmer?.name || "—"}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Shopkeeper
                                            </p>

                                            <p className="text-sm text-gray-700 mt-1 truncate">
                                                {order.shopkeeper?.name || "—"}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Eggs Sold
                                            </p>

                                            <p className="text-sm font-medium text-gray-700 mt-1">
                                                {order.quantity}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-xs text-gray-400">
                                                Platform Earning
                                            </p>

                                            <p className="text-sm font-semibold text-green-600 mt-1">
                                                ৳{order.quantity * 1}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>

        </div>
    );
};

export default Earnings;

