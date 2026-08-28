
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const FarmerProductDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/products/${productId}`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0] || "");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch product details error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch product details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f6f8f5]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-[#176B3A] border-t-transparent rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f6f8f5] px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            📦
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Product not found
          </h2>

          <p className="mt-2 text-gray-500 text-sm">
            This product may have been removed or is no longer
            available.
          </p>

          <button
            onClick={() => navigate("/farmer/stock")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
          >
            Back to My Stock
          </button>
        </div>
      </div>
    );
  }

  const expirationDate = new Date(product.expiresAt);

  const formattedExpirationDate =
    expirationDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const today = new Date();

  const remainingDays = Math.max(
    0,
    Math.ceil(
      (expirationDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="min-h-screen bg-[#f6f8f5] py-8 sm:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/farmer/stock")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#176B3A] transition mb-6"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">
            ←
          </span>

          Back to My Stock
        </button>


        {/* Main Product Card */}
        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">

            {/* ================= IMAGE SECTION ================= */}
            <div className="bg-[#edf3ed] p-5 sm:p-7 lg:p-8">

              {/* Main Image */}
              <div className="relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden bg-white shadow-sm">

                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-5 left-5">
                  {product.isAvailable ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-sm font-semibold text-green-700 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-sm font-semibold text-gray-600 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      Unavailable
                    </span>
                  )}
                </div>

              </div>


              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 mt-4">

                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border-2 transition-all duration-200 ${
                        selectedImage === image
                          ? "border-[#176B3A] shadow-md scale-[1.02]"
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


            {/* ================= INFORMATION SECTION ================= */}
            <div className="p-6 sm:p-8 lg:p-10">

              {/* Category */}
              <div className="flex items-center gap-2">

                <span className="px-3 py-1.5 rounded-lg bg-[#eaf3eb] text-[#176B3A] text-xs font-bold uppercase tracking-wider">
                  {product.category?.category}
                </span>

              </div>


              {/* Product Name */}
              <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.productName}
              </h1>


              {/* Price */}
              <div className="mt-5 flex items-end gap-2">

                <span className="text-4xl font-extrabold text-[#176B3A]">
                  ৳{product.category?.price}
                </span>

                <span className="text-gray-500 mb-1">
                  per piece
                </span>

              </div>


              {/* Divider */}
              <div className="h-px bg-gray-100 my-7" />


              {/* Stock Information */}
              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-[#f6f8f5] border border-[#e7eee7] p-5">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Available Stock
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {product.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    pieces
                  </p>

                </div>


                <div className="rounded-2xl bg-[#f6f8f5] border border-[#e7eee7] p-5">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Minimum Order
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {product.minimumOrderQuantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    pieces
                  </p>

                </div>

              </div>


              {/* Availability / Expiration */}
              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      📅
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Expiration
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {remainingDays > 0
                          ? `${remainingDays} days remaining`
                          : "Product expired"}
                      </p>
                    </div>

                  </div>

                  <p className="text-sm font-bold text-gray-800">
                    {formattedExpirationDate}
                  </p>

                </div>

              </div>


              {/* Description */}
              <div className="mt-7 rounded-2xl bg-[#f6f8f5] border border-[#e7eee7] p-6">

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-9 h-9 rounded-xl bg-[#dcebdd] flex items-center justify-center">
                    📝
                  </div>

                  <h2 className="text-lg font-bold text-gray-800">
                    Product Description
                  </h2>

                </div>

                <p className="text-gray-600 leading-7 text-sm sm:text-base whitespace-pre-line">
                  {product.description}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FarmerProductDetails;

