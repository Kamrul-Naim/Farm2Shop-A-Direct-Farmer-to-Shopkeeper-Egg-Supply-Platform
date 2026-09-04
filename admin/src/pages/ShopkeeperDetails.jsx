import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiShoppingCart,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCreditCard,
    FiRefreshCw
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const ShopkeeperDetails = () => {
    const { backendUrl } = useContext(AppContext);
    const { shopkeeperId } = useParams();
    const navigate = useNavigate();

    const [shopkeeper, setShopkeeper] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalEggsPurchased, setTotalEggsPurchased] = useState(0);

    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchShopkeeperDetails = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/admin/shopkeepers/${shopkeeperId}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setShopkeeper(response.data.shopkeeper);
                setOrders(response.data.orders);
                setTotalEggsPurchased(
                    response.data.totalEggsPurchased
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch shopkeeper details:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load shopkeeper details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopkeeperDetails();
    }, [shopkeeperId]);

    const updateVerificationStatus = async (status) => {
        try {
            setUpdatingStatus(true);

            const response = await axios.patch(
                `${backendUrl}/api/admin/verification/shopkeeper/${shopkeeperId}`,
                {
                    verificationStatus: status
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setShopkeeper((prev) => ({
                    ...prev,
                    verificationStatus: status
                }));

                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(
                "Failed to update verification status:",
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
        if (status === "approved") {
            return "bg-green-50 text-green-700 border-green-200";
        }

        if (status === "rejected") {
            return "bg-red-50 text-red-700 border-red-200";
        }

        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    const getOrderStatusClass = (status) => {
        if (status === "delivered") {
            return "bg-green-50 text-green-700";
        }

        if (status === "cancelled") {
            return "bg-red-50 text-red-700";
        }

        if (status === "placed") {
            return "bg-blue-50 text-blue-700";
        }

        return "bg-amber-50 text-amber-700";
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatStatus = (status) => {
        return status
            ?.split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-500">
                    <FiRefreshCw
                        size={18}
                        className="animate-spin"
                    />
                    <span className="text-sm">
                        Loading shopkeeper details...
                    </span>
                </div>
            </div>
        );
    }

    if (!shopkeeper) {
        return (
            <div className="py-16 text-center">
                <p className="text-gray-600">
                    Shopkeeper not found.
                </p>

                <button
                    onClick={() => navigate("/shopkeepers")}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                    Back to Shopkeepers
                </button>
            </div>
        );
    }

    return (
      <div className="space-y-6">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => navigate("/shopkeepers")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition mb-4"
          >
            <FiArrowLeft size={17} />
            Back to Shopkeepers
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {shopkeeper.name}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {shopkeeper.shopName}
              </p>
            </div>

            <div
              className={`inline-flex self-start lg:self-auto px-3 py-1.5 rounded-full border text-sm font-medium capitalize ${getStatusClass(
                shopkeeper.verificationStatus,
              )}`}
            >
              {shopkeeper.verificationStatus}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Eggs Purchased</p>

                <p className="text-3xl font-semibold text-gray-800 mt-2">
                  {totalEggsPurchased.toLocaleString()}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Non-cancelled orders
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <FiShoppingCart size={21} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>

                <p className="text-3xl font-semibold text-gray-800 mt-2">
                  {orders.length}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Orders placed on platform
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiCreditCard size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Shopkeeper Information */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Shopkeeper Information
            </h2>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex gap-3">
              <div className="text-gray-400 mt-0.5">
                <FiMail size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-700 mt-1 break-all">
                  {shopkeeper.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-gray-400 mt-0.5">
                <FiPhone size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-700 mt-1">{shopkeeper.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-gray-400 mt-0.5">
                <FiCreditCard size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">NID</p>
                <p className="text-sm text-gray-700 mt-1">{shopkeeper.nid}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-gray-400 mt-0.5">
                <FiMapPin size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Shop Address</p>
                <p className="text-sm text-gray-700 mt-1">
                  {shopkeeper.shopAddress}
                </p>
              </div>
            </div>

            {shopkeeper.shopDescription && (
              <div className="md:col-span-2">
                <p className="text-xs text-gray-400">Shop Description</p>

                <p className="text-sm text-gray-700 mt-1 leading-6">
                  {shopkeeper.shopDescription}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400">Joined</p>

              <p className="text-sm text-gray-700 mt-1">
                {formatDate(shopkeeper.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Account Status</p>

              <p className="text-sm text-gray-700 mt-1">
                {shopkeeper.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Verification</h2>
          </div>

          <div className="p-5">
            <p className="text-sm text-gray-500 mb-4">
              Update the shopkeeper's verification status.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={
                  updatingStatus || shopkeeper.verificationStatus === "approved"
                }
                onClick={() => updateVerificationStatus("approved")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCheckCircle size={17} />
                Approve
              </button>

              <button
                disabled={
                  updatingStatus || shopkeeper.verificationStatus === "rejected"
                }
                onClick={() => updateVerificationStatus("rejected")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiXCircle size={17} />
                Reject
              </button>

              <button
                disabled={
                  updatingStatus || shopkeeper.verificationStatus === "pending"
                }
                onClick={() => updateVerificationStatus("pending")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiClock size={17} />
                Set Pending
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Purchase Orders</h2>

              <p className="text-xs text-gray-400 mt-1">
                Orders placed by this shopkeeper
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {orders.length} orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="py-14 text-center">
              <FiShoppingCart size={30} className="mx-auto text-gray-300" />

              <p className="text-sm text-gray-500 mt-3">
                This shopkeeper has no orders yet.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                        Product
                      </th>

                      <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                        Farmer
                      </th>

                      <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                        Quantity
                      </th>

                      <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                        Amount
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
                        className="hover:bg-green-50/50 cursor-pointer transition"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {order.product?.productName || "Product"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {order._id}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {order.farmer?.name || "—"}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {order.quantity}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          ৳{Number(order.totalAmount).toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusClass(
                              order.orderStatus,
                            )}`}
                          >
                            {formatStatus(order.orderStatus)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-gray-700 capitalize">
                            {order.paymentMethod}
                          </p>

                          <p className="text-xs text-gray-400 capitalize mt-1">
                            {order.paymentStatus}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="lg:hidden divide-y divide-gray-100">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="p-4 hover:bg-green-50/50 cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.product?.productName || "Product"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
    View order details →
</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOrderStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Farmer</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {order.farmer?.name || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {order.quantity} eggs
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Amount</p>
                        <p className="text-sm text-gray-700 mt-1">
                          ৳{Number(order.totalAmount).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Payment</p>
                        <p className="text-sm text-gray-700 mt-1 capitalize">
                          {order.paymentMethod}
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

export default ShopkeeperDetails;