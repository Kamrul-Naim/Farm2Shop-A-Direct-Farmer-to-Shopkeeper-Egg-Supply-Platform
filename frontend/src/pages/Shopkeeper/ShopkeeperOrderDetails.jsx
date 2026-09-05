import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const ShopkeeperOrderDetails = () => {
    const { orderId } = useParams();
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${backendUrl}/api/orders/${orderId}`,
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setOrder(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch order details error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load order details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePayOnline = async () => {
    try {
        setPaying(true);

        const { data } = await axios.post(
            `${backendUrl}/api/payment/online`,
            {
                orderId: order._id,
            },
            {
                withCredentials: true,
            }
        );

        if (data.success && data.url) {
            window.location.href = data.url;
        } else {
            toast.error(data.message || "Failed to initiate payment.");
        }
    } catch (error) {
        console.error("Online payment error:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to initiate online payment."
        );
    } finally {
        setPaying(false);
    }
};

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-gray-500">
                    Loading order details...
                </p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Order not found
                    </h2>

                    <button
                        onClick={() => navigate("/shopkeeper/orders")}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-[#176B3A] text-white font-semibold"
                    >
                        My Orders
                    </button>
                </div>
            </div>
        );
    }

    const statusLabels = {
        placed: "Order Placed",
        confirmed: "Confirmed",
        processing: "Processing",
        ready_for_delivery: "Ready for Delivery",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
    };

    const paymentLabels = {
        cod: "Cash on Delivery",
        online: "Online Payment",
    };

    return (
        <div className="min-h-screen bg-[#f5f7f4] py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-sm font-semibold text-[#176B3A] hover:underline"
                >
                    ← Back
                </button>

                {/* Header */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500">
                        Order ID
                    </p>

                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 break-all">
                        #{order._id}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Status */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order Status
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-gray-800">
                                        {statusLabels[order.orderStatus] ||
                                            order.orderStatus}
                                    </h2>
                                </div>

                                <span
                                    className={`px-4 py-2 rounded-full text-xs font-semibold ${
                                        order.orderStatus === "cancelled"
                                            ? "bg-red-50 text-red-600"
                                            : order.orderStatus === "delivered"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-yellow-50 text-yellow-700"
                                    }`}
                                >
                                    {statusLabels[order.orderStatus] ||
                                        order.orderStatus}
                                </span>
                            </div>
                        </div>

                        {/* Product */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">

                            <h2 className="text-lg font-bold text-gray-800">
                                Product
                            </h2>

                            <div className="mt-5 flex flex-col sm:flex-row gap-5">

                                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {order.product?.images?.[0] ? (
                                        <img
                                            src={order.product.images[0]}
                                            alt={order.product.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {order.product?.productName}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Category:{" "}
                                        <span className="font-medium text-gray-700">
                                            {order.category?.category}
                                        </span>
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Quantity:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {order.quantity} pieces
                                        </span>
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Price per piece:{" "}
                                        <span className="font-semibold text-[#176B3A]">
                                            ৳{order.unitPrice}
                                        </span>
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Farmer */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">

                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Sold By
                            </p>

                            <div className="mt-4 flex items-center gap-4">

                                <div className="w-12 h-12 rounded-full bg-[#EAF5EE] flex items-center justify-center overflow-hidden">
                                    {order.farmer?.profileImage ? (
                                        <img
                                            src={order.farmer.profileImage}
                                            alt={order.farmer.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>🌱</span>
                                    )}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {order.farmer?.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.farmer?.farmName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.farmer?.farmAddress}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit lg:sticky lg:top-24">

                        <h2 className="text-lg font-bold text-gray-800">
                            Order Summary
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Quantity
                                </span>

                                <span className="font-medium text-gray-800">
                                    {order.quantity} pcs
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Price / piece
                                </span>

                                <span className="font-medium text-gray-800">
                                    ৳{order.unitPrice}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-between">
                                <span className="font-semibold text-gray-800">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-[#176B3A]">
                                    ৳{order.totalAmount}
                                </span>
                            </div>

                        </div>

                        {/* Payment */}
<div className="mt-6 pt-5 border-t border-gray-100">

    <p className="text-xs text-gray-500">
        Payment Method
    </p>

    <p className="mt-1 font-semibold text-gray-800">
        {paymentLabels[order.paymentMethod] ||
            order.paymentMethod}
    </p>

    <p className="mt-3 text-xs text-gray-500">
        Payment Status
    </p>

    <p className="mt-1 font-semibold capitalize text-gray-800">
        {order.paymentStatus}
    </p>

    {/* Online Payment Button */}
    {order.paymentStatus.toLowerCase() === "paid" ? (
        <button
            disabled
            className="mt-5 w-full py-3 rounded-xl bg-green-100 text-green-700 font-semibold cursor-not-allowed"
        >
            Paid
        </button>
    ) : (
        <button
        onClick={handlePayOnline}
        disabled={paying}
        className="mt-5 w-full py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12552E] transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
        {paying ? "Redirecting to Payment..." : "Pay Online"}
    </button>
    )}

</div>

                        {/* Delivery Address */}
                        <div className="mt-6 pt-5 border-t border-gray-100">

                            <p className="text-xs text-gray-500">
                                Delivery Address
                            </p>

                            <p className="mt-1 text-sm text-gray-700 leading-6">
                                {order.deliveryAddress}
                            </p>

                        </div>

                        {/* Date */}
                        <div className="mt-6 pt-5 border-t border-gray-100">

                            <p className="text-xs text-gray-500">
                                Order Date
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                                {new Date(
                                    order.createdAt
                                ).toLocaleString()}
                            </p>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopkeeperOrderDetails;
