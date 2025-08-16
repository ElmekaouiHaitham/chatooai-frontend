'use client';

import { useState, useEffect } from 'react';
import BotCard from '../../components/BotCard';
import Navigation from '../../components/Navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { getUserBots, BotData, getCurrentUserData, testFirestoreAccess } from '../../lib/firebase';

export default function Dashboard() {
  const { user } = useAuth();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBots = async () => {
      if (!user) {
        console.log('No user found, skipping bot fetch');
        return;
      }
      
      console.log(`Starting to fetch bots for user: ${user.uid}`);
      
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        const userBots = await getUserBots(user.uid);
        console.log(`Successfully fetched ${userBots.length} bots for user ${user.uid}:`, userBots);
        setBots(userBots);
      } catch (err) {
        console.error('Error fetching bots:', err);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to load bots';
        if (err instanceof Error) {
          if (err.message.includes('permission-denied')) {
            errorMessage = 'Access denied. Please check your permissions.';
          } else if (err.message.includes('unavailable')) {
            errorMessage = 'Service temporarily unavailable. Please try again.';
          } else if (err.message.includes('not-found')) {
            errorMessage = 'No bots found. Create your first bot to get started!';
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation currentPage="dashboard" />

        {/* Dashboard Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">My Chatbots</h1>
                <p className="text-gray-600 mt-1">
                  Manage your AI-powered WhatsApp chatbots
                </p>
                {user && (
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome back, {user.displayName || user.email}
                  </p>
                )}
              </div>
              <a 
                href="/bot/create"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md inline-block"
              >
                + Create New Bot
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading bots...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : bots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-3xl">🤖</div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          No chatbots yet
        </h3>
        <p className="text-gray-600 mb-8">
          Create your first AI-powered WhatsApp chatbot to start automating your customer communication.
        </p>
        <a 
          href="/bot/create"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md inline-block"
        >
          Create Your First Bot
        </a>
      </div>
    </div>
  );
} 