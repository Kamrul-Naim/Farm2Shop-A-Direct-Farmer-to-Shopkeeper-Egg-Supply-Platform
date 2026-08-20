import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const FarmerProfile = () => {
  const { user, updateProfile } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [farmDescription, setFarmDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep form values synchronized with current user
  useEffect(() => {
    if (user) {
      setFarmDescription(user.farmDescription || "");
      setPreviewImage(user.profileImage || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setFarmDescription(user?.farmDescription || "");
    setProfileImage(null);
    setPreviewImage(user?.profileImage || "");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("farmDescription", farmDescription);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        setProfileImage(null);
        setIsEditing(false);
      }

    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage your farmer profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >

        {/* Profile Header */}
        <div className="p-8 border-b border-gray-100">

          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Profile Image */}
            <div className="relative">

              <img
                src={
                  previewImage ||
                  assets.profile_pic
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-100"
              />

              {isEditing && (
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0
                             bg-[#176B3A] text-white
                             px-3 py-1.5 rounded-full
                             text-xs font-medium cursor-pointer"
                >
                  Change
                </label>
              )}

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>

            {/* Basic information */}
            <div className="text-center sm:text-left">

              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <p className="text-gray-500">
                Farmer
              </p>

              <span className="inline-block mt-2 px-3 py-1 rounded-full
                               text-sm font-medium
                               bg-green-100 text-green-700 capitalize">
                {user.verificationStatus}
              </span>

            </div>

          </div>

        </div>


        {/* Personal Information */}
        <div className="p-8 border-b border-gray-100">

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Name
              </label>

              <input
                type="text"
                value={user.name || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone
              </label>

              <input
                type="text"
                value={user.phone || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                NID
              </label>

              <input
                type="text"
                value={user.nid || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500"
              />
            </div>

          </div>

        </div>


        {/* Farm Information */}
        <div className="p-8">

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Farm Information
          </h3>

          <div className="space-y-6">

            {/* Farm Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Farm Name
              </label>

              <input
                type="text"
                value={user.farmName || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500"
              />
            </div>


            {/* Farm Address */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Farm Address
              </label>

              <textarea
                value={user.farmAddress || ""}
                disabled
                rows="3"
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-200
                           bg-gray-100 text-gray-500 resize-none"
              />
            </div>


            {/* Farm Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Farm Description
              </label>

              {isEditing ? (
                <textarea
                  value={farmDescription}
                  onChange={(e) => setFarmDescription(e.target.value)}
                  rows="4"
                  placeholder="Tell people about your farm..."
                  className="w-full px-4 py-3 rounded-xl
                             border border-gray-200
                             outline-none resize-none
                             focus:border-[#176B3A]
                             focus:ring-1 focus:ring-[#176B3A]"
                />
              ) : (
                <div className="w-full px-4 py-3 rounded-xl
                                border border-gray-200
                                min-h-[100px] text-gray-600">
                  {user.farmDescription || "No description added yet."}
                </div>
              )}

            </div>

          </div>

        </div>


        {/* Actions */}
        <div className="px-8 py-6 bg-gray-50 flex justify-end gap-3">

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-[#176B3A] text-white
                         rounded-xl font-semibold
                         hover:bg-[#12582f] transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300
                           text-gray-700 rounded-xl font-semibold
                           hover:bg-gray-100 transition
                           disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#176B3A] text-white
                           rounded-xl font-semibold
                           hover:bg-[#12582f] transition
                           disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}

        </div>

      </form>

    </div>
  );
};

export default FarmerProfile;