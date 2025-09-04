"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { getCurrentUserToken } from "../../../lib/firebase";
import BotForm from "../../../components/BotForm";

export default function CreateBotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    aiModel: "gpt-4",
    personality: "friendly",
    autoReply: true,
  });

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

  const handleCreateBot = async () => {
    if (!user) {
      setError("You must be logged in to create a bot");
      setShowErrorDialog(true);
      return;
    }

    if (!formData.name.trim()) {
      setError("Bot name is required");
      setShowErrorDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await getCurrentUserToken();
      const backendResponse = await fetch("http://localhost:5000/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.name,
          description: formData.description,
          aiModel: formData.aiModel,
          personality: formData.personality,
          autoReply: formData.autoReply,
        }),
      });

      if (!backendResponse.ok) {
        const errorMessage = await backendResponse.json();
        const displayMessage =
          errorMessage.error || "An unknown error occurred.";
        throw new Error(displayMessage);
      }

      const { botId } = await backendResponse.json();
      router.push(`/bot/${botId}`);
    } catch (error) {
      console.error("Error creating bot:", error);
      setError(error instanceof Error ? error.message : "Failed to create bot");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your WhatsApp Bot
            </h1>
            <p className="text-gray-600">
              Fill out the form below to set up your AI-powered WhatsApp bot
            </p>
          </div>

          <div className="mb-8">
            <BotForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          {showErrorDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-800 mb-4">{error}</p>
                <button
                  onClick={closeErrorDialog}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleCreateBot}
              className={`px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center justify-center ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Bot'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
