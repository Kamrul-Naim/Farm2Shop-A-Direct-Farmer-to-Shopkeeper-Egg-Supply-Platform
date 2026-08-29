import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AddProduct = () => {
  const { backendUrl, user, userRole, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState("");

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-[#176B3A]/20 border-t-[#176B3A] rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "farmer") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
            🔒
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Access Denied
          </h2>

          <p className="mt-3 text-gray-500 leading-6">
            Only farmers can add products to the marketplace.
          </p>

          <button
            onClick={() => navigate("/farmer/stock")}
            className="mt-6 px-6 py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
          >
            Back to My Stock
          </button>
        </div>
      </div>
    );
  }

  if (user?.verificationStatus !== "approved") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl">
            🛡️
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Verification Required
          </h2>

          <p className="mt-3 text-gray-500 leading-6">
            Your farmer account must be approved before you can add products to
            the marketplace.
          </p>

          <div className="mt-4 inline-flex px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold capitalize">
            Status: {user?.verificationStatus || "Unknown"}
          </div>

          <button
            onClick={() => navigate("/farmer/stock")}
            className="mt-6 px-6 py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
          >
            Back to My Stock
          </button>
        </div>
      </div>
    );
  }

  if (!user?.isActive) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f7f4] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Account Inactive
          </h2>

          <p className="mt-3 text-gray-500 leading-6">
            Your farmer account is currently inactive. You cannot add products
            at this time.
          </p>

          <button
            onClick={() => navigate("/farmer/stock")}
            className="mt-6 px-6 py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
          >
            Back to My Stock
          </button>
        </div>
      </div>
    );
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const { data } = await axios.get(`${backendUrl}/api/categories`);

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load categories.",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Selected category
  const selectedCategory = categories.find((item) => item._id === category);

  // Add images
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (images.length + selectedFiles.length > 3) {
      toast.error("You can upload a maximum of 3 images.");

      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Preview URL cleanup is intentionally handled later
  // when we connect the form submission and refine
  // image handling.

  //Hanle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!productName.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a product description.");
      return;
    }

    if (images.length < 1) {
      toast.error("Please upload at least 1 image.");
      return;
    }

    if (images.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    if (quantity === "" || Number(quantity) < 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (minimumOrderQuantity === "" || Number(minimumOrderQuantity) < 1) {
      toast.error("Minimum order quantity must be at least 1.");
      return;
    }

const availableQuantity = Number(quantity);
const minOrderQuantity = Number(minimumOrderQuantity);
console.log("Available Quantity:", availableQuantity);
console.log("Minimum Order Quantity:", minOrderQuantity);

if (minOrderQuantity > availableQuantity) {
  toast.error("Minimum order quantity cannot exceed available quantity.");
  return;
}

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("productName", productName.trim());

      formData.append("category", category);

      formData.append("description", description.trim());

      formData.append("quantity", quantity);

      formData.append("minimumOrderQuantity", minimumOrderQuantity);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/products`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success("Product added successfully.");

        navigate("/farmer/stock");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Create product error:", error);

    console.log(
        "Backend response:",
        error.response?.data
    );

    console.log(
        "Backend status:",
        error.response?.status
    );

    toast.error(
        error.response?.data?.message ||
        "Failed to add product."
    );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/farmer/stock")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B3A] hover:text-[#12582f] transition"
          >
            ← Back to My Stock
          </button>

          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Add New Product
            </h1>

            <p className="mt-1 text-gray-500">
              Add fresh products to your stock for shopkeepers to purchase.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            {/* ====================== */}
            {/* IMAGE SECTION */}
            {/* ====================== */}

            <div className="p-6 sm:p-8 lg:p-10 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload 1 to 3 clear images of your product.
                </p>
              </div>

              {/* Image Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-white group"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Add Image */}
                {images.length < 3 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-[#176B3A] hover:bg-[#176B3A]/5 transition cursor-pointer flex flex-col items-center justify-center">
                    <span className="text-3xl text-gray-400">+</span>

                    <span className="mt-1 text-xs font-semibold text-gray-500">
                      Add Image
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Image requirement */}
              <div className="mt-5 rounded-2xl bg-white border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Image requirements
                </p>

                <ul className="mt-2 space-y-1 text-xs text-gray-500">
                  <li>• Minimum 1 image</li>

                  <li>• Maximum 3 images</li>

                  <li>• Maximum 5 MB per image</li>

                  <li>• Image files only</li>
                </ul>
              </div>
            </div>

            {/* ====================== */}
            {/* PRODUCT INFORMATION */}
            {/* ====================== */}

            <div className="p-6 sm:p-8 lg:p-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Provide the details of the product you are selling.
                </p>
              </div>

              {/* Product Name */}
              <div className="mt-7">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Fresh Red Eggs"
                  className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
                />
              </div>

              {/* Category */}
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loadingCategories}
                  className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition disabled:opacity-60"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Price */}
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Price
                </label>

                <div className="mt-2 h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-between">
                  <span className="text-gray-500">Price per piece</span>

                  <span className="font-bold text-[#176B3A]">
                    {selectedCategory ? `৳${selectedCategory.price}` : "—"}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Price is determined by the selected category.
                </p>
              </div>

              {/* Description */}
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the product, quality, freshness, etc."
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
                />
              </div>

              {/* Quantity */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Minimum Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={minimumOrderQuantity}
                    onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
                  />
                </div>
              </div>

              {/* Quantity hint */}
              <div className="mt-3 rounded-xl bg-[#176B3A]/5 border border-[#176B3A]/10 px-4 py-3">
                <p className="text-xs text-[#176B3A]">
                  Minimum order quantity cannot be greater than your available
                  quantity.
                </p>
              </div>

              {/* Submit */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/farmer/my-stock")}
                  className="w-full sm:w-auto px-6 h-12 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:flex-1 h-12 rounded-xl bg-[#176B3A] text-white font-bold hover:bg-[#12582f] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
