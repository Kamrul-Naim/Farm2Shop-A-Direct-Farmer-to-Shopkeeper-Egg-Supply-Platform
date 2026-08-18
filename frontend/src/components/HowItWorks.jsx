import React from "react";
import { motion } from "framer-motion";
import {
    FiTruck,
    FiCheckCircle,
    FiShoppingBag,
    FiPackage
} from "react-icons/fi";


const steps = [
    {
        number: "01",
        icon: FiPackage,
        title: "Farmers Supply Eggs",
        description:
            "Farmers update their available egg types, grades and quantities on Farm2Shop."
    },
    {
        number: "02",
        icon: FiCheckCircle,
        title: "Quality Is Checked",
        description:
            "Our team collects the eggs and verifies their quality, grade and quantity before listing them."
    },
    {
        number: "03",
        icon: FiShoppingBag,
        title: "Shopkeepers Order",
        description:
            "Verified shopkeepers browse available eggs and place orders directly through the marketplace."
    },
    {
        number: "04",
        icon: FiTruck,
        title: "We Deliver",
        description:
            "Our own team collects and delivers the ordered eggs directly to the shopkeeper."
    }
];


const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};


const itemVariants = {
    hidden: {
        opacity: 0,
        y: 35
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};


const HowItWorks = () => {

    return (
        <section id="how-it-works" className="relative bg-white py-20 sm:py-24 overflow-hidden">

            {/* Background decoration */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#EAF5EE] rounded-full blur-3xl opacity-40 pointer-events-none" />


            <div className="mx-4 sm:mx-6 lg:mx-10 xl:mx-14 relative">

                {/* ================= HEADER ================= */}

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto"
                >

                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EAF5EE] text-[#176B3A] text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />
                        Simple & Transparent
                    </span>


                    <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123B27]">
                        How Farm2Shop Works
                    </h2>


                    <p className="mt-4 text-gray-600 leading-7 text-sm sm:text-base">
                        From collecting fresh eggs at the farm to delivering
                        them to verified shops, we keep the process simple,
                        transparent and reliable.
                    </p>

                </motion.div>


                {/* ================= STEPS ================= */}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15
                    }}
                    className="relative mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5"
                >

                    {/* Desktop connecting line */}

                    <motion.div
                        initial={{
                            scaleX: 0,
                            opacity: 0
                        }}
                        whileInView={{
                            scaleX: 1,
                            opacity: 1
                        }}
                        viewport={{
                            once: true,
                            amount: 0.3
                        }}
                        transition={{
                            duration: 1.2,
                            delay: 0.3,
                            ease: "easeInOut"
                        }}
                        className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-px bg-[#D8E9DE] origin-left"
                    />


                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.number}
                                variants={itemVariants}
                                className="relative group"
                            >

                                {/* Card */}

                                <div className="relative h-full bg-white border border-[#E5EEE8] rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">

                                    {/* Number */}

                                    <div className="absolute top-5 right-5 text-xs font-semibold text-[#176B3A]/30">
                                        {step.number}
                                    </div>


                                    {/* Icon */}

                                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A] group-hover:bg-[#176B3A] group-hover:text-white transition-all duration-300">

                                        <Icon size={27} strokeWidth={1.8} />

                                    </div>


                                    {/* Title */}

                                    <h3 className="mt-6 text-lg font-semibold text-[#123B27]">
                                        {step.title}
                                    </h3>


                                    {/* Description */}

                                    <p className="mt-3 text-sm leading-6 text-gray-500">
                                        {step.description}
                                    </p>


                                    {/* Bottom accent */}

                                    <div className="mt-6 w-8 h-1 rounded-full bg-[#F4A62A] group-hover:w-14 transition-all duration-300" />

                                </div>

                            </motion.div>
                        );
                    })}

                </motion.div>


                {/* ================= BOTTOM MESSAGE ================= */}

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
                        once: true,
                        amount: 0.4
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2
                    }}
                    className="mt-12 flex justify-center"
                >

                    <div className="inline-flex flex-wrap justify-center items-center gap-2 text-sm text-gray-500 text-center">

                        <span className="w-2 h-2 rounded-full bg-[#176B3A]" />

                        <span>
                            Farmers sell directly.
                        </span>

                        <span className="hidden sm:inline text-gray-300">
                            •
                        </span>

                        <span>
                            Shopkeepers buy confidently.
                        </span>

                        <span className="hidden sm:inline text-gray-300">
                            •
                        </span>

                        <span>
                            Farm2Shop connects them.
                        </span>

                    </div>

                </motion.div>

            </div>

        </section>
    );
};


export default HowItWorks;