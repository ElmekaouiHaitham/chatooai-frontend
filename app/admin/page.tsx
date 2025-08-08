'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '../../components/AdminNavigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getAllUsers, UserData } from '../../lib/firebase';

// Mock data for admin dashboard
const kpiData = {
  totalUsers: 1247,
  totalBots: 3421,
  totalRevenue: 45678,
  activeConversations: 89,
  userGrowth: 23,
  botGrowth: 18,
  revenueGrowth: 12,
  conversationGrowth: 8
};

const userGrowthData = [
  { date: '2024-11-01', users: 1200 },
  { date: '2024-11-02', users: 1210 },
  { date: '2024-11-03', users: 1225 },
  { date: '2024-11-04', users: 1235 },
  { date: '2024-11-05', users: 1240 },
  { date: '2024-11-06', users: 1245 },
  { date: '2024-11-07', users: 1247 },
  { date: '2024-11-08', users: 1250 },
  { date: '2024-11-09', users: 1255 },
  { date: '2024-11-10', users: 1260 },
  { date: '2024-11-11', users: 1265 },
  { date: '2024-11-12', users: 1270 },
  { date: '2024-11-13', users: 1275 },
  { date: '2024-11-14', users: 1280 },
  { date: '2024-11-15', users: 1285 },
  { date: '2024-11-16', users: 1290 },
  { date: '2024-11-17', users: 1295 },
  { date: '2024-11-18', users: 1300 },
  { date: '2024-11-19', users: 1305 },
  { date: '2024-11-20', users: 1310 },
  { date: '2024-11-21', users: 1315 },
  { date: '2024-11-22', users: 1320 },
  { date: '2024-11-23', users: 1325 },
  { date: '2024-11-24', users: 1330 },
  { date: '2024-11-25', users: 1335 },
  { date: '2024-11-26', users: 1340 },
  { date: '2024-11-27', users: 1345 },
  { date: '2024-11-28', users: 1350 },
  { date: '2024-11-29', users: 1355 },
  { date: '2024-11-30', users: 1360 }
];

const recentBots = [
  {
    id: '1',
    name: 'Customer Support Bot',
    owner: 'John Smith',
    status: 'connected',
    messages: 156,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sales Assistant',
    owner: 'Sarah Johnson',
    status: 'connected',
    messages: 89,
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Appointment Scheduler',
    owner: 'Mike Chen',
    status: 'disconnected',
    messages: 234,
    lastActive: '1 day ago'
  },
  {
    id: '4',
    name: 'Order Tracker',
    owner: 'Emily Davis',
    status: 'connected',
    messages: 67,
    lastActive: '30 minutes ago'
  },
  {
    id: '5',
    name: 'FAQ Bot',
    owner: 'David Wilson',
    status: 'connected',
    messages: 445,
    lastActive: '15 minutes ago'
  }
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentUsers();
  }, []);

  const fetchRecentUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      // Sort by joined date (most recent first) and take the first 5
      const sortedUsers = allUsers
        .sort((a, b) => {
          const dateA = a.joined?.toDate ? a.joined.toDate() : (a.joined ? new Date(a.joined as any) : new Date(0));
          const dateB = b.joined?.toDate ? b.joined.toDate() : (b.joined ? new Date(b.joined as any) : new Date(0));
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
      setRecentUsers(sortedUsers);
    } catch (err) {
      console.error('Error fetching recent users:', err);
      setError('Failed to fetch recent users');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
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

  const StatCard = ({ title, value, change, icon, color }: {
    title: string;
    value: string | number;
    change: number;
    icon: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Platform overview and management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={kpiData.totalUsers.toLocaleString()}
            change={kpiData.userGrowth}
            icon="👥"
            color="bg-blue-100"
          />
          <StatCard
            title="Total Bots"
            value={kpiData.totalBots.toLocaleString()}
            change={kpiData.botGrowth}
            icon="🤖"
            color="bg-green-100"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${kpiData.totalRevenue.toLocaleString()}`}
            change={kpiData.revenueGrowth}
            icon="💰"
            color="bg-yellow-100"
          />
          <StatCard
            title="Active Conversations"
            value={kpiData.activeConversations}
            change={kpiData.conversationGrowth}
            icon="💬"
            color="bg-purple-100"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-600">Chart placeholder</p>
                <p className="text-sm text-gray-500">User growth visualization</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Growth:</span>
                <span className="font-medium text-green-600 ml-2">+160 users</span>
              </div>
              <div>
                <span className="text-gray-500">Avg Daily:</span>
                <span className="font-medium text-blue-600 ml-2">+5.3 users</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <a href="/admin/users" className="text-sm text-green-600 hover:text-green-700">
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : recentUsers.slice(0, 3).map((user) => (
                <div key={user.uid} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.displayName || 'No Name'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan || 'Free')}`}>
                      {user.plan || 'Free'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(user.joined)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <a href="/admin/users" className="text-sm text-green-600 hover:text-green-700">
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading users...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bots</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.uid} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.displayName || 'No Name'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan || 'Free')}`}>
                            {user.plan || 'Free'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{user.bots || 0}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{formatTimeAgo(user.joined)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Bots */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bots</h2>
              <a href="/admin/bots" className="text-sm text-green-600 hover:text-green-700">
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bot</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Owner</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Messages</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBots.map((bot) => (
                    <tr key={bot.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{bot.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{bot.owner}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bot.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bot.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{bot.messages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </div>
            </a>
            
            <a
              href="/admin/plans"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">💳</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Plans</h3>
                <p className="text-sm text-gray-600">Configure pricing plans</p>
              </div>
            </a>
            
            <a
              href="/admin/analytics"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📊</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Detailed platform analytics</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
} 