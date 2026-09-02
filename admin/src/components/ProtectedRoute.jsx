import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {

    const { admin, loading } = useContext(AppContext);

    // Wait until authentication check is complete
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    // Not authenticated
    if (!admin) {
        return <Navigate to="/" replace />;
    }

    // Authenticated
    return children;
};

export default ProtectedRoute;