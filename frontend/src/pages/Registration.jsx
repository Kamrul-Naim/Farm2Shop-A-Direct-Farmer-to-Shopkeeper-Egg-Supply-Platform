import React, { useContext, useState } from "react";
import FarmerRegistrationForm from "../components/FarmerRegistrationForm";
import ShopkeeperRegistrationForm from "../components/ShopkeeperRegistrationForm";
import { AppContext } from "../context/AppContext";

const Registration = () => {

  const {role,setRole}=useContext(AppContext)

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {role === "farmer"
              ? "Farmer Registration"
              : "Shopkeeper Registration"}
          </h1>

          <p className="text-gray-500 mt-2">
            {role === "farmer"
              ? "Join Farm2Shop and connect your farm with local shops."
              : "Join Farm2Shop and source fresh eggs directly from farmers."}
          </p>
        </div>

        {/* Registration Card */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          {role === "farmer" ? (
            <FarmerRegistrationForm />
          ) : (
            <ShopkeeperRegistrationForm />
          )}

          {/* Role Switch */}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            {role === "farmer" ? (
              <p className="text-sm text-gray-500">
                Want to register as a Shopkeeper?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setRole("shopkeeper");
                    window.scrollTo(0, 0);
                  }}
                  className="font-semibold text-[#176B3A] hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Want to register as a Farmer?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setRole("farmer");
                    window.scrollTo(0, 0);
                  }}
                  className="font-semibold text-[#176B3A] hover:underline"
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;