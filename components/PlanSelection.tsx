'use client';

import { useState, useEffect } from 'react';
import { getAllPlans, PlanData } from '../lib/firebase';

interface PlanSelectionProps {
  onPlanSelect: (planId: string) => void;
  selectedPlanId?: string;
}

export default function PlanSelection({ onPlanSelect, selectedPlanId }: PlanSelectionProps) {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const fetchedPlans = await getAllPlans();
      // Only show active plans
      const activePlans = fetchedPlans.filter(plan => plan.status === 'active');
      setPlans(activePlans);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to fetch plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading plans...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No plans available</div>
        <p className="text-sm text-gray-400">Please contact support for assistance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Plan</h3>
        <p className="text-sm text-gray-600">Select the plan that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedPlanId === plan.id
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onPlanSelect(plan.id)}
          >
            {plan.isPopular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/{plan.billingCycle}</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Bots: </span>
                  <span className="font-medium">
                    {plan.limits.bots === -1 ? 'Unlimited' : plan.limits.bots}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Messages/day: </span>
                  <span className="font-medium">
                    {plan.limits.messagesPerDay === -1 ? 'Unlimited' : plan.limits.messagesPerDay}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Storage: </span>
                  <span className="font-medium">{plan.limits.storage}</span>
                </div>
                {plan.limits.teamMembers > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-600">Team members: </span>
                    <span className="font-medium">
                      {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900">Features:</h5>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-xs text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {selectedPlanId === plan.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedPlanId && (
        <div className="text-center pt-4">
          <p className="text-sm text-green-600 font-medium">
            ✓ Plan selected! You can change this later in your account settings.
          </p>
        </div>
      )}
    </div>
  );
}

