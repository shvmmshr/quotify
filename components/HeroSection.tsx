"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Lenis from "lenis";

const HeroSection: React.FC = () => {
  const { theme } = useTheme();

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // Clean up
      lenis.destroy();
    };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className={`relative ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-800"
      } min-h-screen flex flex-col items-center justify-center w-full overflow-hidden`}
    >
      {/* Subtle background elements with animation */}
      <div className="absolute inset-0 w-full overflow-hidden">
        <motion.div
          className={`absolute top-20 left-10 w-64 h-64 rounded-full ${
            theme === "dark" ? "bg-orange-900" : "bg-orange-100"
          } opacity-30 blur-3xl`}
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute bottom-40 right-20 w-96 h-96 rounded-full ${
            theme === "dark" ? "bg-orange-800" : "bg-orange-50"
          } opacity-40 blur-3xl`}
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content Container */}
      <motion.div
        className="container mx-auto max-w-7xl relative z-10 px-4 md:px-6"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div className="text-center mb-12" variants={fadeIn}>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
            variants={fadeIn}
          >
            Transform your thoughts into{" "}
            <span className="text-orange-500">beautiful images</span>
          </motion.h1>
          <motion.p
            className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto mb-10`}
            variants={fadeIn}
          >
            Create stunning, shareable quote images with our AI-powered
            generator. Customize fonts, colors, backgrounds, and more.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center"
            variants={fadeIn}
          >
            <Link
              href="/editor"
              className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg ${
                theme === "dark" ? "hover:bg-orange-700" : "hover:bg-orange-600"
              }`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                Create Your Quote
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.span>
            </Link>
            <Link
              href="/examples"
              className={`${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-orange-700 text-gray-200"
                  : "bg-white border-gray-200 hover:border-orange-200 text-gray-700"
              } border font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-sm hover:shadow`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Examples
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Demo Preview with animation */}
        <motion.div
          className="relative mx-auto mt-10 mb-16 max-w-4xl"
          variants={fadeIn}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className={`relative ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-800 to-gray-900"
                : "bg-gradient-to-r from-gray-50 to-white"
            } p-6 rounded-xl shadow-xl`}
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/editor.png"
                alt="Quote image example"
                width={1200}
                height={675}
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJcg9FHqwAAAABJRU5ErkJggg=="
                priority
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.div
                  className={`${
                    theme === "dark" ? "bg-gray-900/80" : "bg-white/80"
                  } backdrop-blur-sm p-6 md:p-8 rounded-lg max-w-md text-center shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p
                    className={`text-xl md:text-2xl font-serif italic ${
                      theme === "dark" ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    &quot;The future belongs to those who believe in the beauty
                    of their dreams.&quot;
                  </p>
                  <p className="text-sm md:text-base text-orange-500 mt-2 font-medium">
                    - Eleanor Roosevelt
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features with staggered animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6"
          variants={staggerChildren}
        >
          <motion.div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
            variants={featureVariants}
            whileHover={{
              y: -10,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              className={`w-12 h-12 ${
                theme === "dark" ? "bg-orange-900/50" : "bg-orange-50"
              } rounded-lg flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold mb-3 group-hover:text-orange-500 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              AI-Powered Design
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Our AI analyzes your quotes to suggest the perfect styles,
              backgrounds, and color palettes.
            </p>
          </motion.div>

          <motion.div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
            variants={featureVariants}
            whileHover={{
              y: -10,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              className={`w-12 h-12 ${
                theme === "dark" ? "bg-orange-900/50" : "bg-orange-50"
              } rounded-lg flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold mb-3 group-hover:text-orange-500 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Endless Customization
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Fine-tune every aspect of your quote image with our intuitive
              editor and extensive options.
            </p>
          </motion.div>

          <motion.div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
            variants={featureVariants}
            whileHover={{
              y: -10,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              className={`w-12 h-12 ${
                theme === "dark" ? "bg-orange-900/50" : "bg-orange-50"
              } rounded-lg flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold mb-3 group-hover:text-orange-500 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Instant Sharing
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Download your creations or share them directly to social media
              platforms with a single click.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
