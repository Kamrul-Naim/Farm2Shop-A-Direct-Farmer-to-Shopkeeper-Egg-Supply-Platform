import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);


    // Get currently logged-in admin
    const getCurrentAdmin = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/me`,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setAdmin(response.data.admin);
            }

        } catch (error) {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };


    // Admin login
    const loginAdmin = async (email, password) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/login`,
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setAdmin(response.data.admin);
                

                toast.success(response.data.message);

                return true;
            }

            toast.error(response.data.message);

            return false;

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Admin login failed."
            );

            return false;
        }
    };


    // Admin logout
    const logoutAdmin = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/logout`,
                {},
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setAdmin(null);

                toast.success(response.data.message);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Admin logout failed."
            );
        }
    };


    // Check authentication when admin app starts
    useEffect(() => {
        getCurrentAdmin();
    }, []);


    const value = {
        backendUrl,
        admin,
        setAdmin,
        loading,
        loginAdmin,
        logoutAdmin,
        getCurrentAdmin
    };


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;