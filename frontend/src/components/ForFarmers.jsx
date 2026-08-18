import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import {
    FiArrowRight,
    FiCheckCircle,
    FiDollarSign,
    FiTruck,
    FiUsers
} from "react-icons/fi";

const benefits = [
    {
        icon: FiUsers,
        title: "Direct Market Access",
        description:
            "Connect directly with verified shopkeepers without depending on unnecessary middlemen."
    },
    {
        icon: FiDollarSign,
        title: "Transparent Pricing",
        description:
            "Egg prices are managed according to the applicable government rate for a clearer and fairer process."
    },
    {
        icon: FiCheckCircle,
        title: "Quality Verified",
        description:
            "Our team checks egg quality, grade and quantity when collecting your products."
    },
    {
        icon: FiTruck,
        title: "We Collect From You",
        description:
            "You don't have to arrange delivery. Our team collects the eggs directly from your farm."
    }
];

const ForFarmers = () => {
    return (
        <section
            id="for-farmers"
            className="relative overflow-hidden bg-[#F7FAF8] py-20 sm:py-24 lg:py-28 scroll-mt-24"
        >

            {/* Background decoration */}

            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#EAF5EE] blur-3xl opacity-70 pointer-events-none" />

            <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#FFF4DF] blur-3xl opacity-60 pointer-events-none" />


            <div className="relative mx-4 sm:mx-6 lg:mx-10 xl:mx-14">

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ================= IMAGE ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -60
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0
                        }}
                        viewport={{
                            once: true,
                            amount: 0.25
                        }}
                        transition={{
                            duration: 0.7,
                            ease: "easeOut"
                        }}
                        className="relative"
                    >

                        {/* Main image */}

                        <div className="relative overflow-hidden rounded-[2rem] shadow-xl">

                            <img
                                src={assets.farmer}
                                alt="Farmer with fresh eggs"
                                className="w-full h-[380px] sm:h-[460px] lg:h-[520px] object-cover"
                            />

                            {/* Image overlay */}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#123B27]/60 via-transparent to-transparent" />

                        </div>


                        {/* Floating quality card */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.5
                            }}
                            className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3"
                        >

                            <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">
                                <FiCheckCircle size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#123B27]">
                                    Quality Checked
                                </p>

                                <p className="text-xs text-gray-500">
                                    Before reaching shops
                                </p>
                            </div>

                        </motion.div>


                        {/* Decorative circle */}

                        <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full border-[10px] border-[#F4A62A]/20 pointer-events-none" />

                    </motion.div>


                    {/* ================= CONTENT ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 60
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0
                        }}
                        viewport={{
                            once: true,
                            amount: 0.25
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                    >

                        {/* Badge */}

                        <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EAF5EE] text-[#176B3A] text-sm font-medium">

                            <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />

                            For Farmers

                        </span>


                        {/* Heading */}

                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123B27] leading-tight">

                            Sell directly.
                            <br />

                            <span className="text-[#176B3A]">
                                Grow with confidence.
                            </span>

                        </h2>


                        {/* Description */}

                        <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base max-w-xl">
                            Farm2Shop gives egg farmers a direct connection
                            with verified shopkeepers, helping create a more
                            transparent and organized way to sell eggs.
                        </p>


                        {/* Benefits */}

                        <div className="mt-8 grid sm:grid-cols-2 gap-5">

                            {benefits.map((benefit, index) => {

                                const Icon = benefit.icon;

                                return (
                                    <motion.div
                                        key={benefit.title}
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        viewport={{
                                            once: true,
                                            amount: 0.2
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2 + index * 0.1
                                        }}
                                        className="group"
                                    >

                                        <div className="flex gap-3">

                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-[#E2ECE5] flex items-center justify-center text-[#176B3A] group-hover:bg-[#176B3A] group-hover:text-white transition-all duration-300">

                                                <Icon size={19} />

                                            </div>

                                            <div>

                                                <h3 className="text-sm font-semibold text-[#123B27]">
                                                    {benefit.title}
                                                </h3>

                                                <p className="mt-1.5 text-xs sm:text-sm leading-5 text-gray-500">
                                                    {benefit.description}
                                                </p>

                                            </div>

                                        </div>

                                    </motion.div>
                                );
                            })}

                        </div>


                        {/* CTA */}

                        <motion.button
                            whileHover={{
                                x: 4
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            onClick={() => {
                                // Registration route will be connected later
                            }}
                            className="mt-9 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#176B3A] text-white text-sm font-medium hover:bg-[#12572F] hover:shadow-lg transition-all duration-300"
                        >

                            Join as a Farmer

                            <FiArrowRight size={17} />

                        </motion.button>

                    </motion.div>

                </div>

            </div>

        </section>
    );
};

export default ForFarmers;