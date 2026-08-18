import React from "react";
import { motion } from "framer-motion";
import {
    FiArrowRight,
    FiCheckCircle,
    FiPackage,
    FiSearch,
    FiTruck
} from "react-icons/fi";

const benefits = [
    {
        icon: FiSearch,
        title: "Browse Available Eggs",
        description:
            "Explore different egg types, grades, quantities and current prices in one place."
    },
    {
        icon: FiCheckCircle,
        title: "Quality Assured",
        description:
            "Our team checks the quality, grade and quantity before the eggs reach your shop."
    },
    {
        icon: FiPackage,
        title: "Easy Ordering",
        description:
            "Choose the eggs you need and place your order directly through the platform."
    },
    {
        icon: FiTruck,
        title: "We Handle Delivery",
        description:
            "Our own delivery team collects and delivers your order directly to your shop."
    }
];

const ForShopkeepers = () => {
    return (
      <section
        id="for-shopkeepers"
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28 scroll-mt-24"
      >
        {/* Background decorations */}

        <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-[#EAF5EE] blur-3xl opacity-60 pointer-events-none" />

        <div className="absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-[#FFF4DF] blur-3xl opacity-60 pointer-events-none" />

        <div className="relative mx-4 sm:mx-6 lg:mx-10 xl:mx-14">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ================= CONTENT ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="order-2 lg:order-1"
            >
              {/* Badge */}

              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EAF5EE] text-[#176B3A] text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />
                For Shopkeepers
              </span>

              {/* Heading */}

              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123B27] leading-tight">
                Source eggs
                <br />
                <span className="text-[#176B3A]">the simpler way.</span>
              </h2>

              {/* Description */}

              <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base max-w-xl">
                Farm2Shop makes it easier for shopkeepers to source quality eggs
                from verified farmers through a transparent and organized
                marketplace.
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
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.1,
                      }}
                      className="group"
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F7FAF8] border border-[#E2ECE5] flex items-center justify-center text-[#176B3A] group-hover:bg-[#176B3A] group-hover:text-white transition-all duration-300">
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
                  x: 4,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => {
                  // Marketplace route will be connected later
                }}
                className="mt-16 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#176B3A] text-white text-sm font-medium hover:bg-[#12572F] hover:shadow-lg transition-all duration-300"
              >
                Explore Marketplace
                <FiArrowRight size={17} />
              </motion.button>
            </motion.div>

            {/* ================= MARKETPLACE VISUAL ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="relative order-1 lg:order-2"
            >
              {/* Main marketplace card */}

              <div className="relative bg-[#F7FAF8] rounded-[2rem] border border-[#E2ECE5] p-5 sm:p-7 shadow-xl">
                {/* Header */}

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500">
                      Farm2Shop Marketplace
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-[#123B27]">
                      Available Eggs
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A]">
                    <FiSearch size={19} />
                  </div>
                </div>

                {/* Search */}

                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                  <FiSearch size={17} className="text-gray-400" />

                  <span className="text-sm text-gray-400">
                    Search egg type...
                  </span>
                </div>

                {/* Egg cards */}

                <div className="mt-5 space-y-3">
                  {/* Card 1 */}

                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#FFF4DF] flex items-center justify-center text-2xl">
                      🥚
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-[#123B27]">
                          Farm Fresh Eggs
                        </h4>

                        <span className="text-sm font-bold text-[#176B3A]">
                          ৳12 / egg
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Grade A • 500+ available
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                        <span className="text-[11px] text-gray-500">
                          Quality verified
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2 */}

                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#FFF4DF] flex items-center justify-center text-2xl">
                      🥚
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-[#123B27]">
                          Large White Eggs
                        </h4>

                        <span className="text-sm font-bold text-[#176B3A]">
                          ৳13 / egg
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Grade A • 350+ available
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                        <span className="text-[11px] text-gray-500">
                          Quality verified
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3 */}

                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#FFF4DF] flex items-center justify-center text-2xl">
                      🥚
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-[#123B27]">
                          Brown Eggs
                        </h4>

                        <span className="text-sm font-bold text-[#176B3A]">
                          ৳14 / egg
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        Grade A • 200+ available
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                        <span className="text-[11px] text-gray-500">
                          Quality verified
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom info */}

                <div className="mt-5 flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-[11px] text-gray-400">Delivery</p>

                    <p className="text-xs font-medium text-[#123B27]">
                      Farm2Shop Team
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#176B3A] text-[10px] font-medium">
                    Verified Supply
                  </span>
                </div>
              </div>

              {/* Floating order card */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                }}
                className="absolute -bottom-12 -left-2 sm:-left-8 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EAF5EE] flex items-center justify-center text-[#176B3A] shrink-0">
                  <FiCheckCircle size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#123B27]">
                    Easy Ordering
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Order directly from marketplace
                  </p>
                </div>
              </motion.div>

              {/* Decorative circle */}

              <div className="absolute -top-5 -left-5 w-20 h-20 rounded-full border-[10px] border-[#F4A62A]/20 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>
    );
};

export default ForShopkeepers;