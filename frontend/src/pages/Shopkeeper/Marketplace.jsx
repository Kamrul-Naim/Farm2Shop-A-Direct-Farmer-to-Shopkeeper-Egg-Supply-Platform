import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import MarketplaceProductCard from "../../components/shopkeeper/MarketplaceProductCard";

const Marketplace = () => {

  const { backendUrl } = useContext(AppContext);

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [sortOption, setSortOption] = useState("newest");

const fetchProducts = async () => {
  try {
    setLoading(true);

    const { data } = await axios.get(
      `${backendUrl}/api/products`
    );

    if (data.success) {
      setProducts(data.products);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Fetch marketplace products error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to load marketplace products."
    );
  } finally {
    setLoading(false);
  }
};

// Filtered Products based on search term and selected category
const filteredProducts = products.filter((product) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    !search ||
    product.productName?.toLowerCase().includes(search) ||
    product.category?.category?.toLowerCase().includes(search) ||
    product.farmer?.name?.toLowerCase().includes(search) ||
    product.farmer?.farmName?.toLowerCase().includes(search);

  const matchesCategory =
    !selectedCategory ||
    product.category?._id === selectedCategory;

  return matchesSearch && matchesCategory;
});

// Sort the filtered products based on the selected sort option
const sortedProducts = [...filteredProducts].sort(
  (a, b) => {
    if (sortOption === "price-low") {
      return (
        (a.category?.price || 0) -
        (b.category?.price || 0)
      );
    }

    if (sortOption === "price-high") {
      return (
        (b.category?.price || 0) -
        (a.category?.price || 0)
      );
    }

    // Newest
    return (
      new Date(b.createdAt) -
      new Date(a.createdAt)
    );
  }
);

//Fetch categories for filter dropdown
const fetchCategories = async () => {
  try {
    const { data } = await axios.get(
      `${backendUrl}/api/categories`
    );

    if (data.success) {
      setCategories(data.categories);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Fetch categories error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to load categories."
    );
  }
};



useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);

const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="min-h-screen bg-[#f5f7f4] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mt-10 mb-5 flex items-end justify-between">
  <div>
    <div className="flex items-center gap-3">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Products
      </h2>

      {!loading && (
        <span className="px-2.5 py-1 rounded-full bg-[#176B3A]/10 text-[#176B3A] text-xs font-semibold">
          {filteredProducts.length}
        </span>
      )}
    </div>

    <p className="text-sm text-gray-500 mt-1">
      Browse products currently available from farmers.
    </p>
  </div>
</div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-gray-400 text-lg">🔍</span>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, farmers or farms..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
              />
            </div>

            {/* Category */}
<select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="h-12 lg:w-52 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
>
  <option value="">
    All Categories
  </option>

  {categories.map((category) => (
    <option
      key={category._id}
      value={category._id}
    >
      {category.category}
    </option>
  ))}
</select>

            {/* Sort */}
<select
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
  className="h-12 lg:w-48 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
>
  <option value="newest">
    Newest
  </option>

  <option value="price-low">
    Price: Low to High
  </option>

  <option value="price-high">
    Price: High to Low
  </option>
</select>
          </div>
        </div>

        {/* Products Header */}
        <div className="mt-10 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Products
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Browse products currently available from farmers.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Temporary Product Card */}
          {loading ? (
  skeletonCards.map((_, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
    >
      <div className="h-56 bg-gray-200" />

      <div className="p-5">
        <div className="h-3 w-16 bg-gray-200 rounded" />

        <div className="mt-3 h-5 w-3/4 bg-gray-200 rounded" />

        <div className="mt-4 h-7 w-24 bg-gray-200 rounded" />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>

        <div className="mt-4 h-10 bg-gray-100 rounded-xl" />

        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  ))
          ) : sortedProducts.length === 0 ? (
<div className="col-span-full flex justify-center py-16">
  <div className="max-w-md text-center">

    <div className="mx-auto w-16 h-16 rounded-2xl bg-[#176B3A]/10 flex items-center justify-center text-2xl">
      🔎
    </div>

    <h3 className="mt-5 text-xl font-bold text-gray-800">
      No products found
    </h3>

    <p className="mt-2 text-sm text-gray-500 leading-6">
      We couldn't find any products matching your search or
      selected category.
    </p>

    {(searchTerm || selectedCategory) && (
      <button
        onClick={() => {
          setSearchTerm("");
          setSelectedCategory("");
        }}
        className="mt-5 px-5 py-2.5 rounded-xl bg-[#176B3A] text-white text-sm font-semibold hover:bg-[#12582f] transition"
      >
        Clear Filters
      </button>
    )}

  </div>
</div>
          ) : (
sortedProducts.map((product) => (
  <MarketplaceProductCard
    key={product._id}
    product={product}
  />
))
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;