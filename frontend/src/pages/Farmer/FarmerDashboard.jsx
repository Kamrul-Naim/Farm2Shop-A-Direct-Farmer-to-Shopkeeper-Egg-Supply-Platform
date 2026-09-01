import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiShoppingBag, FiClock, FiDollarSign } from "react-icons/fi";
import { AppContext } from "../../context/AppContext";

const FarmerDashboard = () => {
    const {
        backendUrl,
        user
    } = useContext(AppContext);

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch farmer products and orders
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [productsResponse, ordersResponse] =
                await Promise.all([
                    axios.get(
                        `${backendUrl}/api/products/my-products`,
                        {
                            withCredentials: true
                        }
                    ),

                    axios.get(
                        `${backendUrl}/api/orders/farmer-orders`,
                        {
                            withCredentials: true
                        }
                    )
                ]);

            if (productsResponse.data.success) {
                setProducts(
                    productsResponse.data.products || []
                );
            }

            if (ordersResponse.data.success) {
                setOrders(
                    ordersResponse.data.orders || []
                );
            }

        } catch (error) {
            console.error(
                "Farmer dashboard data error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Active products
    const activeProducts = products.filter(
        (product) =>
            product.isAvailable &&
            product.quantity > 0
    ).length;

    // Pending orders
    const pendingOrders = orders.filter(
        (order) =>
            !["delivered", "cancelled"].includes(
                order.orderStatus
            )
    ).length;

    // Total earnings from delivered orders
    const totalEarnings = orders
        .filter(
            (order) =>
                order.orderStatus === "delivered" &&
                order.paymentStatus === "paid"
        )
        .reduce(
            (total, order) =>
                total + Number(order.totalAmount || 0),
            0
        );

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Page Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Welcome back, {user?.name || "Farmer"}!
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-gray-500">
                        Here's what's happening with your farm today.
                    </p>
                </div>


                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* Active Products */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Active Products
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800">
                                    {activeProducts}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                                <FiPackage
                                    size={21}
                                    className="text-[#176B3A]"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Total Orders */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800">
                                    {orders.length}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FiShoppingBag
                                    size={21}
                                    className="text-blue-600"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Pending Orders */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Pending Orders
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800">
                                    {pendingOrders}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                                <FiClock
                                    size={21}
                                    className="text-orange-500"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Earnings */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Earnings
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800">
                                    ৳{totalEarnings.toLocaleString()}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <FiDollarSign
                                    size={21}
                                    className="text-yellow-600"
                                />
                            </div>

                        </div>
                    </div>

                </div>


                {/* Recent Orders */}
                <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Recent Orders
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Latest orders received for your products.
                                </p>
                            </div>

                        </div>
                    </div>


                    {recentOrders.length === 0 ? (

                        <div className="py-12 text-center">
                            <FiShoppingBag
                                size={32}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm font-medium text-gray-700">
                                No orders yet
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Orders for your products will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>
                                    <tr className="bg-gray-50 text-left">

                                        <th className="px-5 py-3 font-semibold text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-5 py-3 font-semibold text-gray-600">
                                            Shopkeeper
                                        </th>

                                        <th className="px-5 py-3 font-semibold text-gray-600">
                                            Quantity
                                        </th>

                                        <th className="px-5 py-3 font-semibold text-gray-600">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3 font-semibold text-gray-600">
                                            Status
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {recentOrders.map(
                                        (order) => (

                                            <tr
                                                key={order._id}
                                                className="border-t border-gray-100"
                                            >

                                                <td className="px-5 py-4 font-medium text-gray-800">
                                                    {order.product?.productName ||
                                                        "Product"}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {order.shopkeeper?.shopName ||
                                                        order.shopkeeper?.name ||
                                                        "Shopkeeper"}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {order.quantity}
                                                </td>

                                                <td className="px-5 py-4 font-medium text-gray-800">
                                                    ৳
                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                                            order.orderStatus ===
                                                            "delivered"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.orderStatus ===
                                                                  "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-orange-100 text-orange-700"
                                                        }`}
                                                    >
                                                        {order.orderStatus.replaceAll(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default FarmerDashboard;