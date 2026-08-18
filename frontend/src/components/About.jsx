import React from "react";
import { motion } from "framer-motion";
import {
    FiCheckCircle,
    FiHeart,
    FiShield,
    FiUsers
} from "react-icons/fi";

const points = [
    {
        icon: FiUsers,
        title: "Connecting Farmers & Shops",
        description:
            "We create a direct digital connection between egg farmers and verified shopkeepers."
    },
    {
        icon: FiShield,
        title: "Quality Comes First",
        description:
            "Our team checks the quality, grade and quantity of eggs during collection."
    },
    {
        icon: FiCheckCircle,
        title: "Transparent Process",
        description:
            "From pricing to ordering and delivery, every step is designed to be clear and organized."
    },
    {
        icon: FiHeart,
        title: "Built for a Better Market",
        description:
            "Farm2Shop is designed to reduce unnecessary intermediaries and create a more efficient supply chain."
    }
];

const About = () => {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28 scroll-mt-24"
        >

            {/* Background decoration */}

            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#EAF5EE] blur-3xl opacity-60 pointer-events-none" />

            <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#FFF4DF] blur-3xl opacity-50 pointer-events-none" />


            <div className="relative mx-4 sm:mx-6 lg:mx-10 xl:mx-14">

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">


                    {/* ================= LEFT VISUAL ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -50
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

                        {/* Main visual */}

                        <div className="relative bg-[#F7FAF8] rounded-[2rem] border border-[#E2ECE5] p-6 sm:p-8">

                            {/* Top label */}

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs text-gray-400">
                                        Our vision
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#123B27]">
                                        A better connection
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2ECE5] flex items-center justify-center text-[#176B3A]">
                                    <FiHeart size={19} />
                                </div>

                            </div>


                            {/* Illustration */}

                            <div className="relative mt-8 h-[300px] sm:h-[350px] flex items-center justify-center">

                                {/* Decorative circle */}

                                <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#EAF5EE]" />

                                {/* Inner circle */}

                                <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-[#BBD8C5]" />


                                {/* Farmer */}

                                <motion.div
                                    animate={{
                                        y: [0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute left-[8%] sm:left-[12%] top-[22%] bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-4 text-center"
                                >

                                    <div className="text-3xl">
                                        🌾
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-[#123B27]">
                                        Farmer
                                    </p>

                                </motion.div>


                                {/* Eggs */}

                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#176B3A] text-white flex items-center justify-center shadow-xl"
                                >

                                    <div className="text-center">

                                        <div className="text-3xl">
                                            🥚
                                        </div>

                                        <p className="mt-1 text-xs font-semibold">
                                            Farm2Shop
                                        </p>

                                    </div>

                                </motion.div>


                                {/* Shopkeeper */}

                                <motion.div
                                    animate={{
                                        y: [0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: 0.5,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute right-[8%] sm:right-[12%] bottom-[20%] bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-4 text-center"
                                >

                                    <div className="text-3xl">
                                        🏪
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-[#123B27]">
                                        Shopkeeper
                                    </p>

                                </motion.div>


                                {/* Connecting line */}

                                <div className="absolute left-[25%] right-[25%] top-1/2 border-t border-dashed border-[#AFCDB9]" />

                            </div>


                            {/* Bottom statement */}

                            <div className="border-t border-[#E2ECE5] pt-5 text-center">

                                <p className="text-sm font-medium text-[#176B3A]">
                                    Connecting the people behind every egg.
                                </p>

                            </div>

                        </div>


                        {/* Floating badge */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15
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
                            className="absolute -bottom-5 right-5 sm:right-8 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3"
                        >

                            <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">
                                <FiCheckCircle size={18} />
                            </div>

                            <div>

                                <p className="text-xs font-semibold text-[#123B27]">
                                    Built with purpose
                                </p>

                                <p className="text-[11px] text-gray-500">
                                    For a better supply chain
                                </p>

                            </div>

                        </motion.div>

                    </motion.div>


                    {/* ================= CONTENT ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 50
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
                    >

                        {/* Badge */}

                        <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EAF5EE] text-[#176B3A] text-sm font-medium">

                            <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />

                            About Farm2Shop

                        </span>


                        {/* Heading */}

                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123B27] leading-tight">

                            Connecting the people
                            <br />

                            <span className="text-[#176B3A]">
                                behind every egg.
                            </span>

                        </h2>


                        {/* Description */}

                        <p className="mt-5 text-sm sm:text-base text-gray-600 leading-7 max-w-xl">
                            Farm2Shop is a digital marketplace designed to
                            create a more direct and organized connection
                            between egg farmers and shopkeepers.
                        </p>

                        <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7 max-w-xl">
                            Instead of relying on multiple unnecessary
                            intermediaries, our platform brings both sides
                            closer while our own team manages quality
                            verification, collection and delivery.
                        </p>


                        {/* Points */}

                        <div className="mt-8 space-y-5">

                            {points.map((point, index) => {

                                const Icon = point.icon;

                                return (
                                    <motion.div
                                        key={point.title}
                                        initial={{
                                            opacity: 0,
                                            y: 15
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
                                            duration: 0.45,
                                            delay: index * 0.1
                                        }}
                                        className="flex gap-4"
                                    >

                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F7FAF8] border border-[#E2ECE5] flex items-center justify-center text-[#176B3A]">
                                            <Icon size={19} />
                                        </div>

                                        <div>

                                            <h3 className="text-sm font-semibold text-[#123B27]">
                                                {point.title}
                                            </h3>

                                            <p className="mt-1 text-xs sm:text-sm leading-5 text-gray-500 max-w-lg">
                                                {point.description}
                                            </p>

                                        </div>

                                    </motion.div>
                                );
                            })}

                        </div>

                    </motion.div>

                </div>

            </div>

        </section>
    );
};

export default About;