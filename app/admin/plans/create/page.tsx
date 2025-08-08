'use client';

import { useState } from 'react';
import AdminNavigation from '../../../../components/AdminNavigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';

interface PlanFormData {
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'inactive' | 'draft';
  features: string[];
  limits: {
    bots: number;
    messagesPerDay: number;
    storage: string;
    teamMembers: number;
  };
  isPopular: boolean;
  isUnlimited: boolean;
}

export default function CreatePlanPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: 0,
    billingCycle: 'monthly',
    status: 'draft',
    features: ['1 AI chatbot'],
    limits: {
      bots: 1,
      messagesPerDay: 100,
      storage: '100MB',
      teamMembers: 1
    },
    isPopular: false,
    isUnlimited: false
  });

  const [newFeature, setNewFeature] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLimitChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      limits: { ...prev.limits, [field]: value }
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCreatePlan = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreating(false);
    // Redirect to plans page
    window.location.href = '/admin/plans';
  };

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
                <h1 className="text-2xl font-semibold text-gray-900">Create New Plan</h1>
                <p className="text-gray-600 mt-1">Configure a new pricing plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Pro, Business, Enterprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what this plan offers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
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
                    onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">
                    Mark as popular
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUnlimited"
                    checked={formData.isUnlimited}
                    onChange={(e) => handleInputChange('isUnlimited', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isUnlimited" className="ml-2 text-sm text-gray-700">
                    Unlimited plan
                  </label>
                </div>
              </div>
            </div>

            {/* Limits and Features */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Limits & Features</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Bots</label>
                  <input
                    type="number"
                    value={formData.limits.bots}
                    onChange={(e) => handleLimitChange('bots', parseInt(e.target.value) || 0)}
                    disabled={formData.isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="1"
                  />
                  {formData.isUnlimited && (
                    <p className="text-xs text-gray-500 mt-1">Unlimited</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Messages/Day</label>
                  <input
                    type="number"
                    value={formData.limits.messagesPerDay}
                    onChange={(e) => handleLimitChange('messagesPerDay', parseInt(e.target.value) || 0)}
                    disabled={formData.isUnlimited}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="100"
                  />
                  {formData.isUnlimited && (
                    <p className="text-xs text-gray-500 mt-1">Unlimited</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                  <input
                    type="text"
                    value={formData.limits.storage}
                    onChange={(e) => handleLimitChange('storage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100MB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <input
                    type="number"
                    value={formData.limits.teamMembers}
                    onChange={(e) => handleLimitChange('teamMembers', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
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
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Preview</h3>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-900">{formData.name || 'Plan Name'}</h4>
                {formData.isPopular && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${formData.price}</span>
                <span className="text-gray-500">/{formData.billingCycle}</span>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
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
              onClick={handleCreatePlan}
              disabled={!formData.name || isCreating}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
} 