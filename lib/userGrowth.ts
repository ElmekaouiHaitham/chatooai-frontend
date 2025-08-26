import { UserData } from './firebase';

export interface UserGrowthPoint {
  date: string;
  count: number;
}

export function getUserGrowthData(users: UserData[]): UserGrowthPoint[] {
  // Count users joined per day
  const dateCounts: Record<string, number> = {};
  users.forEach(user => {
    const joined = user.joined?.toDate?.() || new Date();
    const dateStr = joined.toISOString().slice(0, 10);
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });
  // Convert to cumulative count
  const sortedDates = Object.keys(dateCounts).sort();
  let cumulative = 0;
  const growth: UserGrowthPoint[] = sortedDates.map(date => {
    cumulative += dateCounts[date];
    return { date, count: cumulative };
  });
  return growth;
}
