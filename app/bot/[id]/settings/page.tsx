"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "../../../../components/Navigation";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getBotById,
  updateBot,
  deleteBot,
  BotData,
} from "../../../../lib/firebase";

export default function BotSettingsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [bot, setBot] = useState<BotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
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

      const updateData: Partial<BotData> = {
        name: formData.name!,
        description: formData.description!,
        aiModel: formData.aiModel!,
        personality: formData.personality!,
        autoReply: formData.autoReply!,
      };

      await updateBot(bot.id, updateData);

      const updateBotB = async () => {
        await fetch(`http://localhost:5000/bot/${bot.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name!,
            description: formData.description!,
            aiModel: formData.aiModel!,
            personality: formData.personality!,
            autoReply: formData.autoReply!,
          }),
        });
        alert("Bot updated!");
      };
      console.log("Updating bot in backend...");
      await updateBotB();

      // Update local state
      setBot((prev) => (prev ? { ...prev, ...updateData } : null));

      // Show success message
      alert("Bot settings saved successfully!");
    } catch (err) {
      console.error("Failed to save bot:", err);
      setError("Failed to save bot settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!bot) return;

    try {
      setSaving(true);
      setError("");

      // Delete from WhatsApp service
      // TODO: Uncomment when WhatsApp service is implemented
      // await whatsappService.deleteBot(bot.id);

      // Delete from Firebase
      await deleteBot(bot.id, bot.uid);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete bot:", err);
      setError("Failed to delete bot");
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Settings */}

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                AI Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    name="aiModel"
                    value={formData.aiModel || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personality
                  </label>
                  <select
                    name="personality"
                    value={formData.personality || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="humorous">Humorous</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoReply"
                    name="autoReply"
                    checked={formData.autoReply || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="autoReply"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Enable automatic responses
                  </label>
                </div>
              </div>
            </div>
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Bot
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{bot.name}"? This action cannot
                be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
