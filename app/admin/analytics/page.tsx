'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '../../../components/AdminNavigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { getAllUsers, UserData } from '../../../lib/firebase';

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real analytics data from user data
  const calculateAnalyticsData = () => {
    const totalUsers = users.length;
    const totalRevenue = users.reduce((sum, user) => sum + (user.revenue || 0), 0);
    const totalBots = users.reduce((sum, user) => sum + (user.bots || 0), 0);
    
    // Calculate user growth (users joined in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = users.filter(user => {
      const joinedDate = user.joined?.toDate ? user.joined.toDate() : new Date(0);
      return joinedDate > thirtyDaysAgo;
    }).length;
    
    const userGrowth = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0;
    
    // Calculate plan distribution
    const planCounts = users.reduce((acc, user) => {
      const plan = user.plan || 'Free';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const planDistribution = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      users: count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
    }));
    
    // Get top users by revenue
    const topUsers = users
      .filter(user => (user.revenue || 0) > 0)
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5)
      .map(user => ({
        name: user.displayName || 'Unknown User',
        email: user.email,
        revenue: user.revenue || 0,
        bots: user.bots || 0
      }));
    
    // Mock bot performance data (can be replaced with real data later)
    const botPerformance = [
      { name: 'Customer Support Bot', messages: 8234, satisfaction: 96 },
      { name: 'Sales Assistant', messages: 3456, satisfaction: 92 },
      { name: 'Appointment Scheduler', messages: 1157, satisfaction: 89 },
      { name: 'Order Tracker', messages: 2678, satisfaction: 94 },
      { name: 'FAQ Bot', messages: 4456, satisfaction: 91 }
    ];
    
    return {
      overview: {
        totalUsers,
        totalRevenue,
        totalBots,
        activeConversations: Math.floor(Math.random() * 50) + 20, // Mock for now
        userGrowth,
        revenueGrowth: 12, // Mock for now
        botGrowth: 18, // Mock for now
        conversationGrowth: 8 // Mock for now
      },
      planDistribution,
      topUsers,
      botPerformance
    };
  };

  const analyticsData = calculateAnalyticsData();

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
        <AdminNavigation currentPage="analytics" />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">
                Detailed platform analytics and insights
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
                <option value="1y">Last year</option>
              </select>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Export Report
              </button>
            </div>
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
              <span className="text-gray-600">Loading analytics...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={analyticsData.overview.totalUsers.toLocaleString()}
              change={analyticsData.overview.userGrowth}
              icon="👥"
              color="bg-blue-100"
            />
            <StatCard
              title="Total Revenue"
              value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
              change={analyticsData.overview.revenueGrowth}
              icon="💰"
              color="bg-yellow-100"
            />
            <StatCard
              title="Total Bots"
              value={analyticsData.overview.totalBots.toLocaleString()}
              change={analyticsData.overview.botGrowth}
              icon="🤖"
              color="bg-green-100"
            />
            <StatCard
              title="Active Conversations"
              value={analyticsData.overview.activeConversations}
              change={analyticsData.overview.conversationGrowth}
              icon="💬"
              color="bg-purple-100"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="users">Users</option>
                  <option value="bots">Bots</option>
                </select>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-600">Chart placeholder</p>
                  <p className="text-sm text-gray-500">Revenue trend over time</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Current Month:</span>
                  <div className="font-semibold text-gray-900">$45,678</div>
                </div>
                <div>
                  <span className="text-gray-500">Growth:</span>
                  <div className="font-semibold text-green-600">+12%</div>
                </div>
                <div>
                  <span className="text-gray-500">Avg Monthly:</span>
                  <div className="font-semibold text-gray-900">$38,000</div>
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Chart placeholder</p>
                  <p className="text-sm text-gray-500">User growth over time</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">New Users:</span>
                  <div className="font-semibold text-gray-900">+47</div>
                </div>
                <div>
                  <span className="text-gray-500">Growth Rate:</span>
                  <div className="font-semibold text-green-600">+23%</div>
                </div>
                <div>
                  <span className="text-gray-500">Conversion:</span>
                  <div className="font-semibold text-gray-900">8.2%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Plan Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
              <div className="space-y-4">
                {analyticsData.planDistribution.map((plan) => (
                  <div key={plan.plan} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        plan.plan === 'Free' ? 'bg-gray-400' :
                        plan.plan === 'Pro' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}></div>
                      <span className="text-sm font-medium">{plan.plan}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{plan.users} users</div>
                      <div className="text-xs text-gray-500">{plan.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-semibold">{analyticsData.planDistribution.reduce((sum, plan) => sum + plan.users, 0)}</span>
                </div>
              </div>
            </div>

            {/* Top Revenue Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Users</h3>
              <div className="space-y-3">
                {analyticsData.topUsers.map((user, index) => (
                  <div key={user.email} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">${user.revenue}</div>
                      <div className="text-xs text-gray-500">{user.bots} bots</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Bots</h3>
              <div className="space-y-3">
                {analyticsData.botPerformance.map((bot, index) => (
                  <div key={bot.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bot.name}</p>
                        <p className="text-xs text-gray-500">{bot.messages.toLocaleString()} messages</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{bot.satisfaction}%</div>
                      <div className="text-xs text-gray-500">satisfaction</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">United States</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Europe</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asia Pacific</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Other</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Usage */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mobile App</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Web Dashboard</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Integration</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Generate Report</h3>
                  <p className="text-sm text-gray-600">Export analytics data</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">📈</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">View Trends</h3>
                  <p className="text-sm text-gray-600">Analyze growth patterns</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600">👥</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">User Insights</h3>
                  <p className="text-sm text-gray-600">Deep user analysis</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">💰</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Revenue Analysis</h3>
                  <p className="text-sm text-gray-600">Financial insights</p>
                </div>
              </button>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
} 