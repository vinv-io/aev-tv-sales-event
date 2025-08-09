import { CheckIn } from '../entities/CheckIn';

export interface ICheckInRepository {
  findAll(): Promise<CheckIn[]>;
  findById(id: string): Promise<CheckIn | null>;
  findByCustomerId(customerId: string): Promise<CheckIn[]>;
  findByEventId(eventId: string): Promise<CheckIn[]>;
  findByDateRange(startDate: string, endDate: string): Promise<CheckIn[]>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  delete(id: string): Promise<void>;
  getCheckInCountByEvent(eventId: string): Promise<number>;
  getCheckInCountByCustomer(customerId: string): Promise<number>;
}
