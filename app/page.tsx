"use client";

import { useState, useEffect } from "react";
import { getAllPlans, PlanData } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const fetchedPlans = await getAllPlans();
      // Filter only active plans and sort by price
      const activePlans = fetchedPlans
        .filter((plan) => plan.status === "active")
        .sort((a, b) => a.price - b.price);
      setPlans(activePlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (name: string) => {
    switch (name) {
      case "Business":
        return "border-purple-500";
      case "Pro":
        return "border-green-500";
      case "Free":
        return "border-gray-200";
      default:
        return "border-gray-200";
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? "Unlimited" : limit.toString();
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white shadow-sm flex justify-between items-center px-6 py-4"
      >
        <div className="flex items-center">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl font-bold text-green-500"
          >
            ChatTooAI
          </motion.h1>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign Up
          </a>
        </div>
      </motion.nav>

      {/* Hero Section - Modern, Animated */}
      <section className="relative py-28 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                AI WhatsApp Bots
              </span>{" "}
              <br />
              <span className="text-gray-700">in Seconds, No Code.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-2xl text-gray-600 mb-10 max-w-xl"
            >
              Instantly automate your WhatsApp with smart, 24/7 AI chatbots.
              Connect, customize, and launch with a single QR scan.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-center"
              >
                Get Started Free
              </a>
              <a
                href="#pricing"
                className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-center"
              >
                See Pricing
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex gap-4 mt-10"
            >
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                No credit card required
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Free forever plan
              </span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex justify-center relative"
          >
            <motion.div
              initial={{ rotate: -8 }}
              animate={{ rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 10,
                delay: 0.5,
              }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md border-4 border-green-100 relative"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 mb-4"
              >
                <div className="w-32 h-32 bg-green-200 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-inner">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="text-5xl"
                  >
                    📱
                  </motion.span>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    QR Code Connection
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Scan and connect instantly
                  </p>
                </div>
              </motion.div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    AI-powered responses
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    24/7 availability
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    Multi-language support
                  </span>
                </div>
              </div>
            </motion.div>
            {/* Decorative animated circles */}
            <motion.div
              className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 z-0"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-24 h-24 bg-green-300 rounded-full opacity-20 z-0"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        {/* Subtle animated background shapes */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0"
          >
            <motion.path
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              fill="#6ee7b7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.7 }}
              style={{ opacity: 0.12 }}
            />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make creating and managing your WhatsApp AI
              chatbot effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy WhatsApp Connection
              </h3>
              <p className="text-gray-600">
                Connect your WhatsApp business account instantly with a simple
                QR code scan. No complex setup required.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Smart Replies
              </h3>
              <p className="text-gray-600">
                Choose from any AI model - GPT, Claude, or custom models. Get
                intelligent, contextual responses 24/7.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Code, Just Setup & Go
              </h3>
              <p className="text-gray-600">
                Intuitive dashboard with drag-and-drop interface. Set up your
                chatbot in minutes, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-8 w-8 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-600">Loading plans...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPlans}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                No pricing plans available at the moment.
              </p>
              <a
                href="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </a>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence>
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{
                      delay: 0.1 * index,
                      duration: 0.6,
                      type: "spring",
                    }}
                    className={`bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start border-2 ${getPlanColor(
                      plan.name
                    )} relative hover:shadow-xl transition-all ${
                      plan.isPopular ? "transform scale-105" : ""
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600">
                        /{plan.billingCycle}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-grow">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">
                          {formatLimit(plan.limits.botsPerMonth)} AI chatbot
                          {plan.limits.botsPerMonth !== 1 ? "s" : ""}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">
                          {formatLimit(plan.limits.messagesPerMonth)}{" "}
                          messages/day
                        </span>
                      </li>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.a
                      href="/signup"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors text-center block ${
                        plan.isPopular
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {plan.price === 0
                        ? "Get Started Free"
                        : `Choose ${plan.name}`}
                    </motion.a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-green-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Start Building Your Chatbot Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses automating their WhatsApp communication
          </p>
          <a className="bg-white text-green-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl">
            Sign Up Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-900 border-t border-green-500/20 text-gray-300 py-10 px-6 mt-12"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-evenly gap-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white text-2xl font-bold shadow-lg">C</span>
            <span className="text-xl font-bold text-green-400 tracking-wide">ChatTooAI</span>
          </div>
          <p className="text-gray-400 text-sm mb-0">© 2025 ChatTooAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
