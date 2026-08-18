import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiArrowUp,
    FiFacebook,
    FiInstagram,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiPhone
} from "react-icons/fi";

const Footer = () => {

    const navigate = useNavigate();

    const scrollToSection = (id) => {

        if (window.location.pathname !== "/") {
            navigate("/");

            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth"
                });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({
                behavior: "smooth"
            });
        }
    };


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    return (
        <footer className="bg-[#123B27] text-white mt-12">

            {/* ================= MAIN FOOTER ================= */}

            <div className="mx-4 sm:mx-6 lg:mx-10 xl:mx-14 py-14 sm:py-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">


                    {/* ================= BRAND ================= */}

                    <div className="lg:col-span-1">

                        <button
                            onClick={scrollToTop}
                            className="text-2xl font-bold tracking-tight"
                        >
                            Farm
                            <span className="text-[#F4A62A]">
                                2
                            </span>
                            Shop
                        </button>


                        <p className="mt-4 text-sm text-white/65 leading-6 max-w-xs">
                            Connecting egg farmers and shopkeepers through
                            a simpler, more transparent and organized supply
                            chain.
                        </p>


                        {/* Social icons */}

                        <div className="mt-6 flex items-center gap-3">

                            <button
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#F4A62A] hover:text-[#123B27] transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <FiFacebook size={17} />
                            </button>

                            <button
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#F4A62A] hover:text-[#123B27] transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <FiInstagram size={17} />
                            </button>

                            <button
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#F4A62A] hover:text-[#123B27] transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin size={17} />
                            </button>

                        </div>

                    </div>


                    {/* ================= QUICK LINKS ================= */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Quick Links
                        </h3>

                        <div className="mt-5 space-y-3">

                            <button
                                onClick={() => scrollToSection("home")}
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                Home
                            </button>

                            <NavLink
                                to="/how-it-works"
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                How It Works
                            </NavLink>

                            <button
                                onClick={() => scrollToSection("about")}
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                About
                            </button>

                        </div>

                    </div>


                    {/* ================= FOR USERS ================= */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            For Users
                        </h3>

                        <div className="mt-5 space-y-3">

                            <button
                                onClick={() => scrollToSection("for-farmers")}
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                For Farmers
                            </button>

                            <button
                                onClick={() => scrollToSection("for-shopkeepers")}
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                For Shopkeepers
                            </button>

                            <button
                                onClick={() => scrollToSection("why-farm2shop")}
                                className="block text-sm text-white/60 hover:text-[#F4A62A] transition-colors"
                            >
                                Why Farm2Shop
                            </button>

                        </div>

                    </div>


                    {/* ================= CONTACT ================= */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Contact
                        </h3>


                        <div className="mt-5 space-y-4">

                            <div className="flex items-start gap-3">

                                <FiMail
                                    size={17}
                                    className="mt-0.5 text-[#F4A62A] shrink-0"
                                />

                                <span className="text-sm text-white/60">
                                    support@farm2shop.com
                                </span>

                            </div>


                            <div className="flex items-start gap-3">

                                <FiPhone
                                    size={17}
                                    className="mt-0.5 text-[#F4A62A] shrink-0"
                                />

                                <span className="text-sm text-white/60">
                                    +880 1XXX-XXXXXX
                                </span>

                            </div>


                            <div className="flex items-start gap-3">

                                <FiMapPin
                                    size={17}
                                    className="mt-0.5 text-[#F4A62A] shrink-0"
                                />

                                <span className="text-sm text-white/60">
                                    Bangladesh
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= BOTTOM BAR ================= */}

            <div className="border-t border-white/10">

                <div className="mx-4 sm:mx-6 lg:mx-10 xl:mx-14 py-5">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <p className="text-xs text-white/45 text-center sm:text-left">
                            © {new Date().getFullYear()} Farm2Shop. All rights reserved.
                        </p>


                        <div className="flex items-center gap-5">

                            <button className="text-xs text-white/45 hover:text-white transition-colors">
                                Privacy Policy
                            </button>

                            <button className="text-xs text-white/45 hover:text-white transition-colors">
                                Terms & Conditions
                            </button>

                        </div>


                        {/* Back to top */}

                        <button
                            onClick={scrollToTop}
                            className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#F4A62A] hover:text-[#123B27] transition-all duration-300"
                            aria-label="Back to top"
                        >
                            <FiArrowUp size={17} />
                        </button>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;