import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const OrderPlacement = () => {
  const { productId } = useParams();
  const { backendUrl, user, userRole } = useContext(AppContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  // const [paymentMethod, setPaymentMethod] = useState("cod");

  // Fetch product
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendUrl}/api/products/${productId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        toast.error(response.data.message || "Failed to load product.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole !== "shopkeeper") {
      toast.error("Only shopkeepers can place orders.");
      navigate("/");
      return;
    }

    fetchProduct();
  }, [productId, userRole]);

  // Price calculation
  const orderQuantity = Number(quantity) || 0;

  const unitPrice = product?.category?.price || 0;

  const totalAmount = orderQuantity * unitPrice;


// Place order
const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (!product) {
    return;
  }

  if (!quantity || orderQuantity < 1) {
    toast.error("Please enter a valid quantity.");
    return;
  }

  if (orderQuantity < product.minimumOrderQuantity) {
    toast.error(
      `Minimum order quantity is ${product.minimumOrderQuantity} pieces.`,
    );
    return;
  }

  if (orderQuantity > product.quantity) {
    toast.error(`Only ${product.quantity} pieces are available.`);
    return;
  }

  if (!deliveryAddress.trim()) {
    toast.error("Please enter your delivery address.");
    return;
  }

  try {
    setPlacingOrder(true);

    // Create order
    // Every newly created order is COD by default
    const response = await axios.post(
      `${backendUrl}/api/orders`,
      {
        productId,
        quantity: orderQuantity,
        deliveryAddress: deliveryAddress.trim(),
      },
      {
        withCredentials: true,
      },
    );

    if (!response.data.success) {
      toast.error(
        response.data.message || "Failed to place order.",
      );
      return;
    }

    const order = response.data.order;

    toast.success("Order placed successfully.");

    navigate(`/shopkeeper/orders/${order._id}`);

  } catch (error) {
    console.error("Place order error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to place order.",
    );
  } finally {
    setPlacingOrder(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-[#176B3A] transition"
          >
            ← Back to Product
          </button>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
            Place Your Order
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review the product and complete your order.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Product Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Product Image */}
              <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {product.productName}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-medium text-gray-700">
                    {product.category?.category}
                  </span>
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Price per piece:{" "}
                  <span className="font-semibold text-[#176B3A]">
                    ৳{unitPrice}
                  </span>
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Available:{" "}
                  <span className="font-medium text-gray-700">
                    {product.quantity} pieces
                  </span>
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Minimum order:{" "}
                  <span className="font-medium text-gray-700">
                    {product.minimumOrderQuantity} pieces
                  </span>
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Quantity
              </label>

              <input
                type="number"
                min={product.minimumOrderQuantity}
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Minimum ${product.minimumOrderQuantity} pieces`}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#176B3A]/20 focus:border-[#176B3A]"
              />
            </div>

            {/* Delivery Address */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Address
              </label>

              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={4}
                placeholder="Enter your complete delivery address"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#176B3A]/20 focus:border-[#176B3A]"
              />
            </div>

            {/* Payment Method */}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>

                <span className="font-medium text-gray-800 text-right max-w-[180px]">
                  {product.productName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>

                <span className="font-medium text-gray-800">
                  {product.category?.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Quantity</span>

                <span className="font-medium text-gray-800">
                  {orderQuantity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Price / piece</span>

                <span className="font-medium text-gray-800">৳{unitPrice}</span>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>

                <span className="text-xl font-bold text-[#176B3A]">
                  ৳{totalAmount}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full mt-6 py-3.5 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            <p className="mt-3 text-xs text-center text-gray-400">
              Final price is calculated securely by the server.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPlacement;
