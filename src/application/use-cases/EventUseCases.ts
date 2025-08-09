import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { NotFoundError, BusinessRuleError } from '../../shared/errors/DomainErrors';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';
import { EventType } from '../../domain/value-objects/EventType';
import { DateRange } from '../../domain/value-objects/DateRange';

export interface CreateEventRequest {
  name: { en: string; vi: string };
  type: string;
  startDate: string;
  endDate: string;
  status: boolean;
  description?: { en: string; vi: string };
  image?: string;
  aiHint?: string;
}

export interface UpdateEventRequest {
  name?: { en: string; vi: string };
  type?: string;
  startDate?: string;
  endDate?: string;
  status?: boolean;
  description?: { en: string; vi: string };
  image?: string;
  aiHint?: string;
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
      `EVT${Date.now()}`, // Generate ID
      new LocalizedText(request.name.en, request.name.vi),
      EventType.fromString(request.type),
      dateRange,
      request.status,
      request.description ? new LocalizedText(request.description.en, request.description.vi) : undefined,
      request.image,
      request.aiHint
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
    
    if (request.type) {
      updates.type = EventType.fromString(request.type);
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
    
    if (request.aiHint) {
      updates.aiHint = request.aiHint;
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
