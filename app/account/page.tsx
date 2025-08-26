"use client";

import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCurrentUserData,
  updateCurrentUserDisplayName,
  getAllPlans,
} from "../../lib/firebase";
import { UserData, PlanData } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function AccountSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Form state
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [userDataResult, plansResult] = await Promise.all([
          getCurrentUserData(),
          getAllPlans(),
        ]);

        if (userDataResult) {
          setUserData(userDataResult);
          setDisplayName(userDataResult.displayName || "");
        }

        if (plansResult) {
          setPlans(plansResult.filter((plan) => plan.status === "active"));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateCurrentUserDisplayName(displayName);

      // Update local state
      setUserData((prev) => (prev ? { ...prev, displayName } : null));
      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePlan = () => {
    router.push("/billing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="account" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="account" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Please sign in to access account settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = plans.find((plan) => plan.id === userData.planId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="account" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and subscription
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Profile Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-medium text-green-600">
                      {userData.displayName
                        ? userData.displayName.substring(0, 2).toUpperCase()
                        : "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile photo</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || displayName === userData.displayName}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Plan Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Current Plan
              </h2>
              {currentPlan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {currentPlan.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentPlan.description}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        ${currentPlan.price}/{currentPlan.billingCycle}
                      </p>
                    </div>
                    <button
                      onClick={handleChangePlan}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No plan selected</p>
                  <button
                    onClick={handleChangePlan}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Select a Plan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {userData.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData.joined
                      ? new Date(userData.joined.toDate()).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Active</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData.lastActive
                      ? new Date(
                          userData.lastActive.toDate()
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Usage
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Bots</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData.bots || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${userData.revenue || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security
              </h3>
              <div className="space-y-4">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🔒</span>
                      <span className="text-sm font-medium">
                        Change Password
                      </span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>

                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🔐</span>
                      <span className="text-sm font-medium">
                        Two-Factor Auth
                      </span>
                    </div>
                    <span className="text-green-500 text-sm">Coming Soon</span>
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
