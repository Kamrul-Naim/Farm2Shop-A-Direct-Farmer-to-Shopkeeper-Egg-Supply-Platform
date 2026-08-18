import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { assets } from "../assets/assets";


const Hero = () => {

    const navigate = useNavigate();

    const { scrollY } = useScroll();

    const imageY = useTransform(scrollY, [0, 500], [0, 40]);
    const contentY = useTransform(scrollY, [0, 400], [0, -20]);


    return (
        <section className="relative overflow-hidden bg-[#F8FBF8]">

            {/* Decorative background element */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EAF5EE] rounded-full blur-3xl opacity-70" />

            <div className="mx-4 sm:mx-6 lg:mx-10 xl:mx-14">

                <div className="min-h-[calc(100vh-76px)] flex items-center py-14 lg:py-20">

                    <div className="w-full grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">


                        {/* ================= LEFT CONTENT ================= */}

                        <motion.div
                            style={{ y: contentY }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                ease: "easeOut"
                            }}
                            className="max-w-2xl"
                        >

                            {/* Small Label */}

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.1
                                }}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EAF5EE] text-[#176B3A] text-sm font-medium mb-6"
                            >
                                <span className="w-2 h-2 bg-[#F4A62A] rounded-full" />

                                Direct Farm-to-Shop Marketplace
                            </motion.div>


                            {/* Heading */}

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2
                                }}
                                className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-[#123B27]"
                            >
                                Fairer Egg Trade.

                                <span className="block text-[#176B3A] mt-2">
                                    Stronger Farm-to-Shop
                                </span>

                                <span className="block">
                                    Connections.
                                </span>
                            </motion.h1>


                            {/* Description */}

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.35
                                }}
                                className="mt-6 text-gray-600 text-base sm:text-lg leading-8 max-w-xl"
                            >
                                Farm2Shop connects egg farmers with verified
                                shopkeepers through a transparent,
                                quality-checked supply network.
                            </motion.p>


                            {/* CTA Buttons */}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.5
                                }}
                                className="flex flex-wrap gap-3 mt-8"
                            >

                                <button
                                    onClick={() => navigate("/register")}
                                    className="group flex items-center gap-2 px-6 py-3.5 bg-[#176B3A] text-white rounded-xl font-medium shadow-sm hover:bg-[#12572F] hover:shadow-lg transition-all duration-300"
                                >
                                    Get Started

                                    <FiArrowRight
                                        size={18}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </button>


                                <button
                                    onClick={() => navigate("/how-it-works")}
                                    className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#176B3A] hover:text-[#176B3A] transition-all duration-300"
                                >
                                    How It Works
                                </button>

                            </motion.div>


                            {/* Trust Points */}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.7
                                }}
                                className="flex flex-wrap gap-x-6 gap-y-3 mt-8"
                            >

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#EAF5EE] text-[#176B3A]">
                                        <FiCheck size={13} />
                                    </span>

                                    Quality Checked
                                </div>


                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#EAF5EE] text-[#176B3A]">
                                        <FiCheck size={13} />
                                    </span>

                                    Transparent Pricing
                                </div>


                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#EAF5EE] text-[#176B3A]">
                                        <FiCheck size={13} />
                                    </span>

                                    Direct Supply
                                </div>

                            </motion.div>

                        </motion.div>


                        {/* ================= RIGHT IMAGE ================= */}

                        <div className="relative">

                            <motion.div
                                style={{ y: imageY }}
                                initial={{
                                    opacity: 0,
                                    scale: 0.94
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.9,
                                    delay: 0.2,
                                    ease: "easeOut"
                                }}
                                className="relative"
                            >

                                {/* Image */}

                                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">

                                    <img
                                        src={assets.hero}
                                        alt="Egg farmer collecting fresh eggs"
                                        className="w-full h-[430px] sm:h-[500px] lg:h-[560px] object-cover"
                                    />

                                    {/* Soft overlay */}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                </div>


                                {/* Verified Farmer Card */}

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.9
                                    }}
                                    className="absolute top-8 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                                >

                                    <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">
                                        <FiShield size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Farm Verification
                                        </p>

                                        <p className="text-sm font-semibold text-gray-800">
                                            Verified Farmer
                                        </p>
                                    </div>

                                </motion.div>


                                {/* Quality Card */}

                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.05
                                    }}
                                    className="absolute bottom-8 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 py-3"
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-[#FFF4DD] flex items-center justify-center text-[#F4A62A]">
                                            🥚
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Quality Checked
                                            </p>

                                            <p className="text-sm font-semibold text-gray-800">
                                                Fresh & Graded Eggs
                                            </p>
                                        </div>

                                    </div>

                                </motion.div>

                            </motion.div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Hero;