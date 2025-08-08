import Navigation from '../../../components/Navigation';
import QRConnect from '../../../components/QRConnect';
import ChatInterface from '../../../components/ChatInterface';

// Mock data - in real app this would come from API
const getBotData = (id: string) => {
  const bots = {
    '1': {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      status: 'connected' as const,
      lastActive: '2 hours ago',
      messageCount: 156,
      avatar: '🎧'
    },
    '2': {
      id: '2',
      name: 'Sales Assistant',
      description: 'Qualifies leads and answers product questions',
      status: 'disconnected' as const,
      lastActive: '1 day ago',
      messageCount: 89,
      avatar: '💼'
    },
    '3': {
      id: '3',
      name: 'Appointment Scheduler',
      description: 'Books appointments and manages calendar',
      status: 'connecting' as const,
      lastActive: '5 minutes ago',
      messageCount: 234,
      avatar: '📅'
    }
  };
  
  return bots[id as keyof typeof bots] || null;
};

interface BotDetailPageProps {
  params: {
    id: string;
  };
}

export default function BotDetailPage({ params }: BotDetailPageProps) {
  const bot = getBotData(params.id);

  if (!bot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Bot Not Found</h1>
            <p className="text-gray-600 mb-6">The bot you're looking for doesn't exist.</p>
            <a 
              href="/dashboard" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard" 
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                ← Back to Dashboard
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{bot.avatar}</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{bot.name}</h1>
                  <p className="text-sm text-gray-600">{bot.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  bot.status === 'connected' 
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : bot.status === 'disconnected'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {bot.status === 'connected' ? 'Connected' : 
                   bot.status === 'disconnected' ? 'Disconnected' : 'Connecting...'}
                </span>
              </div>
              
              <a 
                href={`/bot/${bot.id}/settings`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ⚙️ Settings
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {bot.status === 'connected' ? (
          <ChatInterface bot={bot} />
        ) : (
          <QRConnect bot={bot} />
        )}
      </div>
    </div>
  );
} 