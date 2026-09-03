import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiSearch,
    FiFilter,
    FiPackage,
    FiUser,
    FiMapPin,
    FiCalendar,
    FiCreditCard,
    FiChevronRight,
    FiRefreshCw
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const Orders = () => {
    const { backendUrl } = useContext(AppContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");

    const navigate = useNavigate();

    const getAllOrders = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/orders/admin/all`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Get all orders error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    // Filter orders on frontend
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id
                ?.toLowerCase()
                .includes(search.toLowerCase().trim());

        const matchesOrderStatus =
            orderStatus === "all" ||
            order.orderStatus === orderStatus;

        const matchesPaymentStatus =
            paymentStatus === "all" ||
            order.paymentStatus === paymentStatus;

        return (
            matchesSearch &&
            matchesOrderStatus &&
            matchesPaymentStatus
        );
    });

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
            pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
            failed: "bg-red-50 text-red-700 border-red-100",
            refunded: "bg-purple-50 text-purple-700 border-purple-100"
        };

        return (
            styles[status] ||
            "bg-gray-50 text-gray-600 border-gray-100"
        );
    };

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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const clearFilters = () => {
        setSearch("");
        setOrderStatus("all");
        setPaymentStatus("all");
    };

    return (
      <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <FiPackage size={22} className="text-green-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Manage and monitor all customer orders.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={getAllOrders}
            className="self-start lg:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50 transition"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Total Orders</p>

            <p className="text-2xl font-bold text-gray-800 mt-1">
              {orders.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Pending</p>

            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {orders.filter((order) => order.orderStatus === "placed").length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Delivered</p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {
                orders.filter((order) => order.orderStatus === "delivered")
                  .length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Unpaid</p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              {
                orders.filter((order) => order.paymentStatus === "pending")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter size={17} className="text-green-600" />

            <h2 className="text-sm font-semibold text-gray-800">
              Search & Filter Orders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>

            {/* Order Status */}
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            >
              <option value="all">All Order Status</option>

              <option value="placed">Placed</option>

              <option value="confirmed">Confirmed</option>

              <option value="processing">Processing</option>

              <option value="ready_for_delivery">Ready for Delivery</option>

              <option value="out_for_delivery">Out for Delivery</option>

              <option value="delivered">Delivered</option>

              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            >
              <option value="all">All Payment Status</option>

              <option value="pending">Pending</option>

              <option value="paid">Paid</option>

              <option value="failed">Failed</option>

              <option value="refunded">Refunded</option>
            </select>
          </div>

          {(search || orderStatus !== "all" || paymentStatus !== "all") && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-gray-500 hover:text-red-600 transition"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top bar */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">All Orders</h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>

              <p className="text-sm text-gray-500 mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiPackage size={26} className="text-gray-400" />
              </div>

              <h3 className="text-sm font-semibold text-gray-700">
                No orders found
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Order
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Product
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Shopkeeper
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Farmer
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Qty
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Payment
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Date
                      </th>

                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => {
                          navigate(`/orders/${order._id}`);
                        }}
                        className="border-b border-gray-50 last:border-0 hover:bg-green-50/40 transition cursor-pointer group"
                      >
                        {/* Order */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                              <FiPackage size={17} className="text-green-600" />
                            </div>

                            <div>
                              <p
                                className="font-semibold text-gray-800"
                                title={order._id}
                              >
                                #{order._id.slice(-8)}
                              </p>

                              <p className="text-[11px] text-gray-400">
                                Order ID
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">
                            {order.product?.productName || "-"}
                          </p>
                        </td>

                        {/* Shopkeeper */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <FiUser size={15} className="text-gray-400" />

                            <span className="text-gray-600">
                              {order.shopkeeper?.name || "-"}
                            </span>
                          </div>
                        </td>

                        {/* Farmer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <FiUser size={15} className="text-gray-400" />

                            <span className="text-gray-600">
                              {order.farmer?.name || "-"}
                            </span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-700">
                            {order.quantity}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            eggs
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-gray-800">
                            ৳{order.totalAmount}
                          </span>
                        </td>

                        {/* Order Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getOrderStatusStyle(
                              order.orderStatus,
                            )}`}
                          >
                            {formatStatus(order.orderStatus)}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getPaymentStatusStyle(
                              order.paymentStatus,
                            )}`}
                          >
                            {formatStatus(order.paymentStatus)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiCalendar size={14} />

                            <span className="text-xs">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </td>

                        <td className="px-4">
                          <FiChevronRight
                            size={18}
                            className="text-gray-300 group-hover:text-green-600 transition"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet / Mobile Cards */}
              <div className="xl:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => {
                      console.log("Selected order:", order._id);
                    }}
                    className="p-5 hover:bg-green-50/30 transition cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <FiPackage size={18} className="text-green-600" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            #{order._id.slice(-8)}
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <FiChevronRight size={19} className="text-gray-300" />
                    </div>

                    {/* Product */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-400">Product</p>

                      <p className="font-medium text-gray-700 mt-0.5">
                        {order.product?.productName || "-"}
                      </p>
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Shopkeeper</p>

                        <p className="text-sm text-gray-600 mt-0.5">
                          {order.shopkeeper?.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Farmer</p>

                        <p className="text-sm text-gray-600 mt-0.5">
                          {order.farmer?.name || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>

                        <p className="text-sm font-semibold text-gray-700">
                          {order.quantity} eggs
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Total</p>

                        <p className="text-base font-bold text-gray-800">
                          ৳{order.totalAmount}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${getOrderStatusStyle(
                            order.orderStatus,
                          )}`}
                        >
                          {formatStatus(order.orderStatus)}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${getPaymentStatusStyle(
                            order.paymentStatus,
                          )}`}
                        >
                          {formatStatus(order.paymentStatus)}
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

export default Orders;