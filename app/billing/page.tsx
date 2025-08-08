import Navigation from '../../components/Navigation';

export default function Billing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="billing" />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Plan</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                    <p className="text-gray-600">$29/month</p>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Messages Used</span>
                    <div className="font-semibold text-gray-900">1,247 / 1,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Bots Active</span>
                    <div className="font-semibold text-gray-900">3 / 5</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Billing</span>
                    <div className="font-semibold text-gray-900">Dec 15, 2024</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Upgrade Plan
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  Cancel Plan
                </button>
              </div>
            </div>

            {/* Usage Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Messages This Month</span>
                    <span className="text-sm text-green-600">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">1,247</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Active Conversations</span>
                    <span className="text-sm text-green-600">+8%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💳</span>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/25</div>
                    </div>
                  </div>
                  <span className="text-green-500 text-sm">Default</span>
                </div>
                
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">➕</span>
                    <span className="text-sm font-medium">Add Payment Method</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm">Nov 15, 2024</div>
                    <div className="text-xs text-gray-600">Pro Plan</div>
                  </div>
                  <div className="text-sm font-medium">$29.00</div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm">Oct 15, 2024</div>
                    <div className="text-xs text-gray-600">Pro Plan</div>
                  </div>
                  <div className="text-sm font-medium">$29.00</div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm">Sep 15, 2024</div>
                    <div className="text-xs text-gray-600">Pro Plan</div>
                  </div>
                  <div className="text-sm font-medium">$29.00</div>
                </div>
              </div>
              
              <button className="w-full mt-4 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                View All Invoices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 