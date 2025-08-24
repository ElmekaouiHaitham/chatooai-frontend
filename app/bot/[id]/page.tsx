'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import { getBotById, BotData } from '../../../lib/firebase';

export default function BotDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [bot, setBot] = useState<BotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [whatsappStatus, setWhatsappStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let botId = params.id;
    if (!botId) return;

    // Connect WebSocket
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => console.log(`WebSocket connected for bot ${botId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Only update QR for this bot
      if (data.botId === botId && data.qr) {
        setQr(data.qr);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");

    // Fetch fallback QR and bot name
    fetch(`http://localhost:5000/qr/${botId}`)
      .then(res => res.json())
      .then(data => setQr(data.qr));


    return () => ws.close();
  }, [bot]);

  useEffect(() => {
    const fetchBot = async () => {
      try {
        if (typeof params.id === 'string') {
          const botData = await getBotById(params.id);
          if (botData) {
            setBot(botData);
            setWhatsappStatus(botData.whatsapp.status);
          } else {
            setError('Bot not found');
          }
        }
      } catch (err) {
        setError('Failed to load bot');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [params.id]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bot Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The bot you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Bot Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
                  <p className="text-gray-600">{bot.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(whatsappStatus)}`}>
                  {getStatusText(whatsappStatus)}
                </span>
                
            
                {whatsappStatus === 'disconnected' && (
                  <button
                    disabled
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md opacity-50 cursor-not-allowed"
                  >
                    Connecting...
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* WhatsApp Connection Status */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">WhatsApp Connection</h2>
                
                {whatsappStatus === 'disconnected' && qr && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Scan this QR code with your WhatsApp app to connect:</p>
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <img src={qr} alt="QR Code" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Open WhatsApp → Settings → Linked Devices → Link a Device
                    </p>
                  </div>
                )}
                
                {whatsappStatus === 'connected' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Successfully Connected!</h3>
                    <p className="text-gray-600">Your bot is now ready to receive and respond to messages.</p>
                  </div>
                )}
                
                {whatsappStatus === 'error' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Failed</h3>
                    <p className="text-gray-600 mb-4">There was an error connecting to WhatsApp.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Configuration */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">AI Model</span>
                    <p className="text-gray-900">{bot.aiModel}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Personality</span>
                    <p className="text-gray-900 capitalize">{bot.personality}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Auto Reply</span>
                    <p className="text-gray-900">{bot.autoReply ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Messages</span>
                    <p className="text-2xl font-bold text-gray-900">{bot.stats.messageCount}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Users</span>
                    <p className="text-2xl font-bold text-gray-900">{bot.stats.totalUsers}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Active</span>
                    <p className="text-gray-900">
                      {bot.stats.lastActive ? new Date(bot.stats.lastActive.toDate()).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push(`/bot/${bot.id}/settings`)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Bot
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
