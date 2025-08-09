import { LeaderboardEntry } from '../../domain/entities/LeaderboardEntry';
import { ILeaderboardRepository } from '../../domain/repositories/ILeaderboardRepository';

export class GetLeaderboardUseCase {
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  async execute(limit: number = 10): Promise<LeaderboardEntry[]> {
    if (limit <= 0) {
      throw new Error('Limit must be positive');
    }

    return await this.leaderboardRepository.getLeaderboard(limit);
  }
}

export class GetLeaderboardByDateRangeUseCase {
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  async execute(startDate: string, endDate: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    if (limit <= 0) {
      throw new Error('Limit must be positive');
    }

    if (startDate > endDate) {
      throw new Error('Start date cannot be later than end date');
    }

    return await this.leaderboardRepository.getLeaderboardByDateRange(startDate, endDate, limit);
  }
}

export class GetCustomerRankingUseCase {
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  async execute(customerId: string): Promise<number> {
    return await this.leaderboardRepository.getCustomerRanking(customerId);
  }
}

export class GetTopPerformersUseCase {
  constructor(private leaderboardRepository: ILeaderboardRepository) {}

  async execute(threshold: number = 80): Promise<LeaderboardEntry[]> {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }

    return await this.leaderboardRepository.getTopPerformers(threshold);
  }
}
