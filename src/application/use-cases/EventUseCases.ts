import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { NotFoundError, BusinessRuleError } from '../../shared/errors/DomainErrors';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';
import { DateRange } from '../../domain/value-objects/DateRange';

export interface CreateEventRequest {
  name: { en: string; vi: string };
  startDate: string;
  endDate: string;
  status: boolean;
  description?: { en: string; vi: string };
  image?: string;
}

export interface UpdateEventRequest {
  name?: { en: string; vi: string };
  startDate?: string;
  endDate?: string;
  status?: boolean;
  description?: { en: string; vi: string };
  image?: string;
}

export class GetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(): Promise<Event[]> {
    return await this.eventRepository.findAll();
  }
}

export class GetActiveEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(): Promise<Event[]> {
    return await this.eventRepository.findActive();
  }
}

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event', id);
    }
    return event;
  }
}

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(request: CreateEventRequest): Promise<Event> {
    // Validate business rules
    const dateRange = new DateRange(request.startDate, request.endDate);
    if (!dateRange.isCurrentlyActive() && request.status) {
      throw new BusinessRuleError('Cannot create an active event with past dates');
    }

    // Create domain entities
    const event = new Event(
      `EVT${Date.now()}`,
      new LocalizedText(request.name.en, request.name.vi),
      dateRange,
      request.status,
      request.description ? new LocalizedText(request.description.en, request.description.vi) : undefined,
      request.image
    );

    // Save to repository
    return await this.eventRepository.save(event);
  }
}

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string, request: UpdateEventRequest): Promise<Event> {
    // Get existing event
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new NotFoundError('Event', id);
    }

    // Build update object
    const updates: any = {};
    
    if (request.name) {
      updates.name = new LocalizedText(request.name.en, request.name.vi);
    }
    
    if (request.startDate || request.endDate) {
      updates.dateRange = new DateRange(
        request.startDate ?? existingEvent.dateRange.startDate,
        request.endDate ?? existingEvent.dateRange.endDate
      );
    }
    
    if (request.status !== undefined) {
      updates.status = request.status;
    }
    
    if (request.description) {
      updates.description = new LocalizedText(request.description.en, request.description.vi);
    }
    
    if (request.image) {
      updates.image = request.image;
    }

    // Update event
    const updatedEvent = existingEvent.update(updates);

    // Save to repository
    return await this.eventRepository.save(updatedEvent);
  }
}

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.eventRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Event', id);
    }

    await this.eventRepository.delete(id);
  }
}
