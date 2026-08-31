import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Orders = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${backendUrl}/api/orders/farmer-orders`,
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(
                    data.message || "Failed to fetch orders."
                );
            }
        } catch (error) {
            console.error("Fetch farmer orders error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const statusLabels = {
        placed: "Order Placed",
        confirmed: "Confirmed",
        processing: "Processing",
        ready_for_delivery: "Ready for Delivery",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
    };

    const getStatusClass = (status) => {
        if (status === "delivered") {
            return "bg-green-50 text-green-700";
        }

        if (status === "cancelled") {
            return "bg-red-50 text-red-600";
        }

        if (status === "out_for_delivery") {
            return "bg-blue-50 text-blue-600";
        }

        return "bg-yellow-50 text-yellow-700";
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-gray-500">
                    Loading orders...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7FAF8] py-8 px-4 sm:px-6 lg:px-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Orders
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage orders received from shopkeepers.
                    </p>
                </div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 py-16 px-6 text-center">

                        <FiPackage
                            size={42}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-4 text-lg font-bold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Orders from shopkeepers will appear here.
                        </p>

                    </div>
                ) : (
                    <div className="space-y-4">

                        {orders.map((order) => (
                            <button
                                key={order._id}
                                onClick={() =>
                                    navigate(
                                        `/farmer/order/${order._id}`
                                    )
                                }
                                className="w-full text-left bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:border-[#176B3A]/40 hover:shadow-sm transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                                    {/* Product Image */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        {order.product?.images?.[0] ? (
                                            <img
                                                src={order.product.images[0]}
                                                alt={order.product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FiPackage size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Information */}
                                    <div className="flex-1 min-w-0">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                            <h2 className="font-bold text-gray-800 truncate">
                                                {order.product?.productName ||
                                                    "Product"}
                                            </h2>

                                            <span
                                                className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {statusLabels[
                                                    order.orderStatus
                                                ] ||
                                                    order.orderStatus}
                                            </span>

                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">

                                            <span>
                                                Shopkeeper:{" "}
                                                <span className="text-gray-700 font-medium">
                                                    {order.shopkeeper?.name ||
                                                        "-"}
                                                </span>
                                            </span>

                                            <span>
                                                Category:{" "}
                                                <span className="text-gray-700 font-medium">
                                                    {order.category?.category ||
                                                        "-"}
                                                </span>
                                            </span>

                                            <span>
                                                Quantity:{" "}
                                                <span className="text-gray-700 font-medium">
                                                    {order.quantity} pcs
                                                </span>
                                            </span>

                                        </div>

                                        <div className="mt-2 text-xs text-gray-400">
                                            Ordered on{" "}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </div>

                                    </div>

                                    {/* Amount */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Total
                                            </p>

                                            <p className="text-lg font-bold text-[#176B3A]">
                                                ৳{order.totalAmount}
                                            </p>
                                        </div>

                                        <FiChevronRight
                                            size={20}
                                            className="text-gray-400"
                                        />

                                    </div>

                                </div>
                            </button>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Orders;