import React from "react";

const AI_MODELS = [
  { value: "openai/gpt-oss-20b:free", label: "GPT-4 (20B, Free)" },
  { value: "openai/gpt-oss-120b:free", label: "GPT-3.5 Turbo (120B, Free)" },
];

const PERSONALITIES = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "humorous", label: "Humorous" },
];


interface BotFormData {
  name?: string;
  description?: string;
  aiModel?: string;
  personality?: string;
  autoReply?: boolean;
}

interface BotFormProps {
  formData: BotFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  children?: React.ReactNode;
}

export default function BotForm({
  formData,
  handleInputChange,
  children,
}: BotFormProps) {
  return (
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
          {AI_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
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
          {PERSONALITIES.map((personality) => (
            <option key={personality.value} value={personality.value}>
              {personality.label}
            </option>
          ))}
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
      {children}
    </div>
  );
}
