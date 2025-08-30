"use client";

import { useState, useEffect } from "react";
import AdminNavigation from "../../../components/AdminNavigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getAllPlans, PlanData } from "../../../lib/firebase";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const fetchedPlans = await getAllPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to fetch plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (name: string) => {
    switch (name) {
      case "Business":
        return "bg-purple-100 text-purple-800";
      case "Pro":
        return "bg-blue-100 text-blue-800";
      case "Free":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavigation currentPage="plans" />
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
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
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="plans" />

        {/* Page Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  Plan Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure pricing plans and features
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/plans/create"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Create Plan
                </a>
                <button
                  onClick={fetchPlans}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Overview */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.reduce((sum, plan) => sum + (plan.users || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {plans
                      .reduce((sum, plan) => sum + (plan.revenue || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing Plans
              </h2>
            </div>

            <div className="overflow-x-auto">
              {plans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No plans found</div>
                  <a
                    href="/admin/plans/create"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Your First Plan
                  </a>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Plan
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Price
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Users
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Revenue
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {plans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                                plan.name
                              )}`}
                            >
                              {plan.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {plan.billingCycle}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-lg font-semibold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {plan.users || 0}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          ${plan.revenue || 0}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              plan.status
                            )}`}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <a
                              href={`/admin/plans/${plan.id}/edit`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Plan Details */}
          {plans.length > 0 && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">/{plan.billingCycle}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Users:</span>
                      <span className="font-medium">{plan.users || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">${plan.revenue || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bots/month:</span>
                      <span className="font-medium">
                        {plan.limits.botsPerMonth === -1
                          ? "Unlimited"
                          : plan.limits.botsPerMonth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Messages/month:</span>
                      <span className="font-medium">
                        {plan.limits.messagesPerMonth === -1
                          ? "Unlimited"
                          : plan.limits.messagesPerMonth}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      Features:
                    </h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <a
                      href={`/admin/plans/${plan.id}/edit`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Edit Plan
                    </a>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Users
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plan Analytics */}
          {plans.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Plan Analytics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    User Distribution
                  </h3>
                  <div className="space-y-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              getPlanColor(plan.name)
                                .replace("bg-", "")
                                .split(" ")[0]
                            }`}
                          ></span>
                          <span className="text-sm font-medium">
                            {plan.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {plan.users || 0} users
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    Revenue Distribution
                  </h3>
                  <div className="space-y-3">
                    {plans
                      .filter((p) => (p.revenue || 0) > 0)
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                getPlanColor(plan.name)
                                  .replace("bg-", "")
                                  .split(" ")[0]
                              }`}
                            ></span>
                            <span className="text-sm font-medium">
                              {plan.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            ${plan.revenue || 0}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
