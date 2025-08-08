'use client';

import BotCard from '../../components/BotCard';
import Navigation from '../../components/Navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockBots = [
  {
    id: '1',
    title: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    status: 'connected' as const,
    lastActive: '2 hours ago',
    messageCount: 156
  },
  {
    id: '2',
    title: 'Sales Assistant',
    description: 'Qualifies leads and answers product questions',
    status: 'disconnected' as const,
    lastActive: '1 day ago',
    messageCount: 89
  },
  {
    id: '3',
    title: 'Appointment Scheduler',
    description: 'Books appointments and manages calendar',
    status: 'connecting' as const,
    lastActive: '5 minutes ago',
    messageCount: 234
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const bots = mockBots; // In real app, this would come from API/state

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
          {bots.length > 0 ? (
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