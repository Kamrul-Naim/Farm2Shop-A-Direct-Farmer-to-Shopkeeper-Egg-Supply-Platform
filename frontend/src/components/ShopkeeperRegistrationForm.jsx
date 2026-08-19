import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ShopkeeperRegistrationForm = () => {

  const { registerShopkeeper } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nid: "",
    shopName: "",
    shopAddress: "",
    shopDescription: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("nid", formData.nid);
      data.append("shopName", formData.shopName);
      data.append("shopAddress", formData.shopAddress);
      data.append("shopDescription", formData.shopDescription);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }


      const result = await registerShopkeeper(data);


      if (result.success) {
        navigate("/login");
      }

    } finally {

      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Profile Image */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-500
                     file:mr-4 file:py-2.5 file:px-4
                     file:rounded-lg file:border-0
                     file:bg-[#EAF5EE] file:text-[#176B3A]
                     file:font-medium
                     hover:file:bg-[#dcefe3]"
        />

        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG or other image formats
        </p>

      </div>


      {/* Name */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Email + Phone */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 border border-gray-200
                       rounded-xl outline-none
                       focus:border-[#176B3A]"
          />

        </div>


        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            required
            className="w-full px-4 py-3 border border-gray-200
                       rounded-xl outline-none
                       focus:border-[#176B3A]"
          />

        </div>

      </div>


      {/* NID */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          NID Number
        </label>

        <input
          type="text"
          name="nid"
          value={formData.nid}
          onChange={handleChange}
          placeholder="Enter your NID number"
          required
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Password */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Shop Name */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shop Name
        </label>

        <input
          type="text"
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          placeholder="Enter your shop name"
          required
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Shop Address */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shop Address
        </label>

        <textarea
          name="shopAddress"
          value={formData.shopAddress}
          onChange={handleChange}
          placeholder="Enter your shop address"
          rows={3}
          required
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none resize-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Shop Description */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shop Description
          <span className="text-gray-400 font-normal">
            {" "}(Optional)
          </span>
        </label>

        <textarea
          name="shopDescription"
          value={formData.shopDescription}
          onChange={handleChange}
          placeholder="Tell us briefly about your shop"
          rows={3}
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none resize-none
                     focus:border-[#176B3A]"
        />

      </div>


      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#176B3A] text-white
                   rounded-xl font-semibold
                   hover:bg-[#12582f] transition
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? "Creating Account..."
          : "Create Shopkeeper Account"}
      </button>

    </form>
  );
};

export default ShopkeeperRegistrationForm;