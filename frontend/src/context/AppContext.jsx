import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [roleState, setRoleState] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setRoleState("");

        toast.success(response.data.message);

        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to logout.");

      return false;
    }
  };

  // Farmer registration
 const registerFarmer = async (formData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/farmers/register`,
      formData,
      {
        withCredentials: true,
      },
    );

    if (response.data.success) {
      toast.success(response.data.message);
    }

    return response.data;

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Farmer registration failed."
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Farmer registration failed.",
    };
  }
};

  // Shopkeeper registration
  const registerShopkeeper = async (formData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/shopkeepers/register`,
      formData,
      {
        withCredentials: true,
      },
    );

    if (response.data.success) {
      toast.success(response.data.message);
    }

    return response.data;

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Shopkeeper registration failed."
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Shopkeeper registration failed.",
    };
  }
};

  const value = {
    roleState,
    setRoleState,
    logoutUser,
    registerFarmer,
    registerShopkeeper,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
