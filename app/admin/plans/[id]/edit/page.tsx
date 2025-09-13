"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavigation from "../../../../../components/AdminNavigation";
import ProtectedRoute from "../../../../../components/ProtectedRoute";
import {
  getCurrentUserData,
  getCurrentUserToken,
  getPlanById,
  PlanData,
} from "../../../../../lib/firebase";

interface PlanFormData {
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  status: "active" | "inactive" | "draft";
  features: string[];
  limits: {
    botsPerMonth: number;
    messagesPerMonth: number;
  };
  isPopular: boolean;
  isUnlimited: boolean;
}

interface EditPlanPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  const [planId, setPlanId] = useState<string>("");
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [formData, setFormData] = useState<PlanFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPlanId(resolvedParams.id);
      await fetchPlan(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchPlan = async (id: string) => {
    try {
      setIsLoading(true);
      setError("");
      const fetchedPlan = await getPlanById(id);

      if (!fetchedPlan) {
        setError("Plan not found");
        return;
      }

      setPlan(fetchedPlan);
      setFormData({
        name: fetchedPlan.name,
        description: fetchedPlan.description || "",
        price: fetchedPlan.price,
        billingCycle: fetchedPlan.billingCycle,
        status: fetchedPlan.status,
        features: [...fetchedPlan.features],
        limits: {
          botsPerMonth: fetchedPlan.limits?.botsPerMonth ?? 0,
          messagesPerMonth: fetchedPlan.limits?.messagesPerMonth ?? 0,
        },
        isPopular: fetchedPlan.isPopular || false,
        isUnlimited: fetchedPlan.isUnlimited || false,
      });
    } catch (err) {
      console.error("Error fetching plan:", err);
      setError("Failed to load plan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev!, [field]: value }));
    setHasChanges(true);
  };

  const handleLimitChange = (
    field: keyof PlanFormData["limits"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev!,
      limits: { ...prev!.limits, [field]: value },
    }));
    setHasChanges(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev!,
        features: [...prev!.features, newFeature.trim()],
      }));
      setNewFeature("");
      setHasChanges(true);
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev!,
      features: prev!.features.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleSavePlan = async () => {
    if (!formData || !planId) return;

    setIsSaving(true);
    setError("");

    const updateData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      billingCycle: formData.billingCycle,
      status: formData.status,
      features: formData.features,
      limits: {
        botsPerMonth: formData.isUnlimited ? -1 : formData.limits.botsPerMonth,
        messagesPerMonth: formData.isUnlimited
          ? -1
          : formData.limits.messagesPerMonth,
      },
      isPopular: formData.isPopular,
      isUnlimited: formData.isUnlimited,
    };

    try {
      const token = await getCurrentUserToken();
      const user = await getCurrentUserData();

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/plan/${planId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            uid: user?.uid,
            planData: updateData,
          }),
        }
      );

      if (!backendResponse.ok) {
        const errorMessage = await backendResponse.json();
        const displayMessage =
          errorMessage.error || "An unknown error occurred.";
        throw new Error(displayMessage);
      }
      setHasChanges(false);
      alert("Plan updated successfully!");
    } catch (error) {
      console.error("Error updating plan:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update plan"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planId) return;

    if (
      confirm(
        "Are you sure you want to delete this plan? This action cannot be undone."
      )
    ) {
      setIsSaving(true);
      try {
        const token = await getCurrentUserToken();
        const user = await getCurrentUserData();

        const backendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/plan/${planId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!backendResponse.ok) {
          const errorMessage = await backendResponse.json();
          const displayMessage =
            errorMessage.error || "An unknown error occurred.";
          throw new Error(displayMessage);
        }
        setHasChanges(false);
        alert("Plan deleted successfully!");
        router.push("/admin/plans");
      } catch (error) {
        console.error("Error deleting plan:", error);
        setError(
          error instanceof Error ? error.message : "Failed to delete plan"
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavigation currentPage="plans" />
          <div className="max-w-4xl mx-auto px-6 py-8">
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
                <span className="text-gray-600">Loading plan...</span>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !plan || !formData) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavigation currentPage="plans" />
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Plan Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                {error || "The plan you're looking for doesn't exist."}
              </p>
              <a
                href="/admin/plans"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Plans
              </a>
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
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/plans"
                  className="text-gray-600 hover:text-green-500 transition-colors"
                >
                  ← Back to Plans
                </a>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Edit Plan
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {plan.name} - Plan Configuration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDeletePlan}
                  disabled={isSaving}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Pro, Business, Enterprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe what this plan offers..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) =>
                        handleInputChange("billingCycle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={formData.isPopular}
                      onChange={(e) =>
                        handleInputChange("isPopular", e.target.checked)
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="isPopular"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Mark as popular
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isUnlimited"
                      checked={formData.isUnlimited}
                      onChange={(e) =>
                        handleInputChange("isUnlimited", e.target.checked)
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="isUnlimited"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Unlimited plan
                    </label>
                  </div>
                </div>
              </div>

              {/* Limits and Features */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Limits & Features
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Bots/Month
                    </label>
                    <input
                      type="number"
                      value={formData.limits.botsPerMonth}
                      onChange={(e) =>
                        handleLimitChange(
                          "botsPerMonth",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={formData.isUnlimited}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="1"
                    />
                    {formData.isUnlimited && (
                      <p className="text-xs text-gray-500 mt-1">Unlimited</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Messages/Month
                    </label>
                    <input
                      type="number"
                      value={formData.limits.messagesPerMonth}
                      onChange={(e) =>
                        handleLimitChange(
                          "messagesPerMonth",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={formData.isUnlimited}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="100"
                    />
                    {formData.isUnlimited && (
                      <p className="text-xs text-gray-500 mt-1">Unlimited</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="flex-1 text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add a feature..."
                    />
                    <button
                      onClick={addFeature}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Preview
              </h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {formData.name}
                  </h4>
                  {formData.isPopular && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${formData.price}
                  </span>
                  <span className="text-gray-500">
                    /{formData.billingCycle}
                  </span>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <a
                href="/admin/plans"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-50"
              >
                Cancel
              </a>
              <button
                onClick={handleSavePlan}
                disabled={!hasChanges || isSaving}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
