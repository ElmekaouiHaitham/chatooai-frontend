'use client';

import { useState } from 'react';
import AdminNavigation from '../../../components/AdminNavigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

// Mock data for plans
const plans = [
  {
    id: '1',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      '1 AI chatbot',
      '100 messages/day',
      'Basic AI models',
      'Email support'
    ],
    limits: {
      bots: 1,
      messagesPerDay: 100,
      storage: '100MB',
      teamMembers: 1
    },
    status: 'active',
    users: 847,
    revenue: 0
  },
  {
    id: '2',
    name: 'Pro',
    price: 29,
    billingCycle: 'monthly',
    features: [
      '5 AI chatbots',
      '1,000 messages/day',
      'Advanced AI models',
      'Priority support',
      'Custom branding'
    ],
    limits: {
      bots: 5,
      messagesPerDay: 1000,
      storage: '1GB',
      teamMembers: 3
    },
    status: 'active',
    users: 324,
    revenue: 9396
  },
  {
    id: '3',
    name: 'Business',
    price: 99,
    billingCycle: 'monthly',
    features: [
      'Unlimited chatbots',
      'Unlimited messages',
      'All AI models',
      '24/7 phone support',
      'Custom integrations',
      'Advanced analytics'
    ],
    limits: {
      bots: -1, // unlimited
      messagesPerDay: -1, // unlimited
      storage: '10GB',
      teamMembers: 10
    },
    status: 'active',
    users: 76,
    revenue: 7524
  }
];

export default function AdminPlansPage() {
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (name: string) => {
    switch (name) {
      case 'Business':
        return 'bg-purple-100 text-purple-800';
      case 'Pro':
        return 'bg-blue-100 text-blue-800';
      case 'Free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="plans" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Plan Management</h1>
              <p className="text-gray-600 mt-1">
                Configure pricing plans and features
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/admin/plans/create"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Create Plan
              </a>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Export Plans
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{plans.reduce((sum, plan) => sum + plan.users, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${plans.reduce((sum, plan) => sum + plan.revenue, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">{plans.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Plans</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Plan</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Users</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(plan.name)}`}>
                          {plan.name}
                        </span>
                        <span className="text-sm text-gray-500">{plan.billingCycle}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-semibold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{plan.users}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">${plan.revenue}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`/admin/plans/${plan.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </a>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/{plan.billingCycle}</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium">{plan.users}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">${plan.revenue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bots:</span>
                  <span className="font-medium">
                    {plan.limits.bots === -1 ? 'Unlimited' : plan.limits.bots}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Messages/day:</span>
                  <span className="font-medium">
                    {plan.limits.messagesPerDay === -1 ? 'Unlimited' : plan.limits.messagesPerDay}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 flex space-x-2">
                              <a 
                href={`/admin/plans/${plan.id}/edit`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Edit Plan
              </a>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Users
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Analytics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">User Distribution</h3>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        plan.name === 'Free' ? 'bg-gray-400' :
                        plan.name === 'Pro' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}></span>
                      <span className="text-sm font-medium">{plan.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{plan.users} users</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Revenue Distribution</h3>
              <div className="space-y-3">
                {plans.filter(p => p.revenue > 0).map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        plan.name === 'Pro' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></span>
                      <span className="text-sm font-medium">{plan.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">${plan.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
} 