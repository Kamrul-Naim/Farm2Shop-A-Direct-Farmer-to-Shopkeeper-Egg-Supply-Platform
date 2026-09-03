import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const GuestRoute = ({ children }) => {

    const { admin, loading } = useContext(AppContext);

    // Wait for authentication check
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    // Already logged in
    if (admin) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in
    return children;
};

export default GuestRoute;