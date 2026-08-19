import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiBell, FiUser, FiChevronDown } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const { roleState,logoutUser,user,userRole } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Guest navigation
  const guestLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "For Farmers", path: "/for-farmers" },
    { name: "For Shopkeepers", path: "/for-shopkeepers" },
    { name: "About", path: "/about" },
  ];

  // Farmer navigation
  const farmerLinks = [
    { name: "Dashboard", path: "/farmer/dashboard" },
    { name: "My Stock", path: "/farmer/stock" },
    { name: "Orders", path: "/farmer/orders" },
    { name: "Earnings", path: "/farmer/earnings" },
  ];

  // Shopkeeper navigation
  const shopkeeperLinks = [
    { name: "Dashboard", path: "/shopkeeper/dashboard" },
    { name: "Marketplace", path: "/shopkeeper/marketplace" },
    { name: "My Orders", path: "/shopkeeper/orders" },
  ];

  let links = guestLinks;

  if (userRole === "farmer") {
    links = farmerLinks;
  }

  if (userRole === "shopkeeper") {
    links = shopkeeperLinks;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <nav className="w-full">
        <div className="mx-4 sm:mx-6 lg:mx-10 xl:mx-14 h-[76px] flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" onClick={closeMenu} className="flex items-center">
            <img
              src={assets.logo}
              alt="Farm2Shop"
              className="w-[170px] sm:w-[190px] object-contain"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-[15px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#176B3A]"
                      : "text-gray-600 hover:text-[#176B3A]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-[#F4A62A] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Guest */}
            {!user && (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 text-sm font-medium text-[#176B3A] border border-[#176B3A] rounded-lg hover:bg-[#176B3A] hover:text-white transition-all duration-300"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#176B3A] rounded-lg hover:bg-[#12572F] hover:shadow-md transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Logged in */}
            {user && (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-[#176B3A] transition-colors">
                  <FiBell size={20} />

                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4A62A] rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={assets.profile_pic}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />

                    <FiChevronDown
                      size={16}
                      className="text-gray-500 transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {userRole === "farmer"
                          ? "Farmer Account"
                          : "Shopkeeper Account"}
                      </p>

                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {userRole}
                      </p>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() =>
                          navigate(
                            userRole === "farmer"
                              ? "/farmer/profile"
                              : "/shopkeeper/profile",
                          )
                        }
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-[#EAF5EE] hover:text-[#176B3A] transition-colors"
                      >
                        My Profile
                      </button>

                      <button
                        onClick={async () => {
                          const success = await logoutUser();

                          if (success) {
                            navigate("/");
                          }
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#176B3A] transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
          }`}
        >
          <div className="mx-4 sm:mx-[6%] py-4 flex flex-col">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EAF5EE] text-[#176B3A]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#176B3A]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Guest Mobile Buttons */}
            {!user && (
              <div className="flex gap-3 pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                  className="flex-1 py-2.5 text-sm font-medium text-[#176B3A] border border-[#176B3A] rounded-lg hover:bg-[#176B3A] hover:text-white transition-all duration-300"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-[#176B3A] rounded-lg hover:bg-[#12572F] hover:shadow-md transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Logged-in Mobile */}
            {user && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {/* User Information */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={assets.logo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {userRole === "farmer"
                        ? "Farmer Account"
                        : "Shopkeeper Account"}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {userRole}
                    </p>
                  </div>

                  {/* Notification */}
                  <button className="relative ml-auto p-2 text-gray-500 hover:text-[#176B3A] transition-colors">
                    <FiBell size={19} />

                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4A62A] rounded-full" />
                  </button>
                </div>

                {/* Profile Actions */}
                <div className="mt-2 px-3 space-y-1">
                  <button
                    onClick={() => {
                      navigate(
                        userRole === "farmer"
                          ? "/farmer/profile"
                          : "/shopkeeper/profile",
                      );
                      closeMenu();
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-[#EAF5EE] hover:text-[#176B3A] transition-colors"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={async () => {
                      const success = await logoutUser();

                      if (success) {
                        closeMenu();
                        navigate("/");
                      }
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
