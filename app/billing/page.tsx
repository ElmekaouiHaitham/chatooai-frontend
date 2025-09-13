"use client";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  getCurrentUserData,
  getPlanById,
  UserData,
  PlanData,
} from "../../lib/firebase";

export default function Billing() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userData = await getCurrentUserData();
      setUserData(userData);
      if (userData?.planId) {
        const planData = await getPlanById(userData.planId);
        setPlan(planData);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Get current month usage
  const currentMonthUsage = userData?.monthlyUsage?.length
    ? userData.monthlyUsage[userData.monthlyUsage.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="billing" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Billing & Usage
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your subscription and payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Current Plan
              </h2>
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan?.name || userData?.plan || "Free Plan"}
                      </h3>
                      <p className="text-gray-600">
                        {plan
                          ? `$${plan.price}/${
                              plan.billingCycle === "monthly" ? "month" : "year"
                            }`
                          : "Free"}
                      </p>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {userData?.status === "active"
                        ? "Active"
                        : userData?.status || "Inactive"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Messages Used</span>
                      <div className="font-semibold text-gray-900">
                        {currentMonthUsage
                          ? `${currentMonthUsage.messages} / ${
                              plan?.limits?.messagesPerMonth === -1
                                ? "∞"
                                : plan?.limits?.messagesPerMonth ?? "∞"
                            }`
                          : "0 / ∞"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bots Active</span>
                      <div className="font-semibold text-gray-900">
                        {currentMonthUsage
                          ? `${currentMonthUsage.bots} / ${
                              plan?.limits?.botsPerMonth === -1
                                ? "∞"
                                : plan?.limits?.botsPerMonth ?? "∞"
                            }`
                          : "0 / ∞"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Billing</span>
                      <div className="font-semibold text-gray-900">
                        {/* Placeholder: You can calculate next billing date if you store it */}
                        {plan?.billingCycle === "monthly" &&
                        currentMonthUsage?.endDate
                          ? new Date(
                              currentMonthUsage.endDate.seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Methods
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💳</span>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/25</div>
                    </div>
                  </div>
                  <span className="text-green-500 text-sm">Default</span>
                </div>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">➕</span>
                    <span className="text-sm font-medium">
                      Add Payment Method
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
