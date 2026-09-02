import { useContext } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const AdminNavbar = ({ setSidebarOpen }) => {

    const { admin, logoutAdmin } = useContext(AppContext);

    return (
        <header className="h-16 bg-gradient-to-r from-white via-green-50/40 to-green-50 border-b border-green-100 shadow-sm flex items-center justify-between px-4 sm:px-6">

            {/* Mobile menu */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-[#176B3A] hover:bg-green-100 transition mr-4"
            >
                <FiMenu size={22} />
            </button>


            {/* Page / Admin information */}
            <div className="hidden sm:block">

                <p className="text-xs font-medium text-[#176B3A] uppercase tracking-wide">
                    Admin Panel
                </p>

                <p className="text-sm font-semibold text-gray-800">
                    Welcome, <span className="text-[#176B3A]">{admin?.name}</span>
                </p>

            </div>


            {/* Right */}
            <div className="flex items-center gap-3 ml-auto">

                <div className="hidden sm:block text-right">

                    <p className="text-sm font-semibold text-gray-800">
                        {admin?.name}
                    </p>

                    <p className="text-xs font-medium text-[#176B3A]">
                        Administrator
                    </p>

                </div>


                {/* Admin avatar */}
                <div className="hidden sm:flex w-9 h-9 rounded-full bg-[#176B3A] text-white items-center justify-center font-semibold text-sm shadow-sm">
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>


                {/* Logout */}
                <button
                    onClick={logoutAdmin}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                >
                    <FiLogOut size={18} />

                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>

            </div>

        </header>
    );
};

export default AdminNavbar;