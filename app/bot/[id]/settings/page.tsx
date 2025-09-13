"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "../../../../components/Navigation";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getBotById,
  BotData,
  getCurrentUserToken,
} from "../../../../lib/firebase";
import BotForm from "../../../../components/BotForm";

export default function BotSettingsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [bot, setBot] = useState<BotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<Partial<BotData>>({});

  useEffect(() => {
    const fetchBot = async () => {
      try {
        if (typeof params.id === "string") {
          const botData = await getBotById(params.id);
          if (botData) {
            setBot(botData);
            setFormData({
              name: botData.name,
              description: botData.description,
              aiModel: botData.aiModel,
              personality: botData.personality,
              autoReply: botData.autoReply,
            });
          } else {
            setError("Bot not found");
          }
        }
      } catch (err) {
        setError("Failed to load bot");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    if (!bot) return;
    try {
      setSaving(true);
      setError("");
      const token = await getCurrentUserToken();
      const updateData = {
        name: formData.name!,
        description: formData.description!,
        aiModel: formData.aiModel!,
        personality: formData.personality!,
        autoReply: formData.autoReply!,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bot/${bot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Failed to update bot");
      }
      setBot((prev) => (prev ? { ...prev, ...updateData } : null));
      alert("Bot settings saved successfully!");
    } catch (err) {
      console.error("Failed to save bot:", err);
      setError("Failed to save bot settings");
      setShowErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bot Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The bot you are looking for does not exist."}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        {/* Error Dialog for initial load error */}
        {showErrorDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Error
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorDialog(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bot Settings
                </h1>
                <p className="text-gray-600">Configure your WhatsApp bot</p>
              </div>
              <button
                onClick={() => router.push(`/bot/${bot.id}`)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to Bot
              </button>
            </div>
          </div>

          {/* Error Dialog for save error */}
          {showErrorDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Error
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowErrorDialog(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <BotForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
