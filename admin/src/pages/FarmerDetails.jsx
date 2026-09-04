import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiUser,
    FiHome,
    FiPhone,
    FiMail,
    FiCreditCard,
    FiPackage,
    FiShoppingBag,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const FarmerDetails = () => {
    const { backendUrl } = useContext(AppContext);
    const { farmerId } = useParams();
    const navigate = useNavigate();

    const [farmer, setFarmer] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchFarmerDetails = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/admin/farmers/${farmerId}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setFarmer(response.data.farmer);
                setProducts(response.data.products || []);
                setOrders(response.data.orders || []);
                setSummary(response.data.summary || {});
            }
        } catch (error) {
            console.error("Failed to fetch farmer details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmerDetails();
    }, [farmerId]);



    const updateVerificationStatus = async (verificationStatus) => {
    if (verificationStatus === farmer?.verificationStatus) {
        return;
    }

    try {
        setUpdatingStatus(true);

        const response = await axios.patch(
            `${backendUrl}/api/admin/verification/farmer/${farmerId}`,
            { verificationStatus },
            {
                withCredentials: true
            }
        );

        if (response.data.success) {
            setFarmer((prev) => ({
                ...prev,
                verificationStatus:
                    response.data.farmer.verificationStatus
            }));

            toast.success(
                response.data.message ||
                "Verification status updated successfully."
            );
        } else {
            toast.error(
                response.data.message ||
                "Failed to update verification status."
            );
        }
    } catch (error) {
        console.error(
            "Failed to update farmer verification status:",
            error
        );

        toast.error(
            error.response?.data?.message ||
            "Failed to update verification status."
        );
    } finally {
        setUpdatingStatus(false);
    }
};


    const getStatusClass = (status) => {
        if (status === "approved" || status === "delivered" || status === "paid") {
            return "bg-green-50 text-green-700 border-green-200";
        }

        if (status === "rejected" || status === "cancelled") {
            return "bg-red-50 text-red-700 border-red-200";
        }

        return "bg-amber-50 text-amber-700 border-amber-200";
    };

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
                Loading farmer details...
            </div>
        );
    }

    if (!farmer) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-500">
                    Farmer not found.
                </p>

                <button
                    onClick={() => navigate("/farmers")}
                    className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                >
                    Back to Farmers
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/farmers")}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Farmer Details
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            View farmer profile, products and sales
                        </p>
                    </div>

                </div>

                <span
                    className={`inline-flex w-fit px-3 py-1.5 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                        farmer.verificationStatus
                    )}`}
                >
                    {farmer.verificationStatus}
                </span>

            </div>

            {/* Profile + Farm */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

                    <div className="flex flex-col sm:flex-row gap-5">

                        {farmer.profileImage ? (
                            <img
                                src={farmer.profileImage}
                                alt={farmer.name}
                                className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                <FiUser size={40} />
                            </div>
                        )}

                        <div className="flex-1">

                            <h2 className="text-xl font-semibold text-gray-800">
                                {farmer.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Joined {formatDate(farmer.createdAt)}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                        <FiMail size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Email
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {farmer.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                        <FiPhone size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Phone
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {farmer.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                        <FiCreditCard size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            NID
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {farmer.nid}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <FiHome size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Farm
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {farmer.farmName}
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Farm Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <FiHome size={20} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400">
                                Farm Name
                            </p>

                            <h3 className="font-semibold text-gray-800">
                                {farmer.farmName}
                            </h3>
                        </div>

                    </div>

                    <p className="text-sm text-gray-600 leading-6">
                        {farmer.farmDescription || "No farm description available."}
                    </p>

                    <div className="mt-5 pt-4 border-t border-gray-100">

                        <p className="text-xs text-gray-400 mb-1">
                            Farm Address
                        </p>

                        <p className="text-sm text-gray-700">
                            {farmer.farmAddress}
                        </p>

                    </div>

                </div>

            </div>

                        {/* Verification Management */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <FiCheckCircle size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Verification Management
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update this farmer's verification status
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            Current:
                        </span>

                        <span
                            className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                                farmer.verificationStatus
                            )}`}
                        >
                            {farmer.verificationStatus}
                        </span>
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                    {/* Pending */}
                    <button
                        type="button"
                        onClick={() =>
                            updateVerificationStatus("pending")
                        }
                        disabled={updatingStatus}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                            farmer.verificationStatus === "pending"
                                ? "bg-amber-50 border-amber-300 ring-2 ring-amber-100"
                                : "bg-white border-gray-200 hover:bg-amber-50 hover:border-amber-200"
                        } ${
                            updatingStatus
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <FiClock size={20} />
                        </div>

                        <div>
                            <p className="font-medium text-gray-800">
                                Pending
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Verification is pending
                            </p>
                        </div>
                    </button>

                    {/* Approved */}
                    <button
                        type="button"
                        onClick={() =>
                            updateVerificationStatus("approved")
                        }
                        disabled={updatingStatus}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                            farmer.verificationStatus === "approved"
                                ? "bg-green-50 border-green-300 ring-2 ring-green-100"
                                : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-200"
                        } ${
                            updatingStatus
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <FiCheckCircle size={20} />
                        </div>

                        <div>
                            <p className="font-medium text-gray-800">
                                Approve
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Approve this farmer
                            </p>
                        </div>
                    </button>

                    {/* Rejected */}
                    <button
                        type="button"
                        onClick={() =>
                            updateVerificationStatus("rejected")
                        }
                        disabled={updatingStatus}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                            farmer.verificationStatus === "rejected"
                                ? "bg-red-50 border-red-300 ring-2 ring-red-100"
                                : "bg-white border-gray-200 hover:bg-red-50 hover:border-red-200"
                        } ${
                            updatingStatus
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            <FiXCircle size={20} />
                        </div>

                        <div>
                            <p className="font-medium text-gray-800">
                                Reject
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Reject this farmer
                            </p>
                        </div>
                    </button>

                </div>

                {updatingStatus && (
                    <p className="text-xs text-gray-500 mt-4">
                        Updating verification status...
                    </p>
                )}

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Products
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                {summary.totalProducts || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <FiPackage size={20} />
                        </div>

                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Orders
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                {summary.totalOrders || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center">
                            <FiShoppingBag size={20} />
                        </div>

                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Eggs Sold
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                {summary.totalEggsSold || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <FiCheckCircle size={20} />
                        </div>

                    </div>
                </div>

                {/* <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Platform Earnings
                            </p>

                            <p className="text-2xl font-semibold text-gray-800 mt-2">
                                ৳{summary.platformEarnings || 0}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FiDollarSign size={20} />
                        </div>

                    </div>
                </div> */}

            </div>

            {/* Products
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">
                        Farmer Products
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500">
                        No products found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-gray-50 border-b border-gray-100">

                                <tr>
                                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                        Product
                                    </th>

                                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                        Category
                                    </th>

                                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                        Price
                                    </th>

                                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                        Status
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {products.map((product) => (
                                    <tr key={product._id}>

                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            {product.productName}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {product.category?.category || "—"}
                                        </td>

                                        <td className="px-5 py-4 text-gray-700">
                                            ৳{product.price || 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
                                                Active
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div> */}

{/* Orders */}
<div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

    <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">
            Farmer Orders
        </h2>
        <p className="text-xs text-gray-500 mt-1">
            Orders associated with this farmer
        </p>
    </div>

    {orders.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
            No orders found.
        </div>
    ) : (
        <>
            {/* ================= DESKTOP TABLE ================= */}
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
                                Shopkeeper
                            </th>

                            <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                Quantity
                            </th>

                            <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                Order Status
                            </th>

                            <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                                Payment
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

                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-800">
                                        {order.product?.productName || "—"}
                                    </p>

                                    {order.category?.category && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {order.category.category}
                                        </p>
                                    )}
                                </td>

                                <td className="px-5 py-4">
                                    <p className="text-gray-700">
                                        {order.shopkeeper?.name || "—"}
                                    </p>

                                    {order.shopkeeper?.phone && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {order.shopkeeper.phone}
                                        </p>
                                    )}
                                </td>

                                <td className="px-5 py-4 text-gray-700">
                                    {order.quantity}
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize whitespace-nowrap ${getStatusClass(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus.replaceAll(
                                            "_",
                                            " "
                                        )}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                                    {formatDate(order.createdAt)}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>


            {/* ================= MOBILE / TABLET ================= */}
            <div className="lg:hidden divide-y divide-gray-100">

                {orders.map((order) => (
                    <div
                        key={order._id}
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="p-4 sm:p-5 hover:bg-gray-50 transition cursor-pointer"
                    >

                        {/* Top */}
                        <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                                <p className="text-xs text-gray-400">
                                    Order ID
                                </p>

                                <p
                                    className="text-xs sm:text-sm text-gray-600 font-mono truncate mt-1"
                                    title={order._id}
                                >
                                    {order._id}
                                </p>

                            </div>

                            <p className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDate(order.createdAt)}
                            </p>

                        </div>


                        {/* Product */}
                        <div className="mt-4 flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <FiPackage size={19} />
                            </div>

                            <div className="min-w-0">

                                <p className="font-medium text-gray-800 truncate">
                                    {order.product?.productName || "—"}
                                </p>

                                {order.category?.category && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {order.category.category}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* Shopkeeper + Quantity */}
                        <div className="grid grid-cols-2 gap-4 mt-4">

                            <div>
                                <p className="text-xs text-gray-400">
                                    Shopkeeper
                                </p>

                                <p className="text-sm text-gray-700 mt-1 truncate">
                                    {order.shopkeeper?.name || "—"}
                                </p>

                                {order.shopkeeper?.phone && (
                                    <p className="text-xs text-gray-400 mt-1 truncate">
                                        {order.shopkeeper.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Quantity
                                </p>

                                <p className="text-sm font-medium text-gray-700 mt-1">
                                    {order.quantity} eggs
                                </p>
                            </div>

                        </div>


                        {/* Status */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">

                            <div>
                                <p className="text-[11px] text-gray-400 mb-1">
                                    Order Status
                                </p>

                                <span
                                    className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                                        order.orderStatus
                                    )}`}
                                >
                                    {order.orderStatus.replaceAll(
                                        "_",
                                        " "
                                    )}
                                </span>
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-400 mb-1">
                                    Payment
                                </p>

                                <span
                                    className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                                        order.paymentStatus
                                    )}`}
                                >
                                    {order.paymentStatus}
                                </span>
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

export default FarmerDetails;