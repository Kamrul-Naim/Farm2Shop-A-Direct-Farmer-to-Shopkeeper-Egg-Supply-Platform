import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiTag,
    FiShoppingBag,
    FiUsers,
    FiUser,
    FiDollarSign,
    FiX
} from "react-icons/fi";
import { assets } from "../assets/assets";

const AdminSidebar = ({
    sidebarOpen,
    setSidebarOpen
}) => {

    const links = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: FiHome
        },
        {
            name: "Categories",
            path: "/categories",
            icon: FiTag
        },
        {
            name: "Orders",
            path: "/orders",
            icon: FiShoppingBag
        },
        {
            name: "Shopkeepers",
            path: "/shopkeepers",
            icon: FiUsers
        },
        {
            name: "Farmers",
            path: "/farmers",
            icon: FiUser
        },
        {
            name: "Earnings",
            path: "/earnings",
            icon: FiDollarSign
        }
    ];


    return (
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        <aside
          className={`
                    fixed top-0 left-0 z-50
                    w-64 h-screen
                    bg-white border-r border-gray-200
                    transition-transform duration-300
                    lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
        >
{/* Logo */}
<div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">

  <div className="flex flex-col">

    <img
      src={assets.logo}
      alt="Farm2Shop"
      className="w-40 h-12 object-contain object-left"
    />

    <p className="text-xs text-gray-400 -mt-1">
      Admin Panel
    </p>

  </div>

  <button
    onClick={() => setSidebarOpen(false)}
    className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
  >
    <FiX size={20} />
  </button>

</div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-[#EAF5EE] text-[#176B3A]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#176B3A]"
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
      </>
    );
};

export default AdminSidebar;