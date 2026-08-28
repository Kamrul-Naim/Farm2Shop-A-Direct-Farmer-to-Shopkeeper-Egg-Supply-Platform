import React from "react";
import { useNavigate } from "react-router-dom";

const MarketplaceProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/shopkeeper/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Availability */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-green-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            Available
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Category */}
        <p className="text-xs font-semibold uppercase tracking-wider text-[#176B3A]">
          {product.category?.category}
        </p>

        {/* Product Name */}
        <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-1">
          {product.productName}
        </h3>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#176B3A]">
            ৳{product.category?.price}
          </span>

          <span className="text-sm text-gray-500">
            / piece
          </span>
        </div>

        {/* Product Information */}
        <div className="mt-4 grid grid-cols-2 gap-2">

          <div className="rounded-xl bg-[#f5f7f4] p-3">
            <p className="text-xs text-gray-500">
              Available
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {product.quantity} pcs
            </p>
          </div>

          <div className="rounded-xl bg-[#f5f7f4] p-3">
            <p className="text-xs text-gray-500">
              Min. Order
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {product.minimumOrderQuantity} pcs
            </p>
          </div>

        </div>

        {/* Farm */}
        <div className="mt-4 flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-[#176B3A]/10 flex items-center justify-center text-sm">
            🌱
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              Farm
            </p>

            <p className="text-sm font-semibold text-gray-800 truncate">
              {product.farmer?.farmName || "Unknown Farm"}
            </p>
          </div>

        </div>

        {/* Details */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-[#176B3A] group-hover:underline">
            View Details →
          </span>
        </div>

      </div>
    </div>
  );
};

export default MarketplaceProductCard;