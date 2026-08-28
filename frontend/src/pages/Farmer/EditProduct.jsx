import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

const EditProduct = () => {
  const { backendUrl } = useContext(AppContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [updating, setUpdating] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/products/${productId}`,
        {
          withCredentials: true,
        },
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const fetchedProduct = data.product;

      /*
       * Do not allow editing unavailable products.
       */
      if (!fetchedProduct.isAvailable) {
        toast.error("This product is no longer available for editing.");
        navigate("/farmer/stock");
        return;
      }

      setProduct(fetchedProduct);

      setProductName(fetchedProduct.productName || "");
      setDescription(fetchedProduct.description || "");
      setQuantity(fetchedProduct.quantity ?? "");
      setMinimumOrderQuantity(fetchedProduct.minimumOrderQuantity ?? "");
      setImages(fetchedProduct.images || []);
    } catch (error) {
      console.error("Fetch product for editing error:", error);

      toast.error(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  //Remove existing images
  const handleRemoveExistingImage = (index) => {
    // Don't allow the product to have 0 images
    if (images.length + newImageFiles.length <= 1) {
      toast.error("A product must have at least 1 image.");
      return;
    }

    setImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  // Handle add images
  const handleAddImages = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) return;

    const totalImages = images.length + newImageFiles.length;

    const availableSlots = 3 - totalImages;

    if (availableSlots <= 0) {
      toast.error("You can have a maximum of 3 images.");
      event.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);

    if (selectedFiles.length > availableSlots) {
      toast.warning(
        `Only ${availableSlots} more image${
          availableSlots > 1 ? "s" : ""
        } can be added.`,
      );
    }

    const previews = filesToAdd.map((file) => URL.createObjectURL(file));

    setNewImageFiles((prev) => [...prev, ...filesToAdd]);
    setNewImagePreviews((prev) => [...prev, ...previews]);

    event.target.value = "";
  };

  //Remove newly selected images
  const handleRemoveNewImage = (index) => {
    setNewImageFiles((prevFiles) =>
      prevFiles.filter((_, fileIndex) => fileIndex !== index),
    );

    setNewImagePreviews((prevPreviews) => {
      const previewToRemove = prevPreviews[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prevPreviews.filter((_, previewIndex) => previewIndex !== index);
    });
  };

  const handleUpdateProduct = async (event) => {
  event.preventDefault();

  const totalImages =
    images.length + newImageFiles.length;

  // Frontend validation
  if (totalImages < 1) {
    toast.error("A product must have at least 1 image.");
    return;
  }

  if (totalImages > 3) {
    toast.error("A product can have a maximum of 3 images.");
    return;
  }

  if (!productName.trim()) {
    toast.error("Product name cannot be empty.");
    return;
  }

  if (!description.trim()) {
    toast.error("Product description cannot be empty.");
    return;
  }

  if (Number(quantity) < 0) {
    toast.error("Quantity cannot be negative.");
    return;
  }

  if (Number(minimumOrderQuantity) < 1) {
    toast.error(
      "Minimum order quantity must be at least 1.",
    );
    return;
  }

  if (Number(minimumOrderQuantity) > Number(quantity)) {
    toast.error(
      "Minimum order quantity cannot exceed available quantity.",
    );
    return;
  }

  try {
    setUpdating(true);

    const formData = new FormData();

    // Editable text/number fields
    formData.append("productName", productName.trim());
    formData.append("description", description.trim());
    formData.append("quantity", quantity);
    formData.append(
      "minimumOrderQuantity",
      minimumOrderQuantity,
    );

    // Existing images that the farmer kept
    images.forEach((image) => {
      formData.append("existingImages", image);
    });

    // Newly selected image files
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await axios.put(
      `${backendUrl}/api/products/${productId}`,
      formData,
      {
        withCredentials: true,
      },
    );

    if (data.success) {
      toast.success("Product updated successfully.");

      // Go to the updated product
      navigate(`/farmer/product/${productId}`);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Update product error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to update product.",
    );
  } finally {
    setUpdating(false);
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

          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f6f8f5] px-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Product not found</h2>

          <button
            onClick={() => navigate("/farmer/stock")}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#176B3A] text-white font-semibold"
          >
            Back to My Stock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5] py-8 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/farmer/product/${productId}`)}
          className="mb-6 text-sm font-semibold text-gray-600 hover:text-[#176B3A] transition"
        >
          ← Back to Product
        </button>

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>

          <p className="mt-1 text-gray-500">
            Update your product information and stock.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleUpdateProduct}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {/* Category - Read Only */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600">
                {product.category?.category || "N/A"}
              </div>
            </div>

            {/* Price - Read Only */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Price
              </label>

              <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600">
                ৳{product.category?.price ?? "N/A"} / piece
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                Price is set by the administrator.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
            />
          </div>

          {/* Quantity + Minimum Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Quantity
              </label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
              />

              <p className="mt-1.5 text-xs text-gray-400">Unit: piece</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Order Quantity
              </label>

              <input
                type="number"
                min="1"
                value={minimumOrderQuantity}
                onChange={(event) =>
                  setMinimumOrderQuantity(event.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#176B3A] focus:ring-2 focus:ring-[#176B3A]/10 transition"
              />

              <p className="mt-1.5 text-xs text-gray-400">Unit: piece</p>
            </div>
          </div>

          {/* Images */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>

            <p className="text-xs text-gray-400 mb-4">
              Add, remove or replace images. Your product must have at least 1
              and at most 3 images.
            </p>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Existing Images */}
              {images.map((image, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group"
                >
                  <img
                    src={image}
                    alt={`${product.productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    disabled={images.length + newImageFiles.length <= 1}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md transition ${
                      images.length + newImageFiles.length <= 1
                        ? "bg-gray-400/70 cursor-not-allowed"
                        : "bg-red-600/90 hover:bg-red-700"
                    }`}
                  >
                    ×
                  </button>

                  {/* Existing Label */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-[10px] font-medium">
                    Existing
                  </div>
                </div>
              ))}

              {/* New Image Previews */}
              {newImagePreviews.map((preview, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#176B3A] group"
                >
                  <img
                    src={preview}
                    alt={`New image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Remove New Image */}
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-bold flex items-center justify-center shadow-md transition"
                  >
                    ×
                  </button>

                  {/* New Label */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-[#176B3A] text-white text-[10px] font-medium">
                    New
                  </div>
                </div>
              ))}

              {/* Add Image Button */}
              {images.length + newImageFiles.length < 3 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#176B3A] hover:bg-[#f6f8f5] transition cursor-pointer flex flex-col items-center justify-center">
                  <span className="text-3xl text-gray-400">+</span>

                  <span className="mt-2 text-sm font-semibold text-gray-500">
                    Add Image
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    {3 - (images.length + newImageFiles.length)} slot
                    {3 - (images.length + newImageFiles.length) !== 1
                      ? "s"
                      : ""}{" "}
                    left
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Image Count */}
            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>{images.length + newImageFiles.length} / 3 images</span>

              {images.length + newImageFiles.length === 1 && (
                <span className="text-orange-500">
                  At least 1 image is required.
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/farmer/product/${productId}`)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
