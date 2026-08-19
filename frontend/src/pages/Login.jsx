import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FarmerLoginForm from "../components/FarmerLoginForm";
import ShopkeeperLoginForm from "../components/ShopkeeperLoginForm";

const Login = () => {

  const { role, setRole } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12">

      <div className="w-full max-w-md">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {role === "farmer"
              ? "Farmer Login"
              : "Shopkeeper Login"}
          </h1>

          <p className="text-gray-500 mt-2">
            {role === "farmer"
              ? "Welcome back. Manage your farm with Farm2Shop."
              : "Welcome back. Manage your shop with Farm2Shop."}
          </p>

        </div>


        {/* Login Card */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

          {role === "farmer" ? (
            <FarmerLoginForm />
          ) : (
            <ShopkeeperLoginForm />
          )}


          {/* Role Switch */}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">

            {role === "farmer" ? (

              <p className="text-sm text-gray-500">
                Are you a Shopkeeper?{" "}

                <button
                  type="button"
                  onClick={() => setRole("shopkeeper")}
                  className="font-semibold text-[#176B3A] hover:underline"
                >
                  Login here
                </button>
              </p>

            ) : (

              <p className="text-sm text-gray-500">
                Are you a Farmer?{" "}

                <button
                  type="button"
                  onClick={() => setRole("farmer")}
                  className="font-semibold text-[#176B3A] hover:underline"
                >
                  Login here
                </button>
              </p>

            )}

          </div>

        </div>


        {/* Registration Link */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-[#176B3A] hover:underline"
          >
            Register here
          </button>

        </p>

      </div>

    </div>
  );
};

export default Login;