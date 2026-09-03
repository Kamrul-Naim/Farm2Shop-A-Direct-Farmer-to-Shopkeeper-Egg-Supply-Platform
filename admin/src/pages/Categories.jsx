import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiPower, FiPlus, FiTag } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Categories = () => {
  const { backendUrl } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryPrice, setCategoryPrice] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);
const [editCategoryName, setEditCategoryName] = useState("");
const [editCategoryPrice, setEditCategoryPrice] = useState("");
const [updatingCategory, setUpdatingCategory] = useState(false);

const [showStatusModal, setShowStatusModal] = useState(false);
const [statusCategory, setStatusCategory] = useState(null);
const [updatingStatus, setUpdatingStatus] = useState(false);

  // Get all categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/categories`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Get categories error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Toggle category status
  const handleStatusClick = (category) => {
    setStatusCategory(category);
    setShowStatusModal(true);
};

const handleToggleStatus = async () => {
    if (!statusCategory) return;

    try {
        setUpdatingStatus(true);

        const response = await axios.patch(
            `${backendUrl}/api/admin/categories/${statusCategory._id}/status`,
            {},
            {
                withCredentials: true
            }
        );

        if (response.data.success) {
            toast.success(response.data.message);

            setCategories((previousCategories) =>
                previousCategories.map((category) =>
                    category._id === statusCategory._id
                        ? response.data.category
                        : category
                )
            );

            setShowStatusModal(false);
            setStatusCategory(null);
        }
    } catch (error) {
        console.error("Toggle category status error:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to update category status."
        );
    } finally {
        setUpdatingStatus(false);
    }
};

  const filteredCategories = categories
    .filter((category) =>
      category.category.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "highToLow") {
        return b.price - a.price;
      }

      if (sortOrder === "lowToHigh") {
        return a.price - b.price;
      }

      return a.category.localeCompare(b.category);
    });

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (categoryPrice === "" || Number(categoryPrice) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setAddingCategory(true);

      const response = await axios.post(
        `${backendUrl}/api/admin/categories`,
        {
          category: categoryName.trim(),
          price: Number(categoryPrice),
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setCategories((previousCategories) => [
          response.data.category,
          ...previousCategories,
        ]);

        setCategoryName("");
        setCategoryPrice("");
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Add category error:", error);

      toast.error(error.response?.data?.message || "Failed to add category.");
    } finally {
      setAddingCategory(false);
    }
  };


  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.category);
    setEditCategoryPrice(category.price);
    setShowEditModal(true);
};

const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!editCategoryName.trim()) {
        toast.error("Category name is required.");
        return;
    }

    if (
        editCategoryPrice === "" ||
        Number(editCategoryPrice) < 0
    ) {
        toast.error("Please enter a valid price.");
        return;
    }

    try {
        setUpdatingCategory(true);

        const response = await axios.patch(
            `${backendUrl}/api/admin/categories/${editingCategory._id}`,
            {
                category: editCategoryName.trim(),
                price: Number(editCategoryPrice)
            },
            {
                withCredentials: true
            }
        );

        if (response.data.success) {
            toast.success(response.data.message);

            setCategories((previousCategories) =>
                previousCategories.map((category) =>
                    category._id === editingCategory._id
                        ? response.data.category
                        : category
                )
            );

            setShowEditModal(false);
            setEditingCategory(null);
            setEditCategoryName("");
            setEditCategoryPrice("");
        }
    } catch (error) {
        console.error("Update category error:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to update category."
        );
    } finally {
        setUpdatingCategory(false);
    }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage product categories and their prices
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#176B3A] text-white rounded-lg text-sm font-medium hover:bg-[#12582F] transition"
        >
          <FiPlus size={18} />
          Add Category
        </button>
      </div>

      {/* Search & Sort */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
            />
          </div>

          {/* Sort */}
          <div className="w-full md:w-56">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
            >
              <option value="default">Sort by Category</option>

              <option value="highToLow">Price: High to Low</option>

              <option value="lowToHigh">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Price
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FiTag size={32} className="text-gray-300" />

                      <p className="text-sm text-gray-500 mt-3">
                        No categories found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#EAF5EE] flex items-center justify-center">
                          <FiTag size={17} className="text-[#176B3A]" />
                        </div>

                        <p className="text-sm font-medium text-gray-800">
                          {category.category}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        ৳{category.price}
                      </p>

                      <p className="text-xs text-gray-400">per piece</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        {/* Edit */}
                        <button onClick={() => handleEditClick(category)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#176B3A] bg-[#EAF5EE] rounded-lg hover:bg-[#DCEFE3] transition">
                          <FiEdit size={14} />
                          Edit
                        </button>

                        {/* Activate / Deactivate */}
                        <button
                          onClick={() => handleStatusClick(category)}
                          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition ${
                            category.isActive
                              ? "text-red-600 bg-red-50 hover:bg-red-100"
                              : "text-green-600 bg-green-50 hover:bg-green-100"
                          }`}
                        >
                          <FiPower size={14} />

                          {category.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Category
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add a category and its price.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Chicken Eggs"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Egg
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={categoryPrice}
                  onChange={(e) => setCategoryPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingCategory}
                  className="px-5 py-2.5 bg-[#176B3A] text-white rounded-lg text-sm font-medium hover:bg-[#12582F] disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {addingCategory ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Edit Category
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Update category name and price.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                >
                    ×
                </button>
            </div>

            <form
                onSubmit={handleUpdateCategory}
                className="p-6 space-y-5"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name
                    </label>

                    <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) =>
                            setEditCategoryName(e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Egg
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editCategoryPrice}
                        onChange={(e) =>
                            setEditCategoryPrice(e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#176B3A] focus:ring-1 focus:ring-[#176B3A]"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={updatingCategory}
                        className="px-5 py-2.5 bg-[#176B3A] text-white rounded-lg text-sm font-medium hover:bg-[#12582F] disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {updatingCategory
                            ? "Updating..."
                            : "Update Category"}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

{showStatusModal && statusCategory && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6">

            <div className="w-12 h-12 rounded-full bg-[#EAF5EE] flex items-center justify-center mb-4">
                <FiPower
                    size={22}
                    className="text-[#176B3A]"
                />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
                {statusCategory.isActive
                    ? "Deactivate Category?"
                    : "Activate Category?"}
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-6">
                Are you sure you want to{" "}
                {statusCategory.isActive
                    ? "deactivate"
                    : "activate"}{" "}
                <span className="font-medium text-gray-700">
                    {statusCategory.category}
                </span>
                ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={() => {
                        setShowStatusModal(false);
                        setStatusCategory(null);
                    }}
                    className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={updatingStatus}
                    className={`px-5 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition ${
                        statusCategory.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-[#176B3A] hover:bg-[#12582F]"
                    }`}
                >
                    {updatingStatus
                        ? "Updating..."
                        : statusCategory.isActive
                            ? "Deactivate"
                            : "Activate"}
                </button>
            </div>
        </div>
    </div>
)}
    </div>
  );
};

export default Categories;
