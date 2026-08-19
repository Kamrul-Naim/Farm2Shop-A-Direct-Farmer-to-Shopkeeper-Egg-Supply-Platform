import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [roleState, setRoleState] = useState("");
  const [role, setRole] = useState("farmer");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL

// Get current user
  const getCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/auth/me`,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setUser(response.data.user);
      setUserRole(response.data.role);
    }

    return response.data;

  } catch (error) {
    setUser(null);
    setUserRole(null);

    return {
      success: false,
    };

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Logout user
  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setUser(null);
        setUserRole(null);

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


// Farmer login
const loginFarmer = async (email, password) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/farmers/login`,
      {
        email,
        password,
      },
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
        "Farmer login failed.",
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Farmer login failed.",
    };
  }
};


// Shopkeeper login
const loginShopkeeper = async (email, password) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/shopkeepers/login`,
      {
        email,
        password,
      },
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
        "Shopkeeper login failed.",
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Shopkeeper login failed.",
    };
  }
};

  const value = {
    role,setRole,
    roleState,
    setRoleState,
    user,setUser,
    logoutUser,
    registerFarmer,
    registerShopkeeper,
    loginFarmer,
    loginShopkeeper,
    loading,setLoading,
    userRole,setUserRole,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
