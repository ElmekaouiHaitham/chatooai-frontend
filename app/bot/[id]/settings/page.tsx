'use client';

import { useState } from 'react';
import Navigation from '../../../../components/Navigation';

// Mock data - in real app this would come from API
const getBotData = (id: string) => {
  const bots = {
    '1': {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      status: 'connected' as const,
      lastActive: '2 hours ago',
      messageCount: 156,
      avatar: '🎧',
      aiModel: 'gpt-4',
      personality: 'professional',
      autoReply: true,
      workingHours: {
        enabled: true,
        start: '09:00',
        end: '17:00',
        timezone: 'UTC'
      },
      features: {
        fileSharing: true,
        voiceMessages: false,
        quickReplies: true,
        analytics: true
      }
    },
    '2': {
      id: '2',
      name: 'Sales Assistant',
      description: 'Qualifies leads and answers product questions',
      status: 'disconnected' as const,
      lastActive: '1 day ago',
      messageCount: 89,
      avatar: '💼',
      aiModel: 'claude-3',
      personality: 'friendly',
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
    },
    '3': {
      id: '3',
      name: 'Appointment Scheduler',
      description: 'Books appointments and manages calendar',
      status: 'connecting' as const,
      lastActive: '5 minutes ago',
      messageCount: 234,
      avatar: '📅',
      aiModel: 'gpt-3.5',
      personality: 'formal',
      autoReply: false,
      workingHours: {
        enabled: true,
        start: '08:00',
        end: '18:00',
        timezone: 'UTC'
      },
      features: {
        fileSharing: true,
        voiceMessages: true,
        quickReplies: false,
        analytics: true
      }
    }
  };
  
  return bots[id as keyof typeof bots] || null;
};

interface BotSettingsPageProps {
  params: {
    id: string;
  };
}

export default function BotSettingsPage({ params }: BotSettingsPageProps) {
  const bot = getBotData(params.id);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState(bot ? {
    name: bot.name,
    description: bot.description,
    aiModel: bot.aiModel,
    personality: bot.personality,
    autoReply: bot.autoReply,
    workingHours: { ...bot.workingHours },
    features: { ...bot.features }
  } : null);

  if (!bot || !formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Bot Not Found</h1>
            <p className="text-gray-600 mb-6">The bot you're looking for doesn't exist.</p>
            <a 
              href="/dashboard" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev!, [field]: value }));
    setHasChanges(true);
  };

  const handleWorkingHoursChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev!,
      workingHours: { ...prev!.workingHours, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleFeatureToggle = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev!,
      features: { ...prev!.features, [feature]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most advanced model, best for complex tasks' },
    { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Fast and efficient, good for most use cases' },
    { id: 'claude-3', name: 'Claude 3', description: 'Excellent for analysis and reasoning' },
    { id: 'custom', name: 'Custom Model', description: 'Use your own trained model' }
  ];

  const personalities = [
    { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and informal' },
    { id: 'formal', name: 'Formal', description: 'Strict and structured' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href={`/bot/${bot.id}`}
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                ← Back to Bot
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{bot.avatar}</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600">{bot.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter bot name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                <select
                  value={formData.aiModel}
                  onChange={(e) => handleInputChange('aiModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {aiModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {aiModels.find(m => m.id === formData.aiModel)?.description}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe what this bot does..."
              />
            </div>
          </div>

          {/* Personality & Behavior */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personality & Behavior</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
                <select
                  value={formData.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {personalities.map((personality) => (
                    <option key={personality.id} value={personality.id}>
                      {personality.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {personalities.find(p => p.id === formData.personality)?.description}
                </p>
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
                    {formData.autoReply ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically respond to messages when offline
                </p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Working Hours</h2>
            
            <div className="space-y-4">
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

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Features</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
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
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
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
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
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
              
              <div className="flex items-center justify-between py-3">
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
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Desktop Save Button */}
      <div className="hidden md:block max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 