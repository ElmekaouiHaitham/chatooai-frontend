import { BotData } from "../lib/firebase";

interface BotCardProps {
  bot: BotData;
}

export default function BotCard({ bot }: BotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200";
      case "disconnected":
        return "bg-red-100 text-red-800 border-red-200";
      case "connecting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Never";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateDescription = (description: string) => {
    if (!description) return "";
    
    // Split by sentences (period, exclamation, question mark)
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // If 1 or fewer sentences, return as is
    if (sentences.length <= 1) {
      return description;
    }
    
    // Return first sentence with proper punctuation
    const firstSentence = sentences[0].trim();
    let result = firstSentence;
    
    // Add period if it doesn't end with punctuation
    if (!result.match(/[.!?]$/)) {
      result += '.';
    }
    
    return result;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {bot.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">{truncateDescription(bot.description)}</p>
          </div>
          <div className="ml-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                bot.whatsapp.status
              )}`}
            >
              {getStatusText(bot.whatsapp.status)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                {bot.stats.messageCount}
              </span>{" "}
              messages
            </div>
            <div className="text-sm text-gray-500">
              Last active: {formatTimeAgo(bot.stats.lastActive)}
            </div>
          </div>
        </div>

        {/* Bot Info */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">AI Model:</span>
            <span className="font-medium text-gray-900">{bot.aiModel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Personality:</span>
            <span className="font-medium text-gray-900 capitalize">
              {bot.personality}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Auto-Reply:</span>
            <span
              className={`font-medium ${
                bot.autoReply ? "text-green-600" : "text-gray-500"
              }`}
            >
              {bot.autoReply ? "Enabled" : "Disabled"}
            </span>
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
