import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const MyStock = () => {
  const { backendUrl } = useContext(AppContext);
  console.log("Backend URL from context:", backendUrl);

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToRemove, setProductToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/products/my-products`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
      console.log("Fetched my products:", data.products);
    } catch (error) {
      console.error("Fetch my products error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch your products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  //Removing Product
  const handleRemoveProduct = async () => {
    if (!productToRemove) return;

    try {
      setRemoving(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/products/${productToRemove._id}/remove`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success("Product removed successfully.");

        // Remove it from the current UI
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productToRemove._id
              ? { ...product, isAvailable: false }
              : product,
          ),
        );

        setProductToRemove(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Remove product error:", error);

      toast.error(
        error.response?.data?.message || "Failed to remove the product.",
      );
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Stock
          </h1>

          <p className="text-gray-500 mt-1">
            Manage the products you are selling.
          </p>
        </div>

        <button
          onClick={() => navigate("/farmer/add-product")}
          className="px-4 py-2.5 bg-[#176B3A] text-white rounded-xl font-medium hover:bg-[#12582f] transition"
        >
          + Add Product
        </button>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No products yet
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't added any products to your stock.
          </p>

          <button
            onClick={() => navigate("/farmer/add-product")}
            className="mt-5 px-5 py-2.5 bg-[#176B3A] text-white rounded-xl font-medium hover:bg-[#12582f] transition"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/farmer/product/${product._id}`)}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  {product.isAvailable ? (
                    <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-green-700 shadow-sm">
                      ● Available
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-600 shadow-sm">
                      ● Unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5">
                {/* Category */}
                <p className="text-xs font-medium uppercase tracking-wide text-[#176B3A]">
                  {product.category?.category}
                </p>

                {/* Product Name */}
                <h2 className="mt-1 text-xl font-bold text-gray-800 line-clamp-1">
                  {product.productName}
                </h2>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#176B3A]">
                    ৳{product.category?.price}
                  </span>

                  <span className="text-sm text-gray-500">/ piece</span>
                </div>

                {/* Product Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Available</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {product.quantity} pcs
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Min. Order</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {product.minimumOrderQuantity} pcs
                    </p>
                  </div>
                </div>

                {/* Expiration */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Expires</span>

                  <span className="font-medium text-gray-700">
                    {new Date(product.expiresAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                  {/* Edit */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();

                      if (product.isAvailable) {
                        navigate(`/farmer/edit-product/${product._id}`);
                      }
                    }}
                    disabled={!product.isAvailable}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      product.isAvailable
                        ? "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                        : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    Edit
                  </button>

                  {/* Remove */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setProductToRemove(product);
                    }}
                    disabled={!product.isAvailable}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                      product.isAvailable
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {product.isAvailable ? "Remove" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => {
            if (!removing) {
              setProductToRemove(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800">Remove Product?</h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-700">
                {productToRemove.productName}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-gray-500">
              The product will become unavailable and will no longer be
              available for new orders.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToRemove(null)}
                disabled={removing}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRemoveProduct}
                disabled={removing}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {removing ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStock;
