"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { createBot, BotData } from "../../../lib/firebase";

export default function CreateBotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    aiModel: "gpt-4",
    personality: "friendly",
    autoReply: true,
    workingHours: {
      enabled: false,
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
    },
    features: {
      fileSharing: false,
      voiceMessages: false,
      quickReplies: false,
      analytics: true,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingHoursChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features],
      },
    }));
  };

  const handleCreateBot = async () => {
    if (!user) {
      setError("You must be logged in to create a bot");
      return;
    }

    if (!formData.name.trim()) {
      setError("Bot name is required");
      return;
    }

    try {
      setError("");

      // Create bot in Firebase
      const botId = await createBot({
        uid: user.uid,
        name: formData.name,
        description: formData.description,
        avatar: formData.avatar || "/bot-avatar.png",
        aiModel: formData.aiModel,
        personality: formData.personality,
        autoReply: formData.autoReply,
        workingHours: formData.workingHours,
        features: formData.features,
        whatsapp: {
          status: "disconnected",
        },
        stats: {
          messageCount: 0,
          totalUsers: 0,
        },
      });

      // Initialize WhatsApp service for this bot
      // await whatsappService.createBot(botId);
      const createBotB = async () => {
        await fetch("http://localhost:5000/bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: botId, name: formData.name }),
        });
        alert("Bot name set!");
      };
      await createBotB();
      // Redirect to the new bot's detail page
      router.push(`/bot/${botId}`);
    } catch (error) {
      console.error("Error creating bot:", error);
      setError(error instanceof Error ? error.message : "Failed to create bot");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bot Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter bot name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe what your bot does"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL
        </label>
        <input
          type="url"
          name="avatar"
          value={formData.avatar}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/avatar.png"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Model
        </label>
        <select
          name="aiModel"
          value={formData.aiModel}
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
          value={formData.personality}
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
          checked={formData.autoReply}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, autoReply: e.target.checked }))
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="autoReply" className="ml-2 block text-sm text-gray-900">
          Enable automatic responses
        </label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="workingHoursEnabled"
            checked={formData.workingHours.enabled}
            onChange={(e) =>
              handleWorkingHoursChange("enabled", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="workingHoursEnabled"
            className="ml-2 block text-sm text-gray-900"
          >
            Set working hours
          </label>
        </div>

        {formData.workingHours.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.workingHours.start}
                onChange={(e) =>
                  handleWorkingHoursChange("start", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.workingHours.end}
                onChange={(e) =>
                  handleWorkingHoursChange("end", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="space-y-3">
          {Object.entries(formData.features).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={() => handleFeatureToggle(key)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={key}
                className="ml-2 block text-sm text-gray-900 capitalize"
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

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
              Follow the steps below to set up your AI-powered WhatsApp bot
            </p>
          </div>

          {renderStepIndicator()}

          <div className="mb-8">{renderStepContent()}</div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-md font-medium ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateBot}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
              >
                Create Bot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
