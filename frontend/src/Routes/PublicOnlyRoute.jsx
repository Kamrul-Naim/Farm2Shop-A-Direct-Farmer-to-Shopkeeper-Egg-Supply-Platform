import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PublicOnlyRoute = () => {
  const { user, userRole } = useContext(AppContext);

  if (user) {
    if (userRole === "farmer") {
      return <Navigate to="/farmer/dashboard" replace />;
    }

    if (userRole === "shopkeeper") {
      return <Navigate to="/shopkeeper/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicOnlyRoute;