import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const Shopkeepers = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [shopkeepers, setShopkeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const fetchShopkeepers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${backendUrl}/api/admin/shopkeepers`, {
        params: {
          search: search.trim() || undefined,
          verificationStatus: verificationStatus || undefined,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setShopkeepers(response.data.shopkeepers);
      }
    } catch (error) {
      console.error("Failed to fetch shopkeepers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopkeepers();
  }, [verificationStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShopkeepers();
  };

  const summary = useMemo(() => {
    return {
      total: shopkeepers.length,
      pending: shopkeepers.filter(
        (item) => item.verificationStatus === "pending",
      ).length,
      approved: shopkeepers.filter(
        (item) => item.verificationStatus === "approved",
      ).length,
      rejected: shopkeepers.filter(
        (item) => item.verificationStatus === "rejected",
      ).length,
    };
  }, [shopkeepers]);

  const getStatusClass = (status) => {
    if (status === "approved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <FiUsers size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Shopkeepers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage shopkeeper accounts and verification
            </p>
          </div>
        </div>

        <button
          onClick={fetchShopkeepers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
        >
          <FiRefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Shopkeepers</p>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {summary.total}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
              <FiUsers size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {summary.pending}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FiClock size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {summary.approved}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <FiCheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {summary.rejected}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <FiXCircle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row gap-3"
        >
          <div className="relative flex-1">
            <FiSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or NID..."
              className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <select
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            className="h-11 px-4 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">All Verification Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="submit"
            className="h-11 px-5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Shopkeepers</h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading shopkeepers...
          </div>
        ) : shopkeepers.length === 0 ? (
          <div className="py-16 text-center">
            <FiUsers size={32} className="mx-auto text-gray-300" />
            <p className="text-gray-500 text-sm mt-3">No shopkeepers found.</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      Shopkeeper
                    </th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      Shop
                    </th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      NID
                    </th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      Contact
                    </th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      Verification
                    </th>
                    <th className="text-left px-5 py-3.5 font-medium text-gray-500">
                      Joined
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {shopkeepers.map((shopkeeper) => (
                    <tr
                      key={shopkeeper._id}
                      onClick={() => navigate(`/shopkeepers/${shopkeeper._id}`)}
                      className="hover:bg-green-50/40 cursor-pointer transition"
                    >
                      {/* Profile + Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Profile Image */}
                          <img
                            src={shopkeeper.profileImage}
                            alt={shopkeeper.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />

                          {/* Name + Email */}
                          <div>
                            <p className="font-medium text-gray-800">
                              {shopkeeper.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {shopkeeper.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {shopkeeper.shopName}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {shopkeeper.nid}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-gray-700">{shopkeeper.phone}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                            shopkeeper.verificationStatus,
                          )}`}
                        >
                          {shopkeeper.verificationStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(shopkeeper.createdAt)}
                      </td>

                      <td className="px-3 py-4 text-gray-400">
                        <FiChevronRight size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden divide-y divide-gray-100">
              {shopkeepers.map((shopkeeper) => (
                <div
                  key={shopkeeper._id}
                  onClick={() => navigate(`/shopkeepers/${shopkeeper._id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800">
                        {shopkeeper.name}
                      </p>

                      <p className="text-sm text-gray-500 truncate mt-1">
                        {shopkeeper.shopName}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {shopkeeper.email}
                      </p>
                    </div>

                    <FiChevronRight
                      size={18}
                      className="text-gray-400 shrink-0 mt-1"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(
                        shopkeeper.verificationStatus,
                      )}`}
                    >
                      {shopkeeper.verificationStatus}
                    </span>

                    <span className="text-xs text-gray-500">
                      NID: {shopkeeper.nid}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shopkeepers;
