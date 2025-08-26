"use client";
import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";
import {
  getCurrentUserData,
  getUserBots,
  UserData,
  BotData,
} from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function Analytics() {
  const { user } = useAuth();
  const [userData, setUser] = useState<UserData | null>(null);
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userData = await getCurrentUserData();
      setUser(userData);
      if (userData?.uid) {
        const botsData = await getUserBots(userData.uid);
        setBots(botsData);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Calculate usage for selected period
  const monthlyUsage = userData?.monthlyUsage || [];
  const [period, setPeriod] = useState<"24h" | "7d" | "30d" | "lifetime">(
    "24h"
  );
  let messages = 0,
    botsCount = 0;
  if (monthlyUsage.length > 0) {
    const now = Date.now();
    let ms = 0;
    if (period === "24h") ms = 24 * 60 * 60 * 1000;
    else if (period === "7d") ms = 7 * 24 * 60 * 60 * 1000;
    else if (period === "30d") ms = 30 * 24 * 60 * 60 * 1000;
    monthlyUsage.forEach((entry) => {
      const start = entry.startDate?.seconds
        ? entry.startDate.seconds * 1000
        : 0;
      const end = entry.endDate?.seconds ? entry.endDate.seconds * 1000 : 0;
      if (period === "lifetime") {
        messages += entry.messages;
        botsCount += entry.bots;
      } else if (end > now - ms) {
        const overlapStart = Math.max(start, now - ms);
        const overlapEnd = Math.min(end, now);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        const total = Math.max(1, end - start);
        messages += (entry.messages * overlap) / total;
        botsCount += (entry.bots * overlap) / total;
      }
    });
    messages = Math.round(messages);
    botsCount = Math.round(botsCount);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="analytics" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your chatbot performance and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Messages
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userData?.totalMessages ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bots.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Usage Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📅</span> Monthly Usage
          </h3>
          {loading ? (
            <div className="text-gray-500 flex items-center justify-center h-32 text-lg font-medium">
              Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-green-100 to-blue-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Month Start</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Month End</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Messages</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Bots</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyUsage.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-gray-400 text-center" colSpan={4}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    monthlyUsage.map((entry, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? "bg-white hover:bg-green-50 transition-colors"
                            : "bg-gray-50 hover:bg-green-100 transition-colors"
                        }
                      >
                        <td className="px-6 py-4 font-mono text-sm">
                          {entry.startDate?.seconds
                            ? new Date(entry.startDate.seconds * 1000).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">
                          {entry.endDate?.seconds
                            ? new Date(entry.endDate.seconds * 1000).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-green-700 font-semibold text-lg">
                          {entry.messages ?? 0}
                        </td>
                        <td className="px-6 py-4 text-blue-700 font-semibold text-lg">
                          {"botsPerMonth" in entry
                            ? (entry as any).botsPerMonth
                            : entry.bots ?? 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
