import { 
  GetLeaderboardUseCase,
  GetLeaderboardByDateRangeUseCase,
  GetCustomerRankingUseCase,
  GetTopPerformersUseCase
} from '../use-cases/LeaderboardUseCases';
import { LeaderboardRepositoryImpl } from '../../infrastructure/repositories/LeaderboardRepositoryImpl';
import { LeaderboardEntry } from '../../domain/entities/LeaderboardEntry';

export class LeaderboardApplicationService {
  private leaderboardRepository = new LeaderboardRepositoryImpl();
  
  // Use cases
  private getLeaderboardUseCase = new GetLeaderboardUseCase(this.leaderboardRepository);
  private getLeaderboardByDateRangeUseCase = new GetLeaderboardByDateRangeUseCase(this.leaderboardRepository);
  private getCustomerRankingUseCase = new GetCustomerRankingUseCase(this.leaderboardRepository);
  private getTopPerformersUseCase = new GetTopPerformersUseCase(this.leaderboardRepository);

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return await this.getLeaderboardUseCase.execute(limit);
  }

  async getLeaderboardByDateRange(startDate: string, endDate: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    return await this.getLeaderboardByDateRangeUseCase.execute(startDate, endDate, limit);
  }

  async getCustomerRanking(customerId: string): Promise<number> {
    return await this.getCustomerRankingUseCase.execute(customerId);
  }

  async getTopPerformers(threshold: number = 80): Promise<LeaderboardEntry[]> {
    return await this.getTopPerformersUseCase.execute(threshold);
  }
}
