import React from "react";
import { motion } from "framer-motion";
import {
    FiArrowRight,
    FiLogIn,
    FiShoppingBag,
    FiUsers
} from "react-icons/fi";

const JoinFarm2Shop = () => {
    return (
        <section
            id="join-farm2shop"
            className="relative overflow-hidden bg-[#123B27] py-20 sm:py-24 lg:py-28 scroll-mt-24"
        >

            {/* ================= BACKGROUND DECORATIONS ================= */}

            <div className="absolute -left-32 -top-32 w-80 h-80 rounded-full bg-[#176B3A] opacity-40 blur-3xl pointer-events-none" />

            <div className="absolute -right-32 -bottom-32 w-80 h-80 rounded-full bg-[#F4A62A] opacity-10 blur-3xl pointer-events-none" />

            <div className="absolute top-16 right-[15%] w-3 h-3 rounded-full bg-[#F4A62A] opacity-70" />

            <div className="absolute bottom-20 left-[12%] w-2 h-2 rounded-full bg-white opacity-30" />


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

                    {/* Badge */}

                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/10 text-[#F4A62A] text-sm font-medium backdrop-blur-sm">

                        <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />

                        Join Farm2Shop

                    </span>


                    {/* Heading */}

                    <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">

                        Ready to be part of a

                        <span className="text-[#F4A62A]">
                            {" "}better connection?
                        </span>

                    </h2>


                    {/* Description */}

                    <p className="mt-5 text-sm sm:text-base text-white/70 leading-7 max-w-2xl mx-auto">
                        Whether you are an egg farmer looking for reliable
                        buyers or a shopkeeper looking for quality eggs,
                        Farm2Shop brings both sides closer together.
                    </p>

                </motion.div>


                {/* ================= ROLE CARDS ================= */}

                <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">


                    {/* ================= FARMER ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -35
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
                            duration: 0.6,
                            delay: 0.1
                        }}
                        whileHover={{
                            y: -5
                        }}
                        className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl"
                    >

                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">
                                <FiUsers size={22} />
                            </div>

                            <span className="text-2xl">
                                🌾
                            </span>

                        </div>


                        <h3 className="mt-5 text-lg font-bold text-[#123B27]">
                            Are you an Egg Farmer?
                        </h3>


                        <p className="mt-2 text-sm text-gray-500 leading-6">
                            Connect with verified shopkeepers and get your
                            eggs into the market through a more organized
                            selling process.
                        </p>


                        <motion.button
                            whileHover={{
                                x: 4
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#176B3A] text-white text-sm font-medium hover:bg-[#12572F] transition-all duration-300"
                        >

                            Join as a Farmer

                            <FiArrowRight size={17} />

                        </motion.button>

                    </motion.div>


                    {/* ================= SHOPKEEPER ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 35
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
                            duration: 0.6,
                            delay: 0.2
                        }}
                        whileHover={{
                            y: -5
                        }}
                        className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl"
                    >

                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-[#FFF4DF] flex items-center justify-center text-[#C17A0B]">
                                <FiShoppingBag size={22} />
                            </div>

                            <span className="text-2xl">
                                🏪
                            </span>

                        </div>


                        <h3 className="mt-5 text-lg font-bold text-[#123B27]">
                            Are you a Shopkeeper?
                        </h3>


                        <p className="mt-2 text-sm text-gray-500 leading-6">
                            Browse quality-verified eggs, place orders easily
                            and receive your supply through our own delivery
                            team.
                        </p>


                        <motion.button
                            whileHover={{
                                x: 4
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4A62A] text-[#123B27] text-sm font-semibold hover:bg-[#E99A1E] transition-all duration-300"
                        >

                            Join as a Shopkeeper

                            <FiArrowRight size={17} />

                        </motion.button>

                    </motion.div>

                </div>


                {/* ================= LOGIN ================= */}

                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    whileInView={{
                        opacity: 1
                    }}
                    viewport={{
                        once: true
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.4
                    }}
                    className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm"
                >

                    <span className="text-white/60">
                        Already have an account?
                    </span>

                    <button className="inline-flex items-center gap-1.5 text-[#F4A62A] font-medium hover:text-white transition-colors">

                        Login

                        <FiLogIn size={15} />

                    </button>

                </motion.div>

            </div>

        </section>
    );
};

export default JoinFarm2Shop;