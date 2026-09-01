import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";
import { AppContext } from "../../context/AppContext";

const Earnings = () => {
  const { backendUrl } = useContext(AppContext);

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
      }
    } catch (error) {
      console.error("Fetch farmer earnings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /*
   * Only delivered + paid orders are counted
   * as completed earnings.
   */
  const completedOrders = orders.filter(
    (order) =>
      order.orderStatus === "delivered" &&
      order.paymentStatus === "paid"
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "cancelled"
  );

  const totalEarnings = completedOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const pendingEarnings = pendingOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading earnings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Earnings
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Track your earnings from completed orders.
          </p>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total Earnings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Earnings
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  ৳{totalEarnings.toLocaleString()}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <FiDollarSign
                  size={21}
                  className="text-[#176B3A]"
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


          {/* Pending Earnings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Pending Earnings
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  ৳{pendingEarnings.toLocaleString()}
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


          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {totalOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                <FiShoppingBag
                  size={21}
                  className="text-purple-600"
                />
              </div>

            </div>
          </div>

        </div>


        {/* Earnings History */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Earnings History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your completed and paid orders.
            </p>
          </div>


          {completedOrders.length === 0 ? (

            <div className="py-14 text-center">

              <FiDollarSign
                size={34}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No earnings yet
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Your earnings will appear here after orders are completed.
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
                      Payment
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-600">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {completedOrders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-t border-gray-100"
                    >

                      {/* Product */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {order.product?.productName ||
                            "Product"}
                        </p>
                      </td>


                      {/* Shopkeeper */}
                      <td className="px-5 py-4 text-gray-600">
                        {order.shopkeeper?.shopName ||
                          order.shopkeeper?.name ||
                          "Shopkeeper"}
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


                      {/* Payment */}
                      <td className="px-5 py-4">

                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Paid
                        </span>

                      </td>


                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
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

export default Earnings;