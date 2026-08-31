import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppContext } from "./context/AppContext";
import HowItWorks from "./components/HowItWorks";
import ForFarmers from "./components/ForFarmers";
import ForShopkeepers from "./components/ForShopkeepers";
import About from "./components/About";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
import MyStock from "./pages/Farmer/MyStock";
import Orders from "./pages/Farmer/Orders";
import Earnings from "./pages/Farmer/Earnings";
import ShopkeeperDashboard from "./pages/Shopkeeper/ShopkeeperDashboard";
import Marketplace from "./pages/Shopkeeper/Marketplace";
import MyOrders from "./pages/Shopkeeper/MyOrders";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicOnlyRoute from "./Routes/PublicOnlyRoute";
import FarmerProfile from "./pages/Farmer/FarmerProfile";
import ShopkeeperProfile from "./pages/Shopkeeper/ShopkeeperProfile";
import FarmerProductDetails from "./pages/Farmer/FarmerProductDetails";
import EditProduct from "./pages/Farmer/EditProduct";
import ProductDetails from "./pages/Shopkeeper/ProductDetails";
import AddProduct from "./pages/Farmer/AddProduct";
import OrderPlacement from "./pages/Shopkeeper/OrderPlacement";
import ShopkeeperOrderDetails from "./pages/Shopkeeper/ShopkeeperOrderDetails";
import FarmerOrderDetails from "./pages/Farmer/FarmerOrderDetails";
import PaymentSuccess from "./pages/Shopkeeper/PaymentSuccess";
import PaymentFail from "./pages/Shopkeeper/PaymentFail";
import PaymentCancel from "./pages/Shopkeeper/PaymentCancel";

const App = () => {
  const { loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-farmers" element={<ForFarmers />} />
          <Route path="/for-shopkeepers" element={<ForShopkeepers />} />
          <Route path="/about" element={<About />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Farmer protected routes */}
          <Route element={<ProtectedRoute allowedRole="farmer" />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/stock" element={<MyStock />} />
            <Route path="/farmer/orders" element={<Orders />} />
            <Route path="/farmer/earnings" element={<Earnings />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route
              path="/farmer/product/:productId"
              element={<FarmerProductDetails />}
            />
            <Route
              path="/farmer/edit-product/:productId"
              element={<EditProduct />}
            />

            <Route path="/farmer/add-product" element={<AddProduct />} />
            <Route
              path="/farmer/order/:orderId"
              element={<FarmerOrderDetails />}
            />
          </Route>

          {/* Shopkeeper protected routes */}
          <Route element={<ProtectedRoute allowedRole="shopkeeper" />}>
            <Route
              path="/shopkeeper/dashboard"
              element={<ShopkeeperDashboard />}
            />
            <Route path="/shopkeeper/marketplace" element={<Marketplace />} />
            <Route path="/shopkeeper/orders" element={<MyOrders />} />
            <Route path="/shopkeeper/profile" element={<ShopkeeperProfile />} />
            <Route
              path="/shopkeeper/product/:productId"
              element={<ProductDetails />}
            />
            <Route
              path="/shopkeeper/order/:productId"
              element={<OrderPlacement />}
            />
            <Route
              path="/shopkeeper/orders/:orderId"
              element={<ShopkeeperOrderDetails />}
            />
            <Route path="/payment/success" element={<PaymentSuccess />} />

            <Route path="/payment/fail" element={<PaymentFail />} />

            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
