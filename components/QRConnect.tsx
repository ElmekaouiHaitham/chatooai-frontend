'use client';

import { useState } from 'react';

interface Bot {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastActive: string;
  messageCount: number;
  avatar: string;
}

interface QRConnectProps {
  bot: Bot;
}

export default function QRConnect({ bot }: QRConnectProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
            {isRefreshing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            ) : (
              <div className="text-6xl">📱</div>
            )}
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Connect {bot.name} to WhatsApp
          </h2>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">1.</span>
              <p className="text-gray-600">Open WhatsApp on your phone</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">2.</span>
              <p className="text-gray-600">Tap Menu or Settings and select WhatsApp Web</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">3.</span>
              <p className="text-gray-600">Point your phone to this screen to capture the QR code</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh QR Code'}
            </button>
            
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 