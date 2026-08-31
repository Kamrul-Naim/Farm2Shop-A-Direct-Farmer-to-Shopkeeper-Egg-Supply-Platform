
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const ProductDetails = () => {
    const { backendUrl } = useContext(AppContext);
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${backendUrl}/api/products/${productId}`
            );

            if (data.success) {
                setProduct(data.product);
                setSelectedImage(0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch product details error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to load product details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    // Loading
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4]">
                <div className="text-center">
                    <div className="w-10 h-10 mx-auto border-4 border-[#176B3A]/20 border-t-[#176B3A] rounded-full animate-spin" />

                    <p className="mt-4 text-gray-500">
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4] px-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl">
                        📦
                    </div>

                    <h2 className="mt-5 text-2xl font-bold text-gray-800">
                        Product not found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        This product may no longer exist.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/shopkeeper/marketplace")
                        }
                        className="mt-6 px-5 py-2.5 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
                    >
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    const images = product.images || [];

    const currentImage =
        images[selectedImage] || images[0];

    const isAvailable = product.isAvailable;

    return (
      <div className="min-h-screen bg-[#f5f7f4] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/shopkeeper/marketplace")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176B3A] hover:text-[#12582f] transition"
          >
            <span className="text-lg">←</span>
            Back to Marketplace
          </button>

          {/* Main Product Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              {/* ========================= */}
              {/* LEFT - PRODUCT IMAGES */}
              {/* ========================= */}

              <div className="p-5 sm:p-8 lg:p-10 bg-gray-50">
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}

                  {/* Availability */}
                  <div className="absolute top-4 left-4">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-green-700 text-xs font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-gray-600 text-xs font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                          selectedImage === index
                            ? "border-[#176B3A] ring-2 ring-[#176B3A]/10"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ========================= */}
              {/* RIGHT - PRODUCT INFORMATION */}
              {/* ========================= */}

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Category */}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#176B3A]">
                  {product.category?.category || "Product"}
                </p>

                {/* Product Name */}
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  {product.productName}
                </h1>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#176B3A]">
                    ৳{product.category?.price ?? 0}
                  </span>

                  <span className="text-sm text-gray-500">/ piece</span>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                    Product Description
                  </h2>

                  <p className="mt-3 text-gray-600 leading-7">
                    {product.description}
                  </p>
                </div>

                {/* Product Stats */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Quantity */}
                  <div className="rounded-2xl bg-[#f5f7f4] border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                        📦
                      </div>

                      <p className="text-xs text-gray-500">
                        Available Quantity
                      </p>
                    </div>

                    <p className="mt-3 text-xl font-bold text-gray-800">
                      {product.quantity} pcs
                    </p>
                  </div>

                  {/* Minimum Order */}
                  <div className="rounded-2xl bg-[#f5f7f4] border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                        🛒
                      </div>

                      <p className="text-xs text-gray-500">Minimum Order</p>
                    </div>

                    <p className="mt-3 text-xl font-bold text-gray-800">
                      {product.minimumOrderQuantity} pcs
                    </p>
                  </div>
                </div>

                {/* Farm Information */}
                <div className="mt-8 pt-7 border-t border-gray-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Sold by
                  </p>

                  <div className="mt-4 flex items-start gap-4">
                    {/* Farmer Image */}
                    <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden bg-[#176B3A]/10">
                      {product.farmer?.profileImage ? (
                        <img
                          src={product.farmer.profileImage}
                          alt={product.farmer?.name || "Farmer"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🌱
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">
                        {product.farmer?.name || "Unknown Farmer"}
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-[#176B3A]">
                        {product.farmer?.farmName || "Farm"}
                      </p>

                      {product.farmer?.farmAddress && (
                        <p className="mt-1 text-sm text-gray-500">
                          📍 {product.farmer.farmAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Farm Description */}
                  {product.farmer?.farmDescription && (
                    <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        About the Farm
                      </p>

                      <p className="mt-2 text-sm text-gray-600 leading-6">
                        {product.farmer.farmDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Button */}
                <div className="mt-8">
                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/shopkeeper/order/${productId}`)}
                      className="w-full h-13 rounded-xl bg-[#176B3A] text-white font-bold hover:bg-[#12582f] transition"
                    >
                      Order Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full h-13 rounded-xl bg-gray-200 text-gray-500 font-bold cursor-not-allowed"
                    >
                      Product Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductDetails;

