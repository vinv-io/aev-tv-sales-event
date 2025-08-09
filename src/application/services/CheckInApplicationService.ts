import { 
  GetAllCheckInsUseCase,
  GetCheckInByIdUseCase,
  GetCheckInsByCustomerUseCase,
  GetCheckInsByEventUseCase,
  CreateCheckInUseCase,
  DeleteCheckInUseCase,
  GetCheckInStatsUseCase,
  CreateCheckInRequest
} from '../use-cases/CheckInUseCases';
import { CheckInRepositoryImpl } from '../../infrastructure/repositories/CheckInRepositoryImpl';
import { CheckIn } from '../../domain/entities/CheckIn';

export class CheckInApplicationService {
  private checkInRepository = new CheckInRepositoryImpl();
  
  // Use cases
  private getAllCheckInsUseCase = new GetAllCheckInsUseCase(this.checkInRepository);
  private getCheckInByIdUseCase = new GetCheckInByIdUseCase(this.checkInRepository);
  private getCheckInsByCustomerUseCase = new GetCheckInsByCustomerUseCase(this.checkInRepository);
  private getCheckInsByEventUseCase = new GetCheckInsByEventUseCase(this.checkInRepository);
  private createCheckInUseCase = new CreateCheckInUseCase(this.checkInRepository);
  private deleteCheckInUseCase = new DeleteCheckInUseCase(this.checkInRepository);
  private getCheckInStatsUseCase = new GetCheckInStatsUseCase(this.checkInRepository);

  async getAllCheckIns(): Promise<CheckIn[]> {
    return await this.getAllCheckInsUseCase.execute();
  }

  async getCheckInById(id: string): Promise<CheckIn> {
    return await this.getCheckInByIdUseCase.execute(id);
  }

  async getCheckInsByCustomer(customerId: string): Promise<CheckIn[]> {
    return await this.getCheckInsByCustomerUseCase.execute(customerId);
  }

  async getCheckInsByEvent(eventId: string): Promise<CheckIn[]> {
    return await this.getCheckInsByEventUseCase.execute(eventId);
  }

  async createCheckIn(request: CreateCheckInRequest): Promise<CheckIn> {
    return await this.createCheckInUseCase.execute(request);
  }

  async deleteCheckIn(id: string): Promise<void> {
    return await this.deleteCheckInUseCase.execute(id);
  }

  async getCheckInStats(eventId?: string): Promise<{
    totalCheckIns: number;
    uniqueCustomers: number;
    todayCheckIns: number;
  }> {
    return await this.getCheckInStatsUseCase.execute(eventId);
  }
}
