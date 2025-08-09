import { LeaderboardEntry } from '../entities/LeaderboardEntry';

export interface ILeaderboardRepository {
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getLeaderboardByDateRange(startDate: string, endDate: string, limit?: number): Promise<LeaderboardEntry[]>;
  getCustomerRanking(customerId: string): Promise<number>;
  getTopPerformers(threshold?: number): Promise<LeaderboardEntry[]>;
}
