interface Bot {
  id: string;
  title: string;
  description: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastActive: string;
  messageCount: number;
}

interface BotCardProps {
  bot: Bot;
}

export default function BotCard({ bot }: BotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {bot.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {bot.description}
            </p>
          </div>
          <div className="ml-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bot.status)}`}>
              {getStatusText(bot.status)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{bot.messageCount}</span> messages
            </div>
            <div className="text-sm text-gray-500">
              Last active: {bot.lastActive}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <a 
            href={`/bot/${bot.id}`}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
          >
            Open Bot
          </a>
          <a 
            href={`/bot/${bot.id}/settings`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
          >
            Manage
          </a>
        </div>
      </div>
    </div>
  );
} 