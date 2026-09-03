import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Shopkeepers from "./pages/Shopkeepers";
import Farmers from "./pages/Farmers";
import Earnings from "./pages/Earnings";
import OrderDetails from "./pages/OrderDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminLayout from "./components/AdminLayout";

const App = () => {
    return (
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Protected Admin */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/shopkeepers" element={<Shopkeepers />} />

          <Route path="/farmers" element={<Farmers />} />

          <Route path="/earnings" element={<Earnings />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Route>
      </Routes>
    );
};

export default App
