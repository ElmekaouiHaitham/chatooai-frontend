'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';

interface BotFormData {
  name: string;
  description: string;
  avatar: string;
  aiModel: string;
  personality: string;
  autoReply: boolean;
  workingHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  features: {
    fileSharing: boolean;
    voiceMessages: boolean;
    quickReplies: boolean;
    analytics: boolean;
  };
}

const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most advanced model, best for complex tasks', price: 'Premium' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Fast and efficient, good for most use cases', price: 'Standard' },
  { id: 'claude-3', name: 'Claude 3', description: 'Excellent for analysis and reasoning', price: 'Premium' },
  { id: 'custom', name: 'Custom Model', description: 'Use your own trained model', price: 'Enterprise' }
];

const personalities = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-like', icon: '💼' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and approachable', icon: '😊' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and informal', icon: '😎' },
  { id: 'formal', name: 'Formal', description: 'Strict and structured', icon: '🎩' }
];

const avatars = [
  '🎧', '💼', '📅', '🛒', '🏥', '🏫', '🏢', '🍕', '🚗', '✈️', '🏦', '🎨', '📚', '⚡', '🔧', '💡'
];

export default function CreateBotPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    description: '',
    avatar: '🎧',
    aiModel: 'gpt-3.5',
    personality: 'professional',
    autoReply: true,
    workingHours: {
      enabled: false,
      start: '09:00',
      end: '17:00',
      timezone: 'UTC'
    },
    features: {
      fileSharing: false,
      voiceMessages: false,
      quickReplies: true,
      analytics: true
    }
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [field]: value }
    }));
  };

  const handleFeatureToggle = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateBot = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreating(false);
    // Redirect to the new bot
    window.location.href = '/dashboard';
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.aiModel && formData.personality;
      case 3:
        return true; // Working hours are optional
      case 4:
        return true; // Features are optional
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        <p className="text-gray-600 mb-6">Let's start with the basics. Give your bot a name and description.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Customer Support Bot"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe what this bot will do..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bot Avatar</label>
          <div className="grid grid-cols-8 gap-2">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => handleInputChange('avatar', avatar)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-colors ${
                  formData.avatar === avatar
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Configuration</h2>
        <p className="text-gray-600 mb-6">Choose the AI model and personality for your bot.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">AI Model</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiModels.map((model) => (
              <div
                key={model.id}
                onClick={() => handleInputChange('aiModel', model.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.aiModel === model.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{model.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    model.price === 'Premium' ? 'bg-purple-100 text-purple-800' :
                    model.price === 'Enterprise' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {model.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{model.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Personality</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalities.map((personality) => (
              <div
                key={personality.id}
                onClick={() => handleInputChange('personality', personality.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.personality === personality.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{personality.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{personality.name}</h3>
                    <p className="text-sm text-gray-600">{personality.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Reply</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleInputChange('autoReply', !formData.autoReply)}
              className={`w-12 h-6 rounded-full transition-colors ${
                formData.autoReply ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                formData.autoReply ? 'transform translate-x-6' : 'transform translate-x-1'
              }`} />
            </button>
            <span className="text-sm text-gray-600">
              Automatically respond to messages when offline
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Working Hours</h2>
        <p className="text-gray-600 mb-6">Set when your bot should be available (optional).</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleWorkingHoursChange('enabled', !formData.workingHours.enabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.workingHours.enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              formData.workingHours.enabled ? 'transform translate-x-6' : 'transform translate-x-1'
            }`} />
          </button>
          <span className="text-sm font-medium text-gray-700">Enable working hours</span>
        </div>

        {formData.workingHours.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={formData.workingHours.timezone}
                onChange={(e) => handleWorkingHoursChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <p className="text-gray-600 mb-6">Choose which features to enable for your bot.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-900">File Sharing</h3>
            <p className="text-sm text-gray-600">Allow users to send and receive files</p>
          </div>
          <button
            onClick={() => handleFeatureToggle('fileSharing', !formData.features.fileSharing)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.features.fileSharing ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              formData.features.fileSharing ? 'transform translate-x-6' : 'transform translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-900">Voice Messages</h3>
            <p className="text-sm text-gray-600">Support for voice message transcription</p>
          </div>
          <button
            onClick={() => handleFeatureToggle('voiceMessages', !formData.features.voiceMessages)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.features.voiceMessages ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              formData.features.voiceMessages ? 'transform translate-x-6' : 'transform translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-900">Quick Replies</h3>
            <p className="text-sm text-gray-600">Pre-defined response templates</p>
          </div>
          <button
            onClick={() => handleFeatureToggle('quickReplies', !formData.features.quickReplies)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.features.quickReplies ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              formData.features.quickReplies ? 'transform translate-x-6' : 'transform translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">Track conversation metrics and insights</p>
          </div>
          <button
            onClick={() => handleFeatureToggle('analytics', !formData.features.analytics)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.features.analytics ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              formData.features.analytics ? 'transform translate-x-6' : 'transform translate-x-1'
            }`} />
          </button>
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
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard"
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                ← Back to Dashboard
              </a>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Bot</h1>
                <p className="text-sm text-gray-600">Set up your AI-powered WhatsApp chatbot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateBot}
                disabled={!isStepValid() || isCreating}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                {isCreating ? 'Creating Bot...' : 'Create Bot'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 