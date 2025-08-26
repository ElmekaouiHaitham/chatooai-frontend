// botsGrowth.ts
import { BotData } from './firebase'; // Assuming you have a BotData type similar to UserData

export interface BotGrowthPoint {
  date: string;
  count: number;
}

export function getBotGrowthData(bots: BotData[]): BotGrowthPoint[] {
  // Count bots created per day
  const dateCounts: Record<string, number> = {};
  bots.forEach(bot => {
    const created = bot.createdAt?.toDate?.() || new Date();
    const dateStr = created.toISOString().slice(0, 10);
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  // Convert to cumulative count
  const sortedDates = Object.keys(dateCounts).sort();
  let cumulative = 0;
  const growth: BotGrowthPoint[] = sortedDates.map(date => {
    cumulative += dateCounts[date];
    return { date, count: cumulative };
  });

  return growth;
}
