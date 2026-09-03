import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave } from "react-icons/fi";
import axios from "axios";
import {
    FiArrowLeft,
    FiPackage,
    FiUser,
    FiMapPin,
    FiCreditCard,
    FiCalendar
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const OrderDetails = () => {
    const { backendUrl } = useContext(AppContext);
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
const [updatingStatus, setUpdatingStatus] = useState(false);
const [updatingPayment, setUpdatingPayment] = useState(false);

    const getOrderDetails = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/orders/admin/${orderId}`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setOrder(response.data.order);
                setSelectedOrderStatus(response.data.order.orderStatus);
            }
        } catch (error) {
            console.error("Get order details error:", error);
        } finally {
            setLoading(false);
        }
    };


    const updateOrderStatus = async () => {
    if (!selectedOrderStatus) {
        toast.error("Please select an order status.");
        return;
    }

    if (selectedOrderStatus === order.orderStatus) {
        toast.info("Order status is already set to this status.");
        return;
    }

    try {
        setUpdatingStatus(true);

        const response = await axios.patch(
            `${backendUrl}/api/orders/${order._id}/status`,
            {
                orderStatus: selectedOrderStatus
            },
            {
                withCredentials: true
            }
        );

        if (response.data.success) {
            setOrder(response.data.order);

            toast.success(
                response.data.message ||
                "Order status updated successfully."
            );
        }
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to update order status."
        );
    } finally {
        setUpdatingStatus(false);
    }
};



const updatePaymentStatus = async () => {
    if (
        order.paymentMethod !== "cod" ||
        order.paymentStatus !== "pending"
    ) {
        return;
    }

    try {
        setUpdatingPayment(true);

        const response = await axios.patch(
            `${backendUrl}/api/orders/admin/${order._id}/payment-status`,
            {
                paymentStatus: "paid"
            },
            {
                withCredentials: true
            }
        );

        if (response.data.success) {
            setOrder(response.data.order);

            toast.success(
                response.data.message ||
                "Payment marked as paid."
            );
        }
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to update payment status."
        );
    } finally {
        setUpdatingPayment(false);
    }
};

    useEffect(() => {
        getOrderDetails();
    }, [orderId]);

    const formatStatus = (status) => {
        if (!status) return "-";

        return status
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };

    const getOrderStatusStyle = (status) => {
        const styles = {
            placed: "bg-blue-50 text-blue-700 border-blue-100",
            confirmed: "bg-indigo-50 text-indigo-700 border-indigo-100",
            processing: "bg-yellow-50 text-yellow-700 border-yellow-100",
            ready_for_delivery:
                "bg-purple-50 text-purple-700 border-purple-100",
            out_for_delivery:
                "bg-orange-50 text-orange-700 border-orange-100",
            delivered:
                "bg-green-50 text-green-700 border-green-100",
            cancelled:
                "bg-red-50 text-red-700 border-red-100"
        };

        return (
            styles[status] ||
            "bg-gray-50 text-gray-600 border-gray-100"
        );
    };

    const getPaymentStatusStyle = (status) => {
        const styles = {
            paid: "bg-green-50 text-green-700 border-green-100",
            pending:
                "bg-yellow-50 text-yellow-700 border-yellow-100",
            failed: "bg-red-50 text-red-700 border-red-100",
            refunded:
                "bg-purple-50 text-purple-700 border-purple-100"
        };

        return (
            styles[status] ||
            "bg-gray-50 text-gray-600 border-gray-100"
        );
    };

    if (loading) {
        return (
            <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mx-auto" />

                    <p className="text-sm text-gray-500 mt-4">
                        Loading order details...
                    </p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-full bg-gray-50 p-6">
                <button
                    onClick={() => navigate("/orders")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                >
                    <FiArrowLeft />
                    Back to Orders
                </button>

                <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <FiPackage
                        size={35}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 font-semibold text-gray-700">
                        Order not found
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                        The requested order could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition mb-3"
            >
              <FiArrowLeft size={16} />
              Back to Orders
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <FiPackage size={22} className="text-green-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{order._id.slice(-8)}
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Complete order information
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 rounded-full border text-xs font-medium ${getOrderStatusStyle(
                order.orderStatus,
              )}`}
            >
              {formatStatus(order.orderStatus)}
            </span>

            <span
              className={`px-3 py-1.5 rounded-full border text-xs font-medium ${getPaymentStatusStyle(
                order.paymentStatus,
              )}`}
            >
              {formatStatus(order.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product / Order */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">
                  Order Information
                </h2>
              </div>

              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    {order.product?.images?.[0] ? (
                      <img
                        src={order.product.images[0]}
                        alt={order.product.productName}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <FiPackage size={30} className="text-green-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Product</p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-1">
                      {order.product?.productName || "-"}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>

                        <p className="font-semibold text-gray-700 mt-1">
                          {order.quantity} eggs
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Unit Price</p>

                        <p className="font-semibold text-gray-700 mt-1">
                          ৳{order.unitPrice}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>

                        <p className="font-bold text-green-700 mt-1">
                          ৳{order.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer / Farmer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser className="text-green-600" size={18} />

                  <h2 className="font-semibold text-gray-800">Shopkeeper</h2>
                </div>

                <p className="font-medium text-gray-800">
                  {order.shopkeeper?.name || "-"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser className="text-green-600" size={18} />

                  <h2 className="font-semibold text-gray-800">Farmer</h2>
                </div>

                <p className="font-medium text-gray-800">
                  {order.farmer?.name || "-"}
                </p>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-green-600" size={18} />

                <h2 className="font-semibold text-gray-800">
                  Delivery Address
                </h2>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {order.deliveryAddress || "-"}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <FiCreditCard className="text-green-600" size={18} />

                <h2 className="font-semibold text-gray-800">Payment</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Method</span>

                  <span className="text-sm font-medium text-gray-700">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Status</span>

                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs font-medium ${getPaymentStatusStyle(
                      order.paymentStatus,
                    )}`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-800">
                    ৳{order.totalAmount}
                  </span>
                </div>

                {order.paymentMethod === "cod" &&
                  order.paymentStatus === "pending" && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 mb-3">
                        <p className="text-xs font-medium text-yellow-800">
                          Cash on Delivery
                        </p>

                        <p className="text-xs text-yellow-700 mt-1">
                          Mark this payment as paid after receiving the cash
                          from the shopkeeper.
                        </p>
                      </div>

                      <button
                        onClick={updatePaymentStatus}
                        disabled={updatingPayment}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <FiCreditCard size={16} />

                        {updatingPayment
                          ? "Updating..."
                          : "Mark Payment as Paid"}
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-green-600" size={18} />

                <h2 className="font-semibold text-gray-800">Order Date</h2>
              </div>

              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Admin Actions - next step */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiPackage size={18} className="text-green-600" />

                  <h2 className="font-semibold text-gray-800">Admin Actions</h2>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Update the current order status.
                </p>
              </div>

              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>

                <select
                  value={selectedOrderStatus}
                  onChange={(e) => setSelectedOrderStatus(e.target.value)}
                  disabled={
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled" ||
                    updatingStatus
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="placed">Placed</option>

                  <option value="confirmed">Confirmed</option>

                  <option value="processing">Processing</option>

                  <option value="ready_for_delivery">Ready for Delivery</option>

                  <option value="out_for_delivery">Out for Delivery</option>

                  <option value="delivered">Delivered</option>

                  <option value="cancelled">Cancelled</option>
                </select>

                {(order.orderStatus === "delivered" ||
                  order.orderStatus === "cancelled") && (
                  <p className="text-xs text-gray-500 mt-2">
                    This order can no longer be updated.
                  </p>
                )}

                <button
                  onClick={updateOrderStatus}
                  disabled={
                    updatingStatus ||
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled" ||
                    selectedOrderStatus === order.orderStatus
                  }
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <FiSave size={16} />

                  {updatingStatus ? "Updating..." : "Update Order Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default OrderDetails;