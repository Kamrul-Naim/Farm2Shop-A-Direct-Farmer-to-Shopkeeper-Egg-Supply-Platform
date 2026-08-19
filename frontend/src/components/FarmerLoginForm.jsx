import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const FarmerLoginForm = () => {

  const { loginFarmer, setRole,user,setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const result = await loginFarmer(
        formData.email,
        formData.password
      );

      if (result.success) {

        setRole("farmer");
        setUser(result.user);
        navigate("/farmer/dashboard");
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

      {/* Email */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]
                     focus:ring-1 focus:ring-[#176B3A]"
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
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-gray-200
                     rounded-xl outline-none
                     focus:border-[#176B3A]
                     focus:ring-1 focus:ring-[#176B3A]"
        />

      </div>


      {/* Forgot Password */}

      <div className="flex justify-end">

        <button
          type="button"
          className="text-sm font-medium text-[#176B3A] hover:underline"
        >
          Forgot password?
        </button>

      </div>


      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#176B3A] text-white
                   rounded-xl font-semibold
                   hover:bg-[#12582f] transition
                   disabled:opacity-60
                   disabled:cursor-not-allowed"
      >
        {loading
          ? "Logging in..."
          : "Login as Farmer"}
      </button>

    </form>
  );
};

export default FarmerLoginForm;