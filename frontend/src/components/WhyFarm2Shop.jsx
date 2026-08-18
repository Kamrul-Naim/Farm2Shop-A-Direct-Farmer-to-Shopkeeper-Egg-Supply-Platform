import React from "react";
import { motion } from "framer-motion";
import {
    FiCheckCircle,
    FiDollarSign,
    FiShield,
    FiUsers
} from "react-icons/fi";

const impacts = [
    {
        icon: FiUsers,
        title: "Better for Farmers",
        description:
            "Farmers get direct access to verified shopkeepers through an organized digital marketplace."
    },
    {
        icon: FiDollarSign,
        title: "Transparent Pricing",
        description:
            "Egg prices are managed by the admin according to the applicable government rate."
    },
    {
        icon: FiShield,
        title: "Quality Assured",
        description:
            "Our team verifies the quality, grade and quantity while collecting eggs from farmers."
    },
    {
        icon: FiCheckCircle,
        title: "Direct Supply Chain",
        description:
            "Farm2Shop connects farmers and shopkeepers while our own team handles the delivery."
    }
];

const WhyFarm2Shop = () => {
    return (
        <section
            id="why-farm2shop"
            className="relative overflow-hidden bg-[#F7FAF8] py-20 sm:py-24 lg:py-28 scroll-mt-24"
        >

            {/* Background decorations */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#EAF5EE] rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="absolute -left-24 bottom-10 w-64 h-64 bg-[#FFF4DF] rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="absolute -right-24 top-20 w-64 h-64 bg-[#EAF5EE] rounded-full blur-3xl opacity-50 pointer-events-none" />


            <div className="relative mx-4 sm:mx-6 lg:mx-10 xl:mx-14">

                {/* ================= HEADER ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true,
                        amount: 0.3
                    }}
                    transition={{
                        duration: 0.7
                    }}
                    className="text-center max-w-3xl mx-auto"
                >

                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E2ECE5] text-[#176B3A] text-sm font-medium shadow-sm">

                        <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />

                        Why Farm2Shop?

                    </span>


                    <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123B27] leading-tight">

                        A fairer egg market starts with

                        <span className="text-[#176B3A]">
                            {" "}a direct connection.
                        </span>

                    </h2>


                    <p className="mt-5 text-sm sm:text-base text-gray-600 leading-7 max-w-2xl mx-auto">
                        Farm2Shop brings farmers and shopkeepers closer together
                        through transparent pricing, quality verification and
                        a direct supply process.
                    </p>

                </motion.div>


                {/* ================= SUPPLY CHAIN ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.96
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1
                    }}
                    viewport={{
                        once: true,
                        amount: 0.25
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.15
                    }}
                    className="mt-14 max-w-4xl mx-auto"
                >

                    <div className="relative bg-white rounded-[2rem] border border-[#E2ECE5] shadow-sm px-5 py-10 sm:px-10 lg:px-16">

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-0">


                            {/* FARMER */}

                            <motion.div
                                whileHover={{
                                    y: -4
                                }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >

                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#EAF5EE] border border-[#D7EBDD] flex items-center justify-center text-3xl sm:text-4xl">
                                    🌾
                                </div>

                                <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#123B27]">
                                    Egg Farmer
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Fresh supply
                                </p>

                            </motion.div>


                            {/* CONNECTION 1 */}

                            <div className="hidden sm:flex items-center flex-1 max-w-[180px] mx-4">

                                <div className="h-px bg-[#D8E5DC] flex-1" />

                                <motion.div
                                    animate={{
                                        x: [0, 12, 0]
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-2 h-2 rounded-full bg-[#F4A62A]"
                                />

                                <div className="h-px bg-[#D8E5DC] flex-1" />

                            </div>


                            {/* MOBILE ARROW */}

                            <motion.div
                                animate={{
                                    y: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="sm:hidden text-[#F4A62A] text-xl"
                            >
                                ↓
                            </motion.div>


                            {/* FARM2SHOP */}

                            <motion.div
                                whileHover={{
                                    scale: 1.04
                                }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >

                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#176B3A] text-white flex items-center justify-center shadow-lg shadow-[#176B3A]/20">

                                    <div>

                                        <p className="text-lg sm:text-xl font-bold tracking-tight">
                                            Farm2Shop
                                        </p>

                                        <div className="w-8 h-0.5 bg-[#F4A62A] mx-auto mt-1" />

                                    </div>

                                </div>

                                <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#123B27]">
                                    Direct Connection
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Quality & delivery
                                </p>

                            </motion.div>


                            {/* CONNECTION 2 */}

                            <div className="hidden sm:flex items-center flex-1 max-w-[180px] mx-4">

                                <div className="h-px bg-[#D8E5DC] flex-1" />

                                <motion.div
                                    animate={{
                                        x: [0, 12, 0]
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        delay: 0.3,
                                        ease: "easeInOut"
                                    }}
                                    className="w-2 h-2 rounded-full bg-[#F4A62A]"
                                />

                                <div className="h-px bg-[#D8E5DC] flex-1" />

                            </div>


                            {/* MOBILE ARROW */}

                            <motion.div
                                animate={{
                                    y: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: 0.2,
                                    ease: "easeInOut"
                                }}
                                className="sm:hidden text-[#F4A62A] text-xl"
                            >
                                ↓
                            </motion.div>


                            {/* SHOPKEEPER */}

                            <motion.div
                                whileHover={{
                                    y: -4
                                }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >

                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FFF4DF] border border-[#F7E4BD] flex items-center justify-center text-3xl sm:text-4xl">
                                    🏪
                                </div>

                                <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#123B27]">
                                    Shopkeeper
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Reliable supply
                                </p>

                            </motion.div>

                        </div>


                        {/* Supply chain caption */}

                        <div className="mt-10 pt-6 border-t border-gray-100 text-center">

                            <p className="text-xs sm:text-sm text-gray-500">
                                <span className="font-semibold text-[#176B3A]">
                                    Farmer
                                </span>

                                {" → "}

                                <span className="font-semibold text-[#176B3A]">
                                    Farm2Shop
                                </span>

                                {" → "}

                                <span className="font-semibold text-[#176B3A]">
                                    Shopkeeper
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                A simpler and more transparent supply chain
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* ================= IMPACT CARDS ================= */}

                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

                    {impacts.map((impact, index) => {

                        const Icon = impact.icon;

                        return (
                            <motion.div
                                key={impact.title}
                                initial={{
                                    opacity: 0,
                                    y: 30
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
                                    delay: index * 0.1
                                }}
                                whileHover={{
                                    y: -5
                                }}
                                className="bg-white border border-[#E2ECE5] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >

                                <div className="w-11 h-11 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">

                                    <Icon size={20} />

                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-[#123B27]">
                                    {impact.title}
                                </h3>

                                <p className="mt-2 text-xs sm:text-sm leading-5 text-gray-500">
                                    {impact.description}
                                </p>

                            </motion.div>
                        );

                    })}

                </div>

            </div>

        </section>
    );
};

export default WhyFarm2Shop;