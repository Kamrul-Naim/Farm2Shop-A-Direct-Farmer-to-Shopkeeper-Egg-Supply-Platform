import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const ShopkeeperDashboard = () => {
  const { backendUrl } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/orders/my-orders`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Fetch shopkeeper dashboard orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Orders which are still active
  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "cancelled"
  );

  // Successfully completed orders
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  );

  // Total amount spent on delivered orders
  const totalSpent = completedOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "bg-blue-50 text-blue-700";

      case "confirmed":
        return "bg-indigo-50 text-indigo-700";

      case "processing":
        return "bg-yellow-50 text-yellow-700";

      case "ready_for_delivery":
        return "bg-orange-50 text-orange-700";

      case "out_for_delivery":
        return "bg-purple-50 text-purple-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Shopkeeper Dashboard
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Keep track of your orders and purchases.
          </p>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {orders.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <FiShoppingBag
                  size={21}
                  className="text-[#176B3A]"
                />
              </div>

            </div>
          </div>


          {/* Pending Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Pending Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {pendingOrders.length}
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


          {/* Completed Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Completed Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {completedOrders.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <FiCheckCircle
                  size={21}
                  className="text-blue-600"
                />
              </div>

            </div>
          </div>


          {/* Total Spent */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Spent
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  ৳{totalSpent.toLocaleString()}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                <FiDollarSign
                  size={21}
                  className="text-purple-600"
                />
              </div>

            </div>
          </div>

        </div>


        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest orders.
              </p>
            </div>

            {orders.length > 0 && (
              <button
                onClick={() => navigate("/shopkeeper/orders")}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#176B3A] hover:text-[#12572F] transition"
              >
                View All
                <FiArrowRight size={16} />
              </button>
            )}

          </div>


          {/* No Orders */}
          {orders.length === 0 ? (

            <div className="py-14 text-center">

              <FiShoppingBag
                size={34}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No orders yet
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Your orders will appear here after you place one.
              </p>

              <button
                onClick={() =>
                  navigate("/shopkeeper/marketplace")
                }
                className="mt-5 px-5 py-2.5 bg-[#176B3A] text-white text-sm font-medium rounded-lg hover:bg-[#12572F] transition"
              >
                Browse Marketplace
              </button>

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
                      Farmer
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

                    <th className="px-5 py-3 font-semibold text-gray-600">
                      Payment
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {orders.slice(0, 5).map((order) => (

                    <tr
                      key={order._id}
                      onClick={() =>
                        navigate(
                          `/shopkeeper/order/${order._id}`
                        )
                      }
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >

                      {/* Product */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {order.product?.productName ||
                            "Product"}
                        </p>
                      </td>


                      {/* Farmer */}
                      <td className="px-5 py-4 text-gray-600">
                        {order.farmer?.farmName ||
                          order.farmer?.name ||
                          "Farmer"}
                      </td>


                      {/* Quantity */}
                      <td className="px-5 py-4 text-gray-600">
                        {order.quantity}
                      </td>


                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ৳
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString()}
                      </td>


                      {/* Order Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            order.orderStatus
                          )}
                        </span>

                      </td>


                      {/* Payment */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {formatStatus(
                            order.paymentStatus
                          )}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default ShopkeeperDashboard;