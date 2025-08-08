import Navigation from '../../components/Navigation';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="analytics" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your chatbot performance and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">12,847</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">+12%</span>
              <span className="text-gray-600 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">+8%</span>
              <span className="text-gray-600 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3s</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">-15%</span>
              <span className="text-gray-600 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">😊</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">+3%</span>
              <span className="text-gray-600 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Message Volume Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Volume</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">Chart placeholder</p>
                <p className="text-sm text-gray-500">Message volume over time</p>
              </div>
            </div>
          </div>

          {/* Bot Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bot Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Customer Support Bot</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">8,234 messages</div>
                  <div className="text-xs text-gray-600">96% satisfaction</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sales Assistant</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">3,456 messages</div>
                  <div className="text-xs text-gray-600">92% satisfaction</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Appointment Scheduler</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">1,157 messages</div>
                  <div className="text-xs text-gray-600">89% satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Topics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Product Information</span>
                <span className="text-sm font-semibold">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Technical Support</span>
                <span className="text-sm font-semibold">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pricing Questions</span>
                <span className="text-sm font-semibold">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Appointment Booking</span>
                <span className="text-sm font-semibold">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Other</span>
                <span className="text-sm font-semibold">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          {/* Response Time Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Analysis</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.3s</div>
                <div className="text-sm text-gray-600">Average Response Time</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Under 1s</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>1-3s</span>
                  <span className="font-medium">38%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3-5s</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Over 5s</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Activity Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">9:00 AM - 11:00 AM</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">2:00 PM - 4:00 PM</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-xs font-medium">72%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">7:00 PM - 9:00 PM</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-xs font-medium">58%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">11:00 PM - 1:00 AM</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  <span className="text-xs font-medium">23%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 