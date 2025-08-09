import { CheckIn } from '../../domain/entities/CheckIn';
import { ICheckInRepository } from '../../domain/repositories/ICheckInRepository';
import { NotFoundError, BusinessRuleError } from '../../shared/errors/DomainErrors';

export interface CreateCheckInRequest {
  customerId: string;
  customerPhone: string;
  shopName: string;
  eventId: string;
  location?: string;
  notes?: string;
}

export class GetAllCheckInsUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(): Promise<CheckIn[]> {
    return await this.checkInRepository.findAll();
  }
}

export class GetCheckInByIdUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInRepository.findById(id);
    if (!checkIn) {
      throw new NotFoundError('CheckIn', id);
    }
    return checkIn;
  }
}

export class GetCheckInsByCustomerUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(customerId: string): Promise<CheckIn[]> {
    return await this.checkInRepository.findByCustomerId(customerId);
  }
}

export class GetCheckInsByEventUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(eventId: string): Promise<CheckIn[]> {
    return await this.checkInRepository.findByEventId(eventId);
  }
}

export class CreateCheckInUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(request: CreateCheckInRequest): Promise<CheckIn> {
    // Generate check-in details
    const now = new Date();
    const checkInDate = now.toISOString().split('T')[0];
    const checkInTime = now.toTimeString().split(' ')[0];
    const id = `CHK${Date.now()}`;

    // Business rule: Prevent duplicate check-ins on same day for same event
    const existingCheckIns = await this.checkInRepository.findByCustomerId(request.customerId);
    const todayCheckInForEvent = existingCheckIns.find(checkIn => 
      checkIn.checkInDate === checkInDate && checkIn.eventId === request.eventId
    );

    if (todayCheckInForEvent) {
      throw new BusinessRuleError('Customer has already checked in for this event today');
    }

    // Create domain entity
    const checkIn = new CheckIn(
      id,
      request.customerId,
      request.customerPhone,
      request.shopName,
      request.eventId,
      checkInDate,
      checkInTime,
      request.location,
      request.notes
    );

    // Save to repository
    return await this.checkInRepository.save(checkIn);
  }
}

export class DeleteCheckInUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(id: string): Promise<void> {
    const checkIn = await this.checkInRepository.findById(id);
    if (!checkIn) {
      throw new NotFoundError('CheckIn', id);
    }

    // Business rule: Can only delete check-ins from today
    if (!checkIn.isToday()) {
      throw new BusinessRuleError('Can only delete check-ins from today');
    }

    await this.checkInRepository.delete(id);
  }
}

export class GetCheckInStatsUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(eventId?: string): Promise<{
    totalCheckIns: number;
    uniqueCustomers: number;
    todayCheckIns: number;
  }> {
    const checkIns = eventId 
      ? await this.checkInRepository.findByEventId(eventId)
      : await this.checkInRepository.findAll();

    const uniqueCustomers = new Set(checkIns.map(c => c.customerId)).size;
    const todayCheckIns = checkIns.filter(c => c.isToday()).length;

    return {
      totalCheckIns: checkIns.length,
      uniqueCustomers,
      todayCheckIns
    };
  }
}
