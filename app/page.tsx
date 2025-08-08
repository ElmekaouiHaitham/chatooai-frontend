import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-500">ChatTooAI</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-green-500 transition-colors">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-green-500 transition-colors">Pricing</a>
          <a href="#contact" className="text-gray-600 hover:text-green-500 transition-colors">Contact</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="/login" className="text-gray-600 hover:text-green-500 transition-colors">Login</a>
          <a href="/signup" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
                Automate WhatsApp with AI in Seconds
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create smart bots. Respond 24/7. No code required. Connect your WhatsApp business with any AI model through a simple QR code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/signup" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl text-center">
                  Get Started Free
                </a>
                <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                  See Pricing
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
                <div className="bg-gray-100 rounded-lg p-6 mb-4">
                  <div className="w-32 h-32 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-4xl">📱</div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">QR Code Connection</h3>
                    <p className="text-gray-600 text-sm">Scan and connect instantly</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">AI-powered responses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">24/7 availability</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Multi-language support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make creating and managing your WhatsApp AI chatbot effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy WhatsApp Connection</h3>
              <p className="text-gray-600">
                Connect your WhatsApp business account instantly with a simple QR code scan. No complex setup required.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Smart Replies</h3>
              <p className="text-gray-600">
                Choose from any AI model - GPT, Claude, or custom models. Get intelligent, contextual responses 24/7.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Code, Just Setup & Go</h3>
              <p className="text-gray-600">
                Intuitive dashboard with drag-and-drop interface. Set up your chatbot in minutes, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start border border-gray-200 hover:border-green-500 transition">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">1 AI chatbot</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">100 messages/day</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Basic AI models</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors">
                Get Started Free
              </button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start border-2 border-green-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">5 AI chatbots</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">1,000 messages/day</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Advanced AI models</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Custom branding</span>
                </li>
              </ul>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Choose Pro
              </button>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start border border-gray-200 hover:border-green-500 transition">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Business</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Unlimited chatbots</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Unlimited messages</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">All AI models</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">24/7 phone support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Custom integrations</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors">
                Choose Business
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-green-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Start Building Your Chatbot Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses automating their WhatsApp communication
          </p>
          <button className="bg-white text-green-500 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-4">ChatTooAI</h3>
              <p className="text-gray-400">
                The easiest way to create AI-powered WhatsApp chatbots for your business.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 ChatTooAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
