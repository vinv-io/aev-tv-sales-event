import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';
import { EventType } from '../../domain/value-objects/EventType';
import { DateRange } from '../../domain/value-objects/DateRange';

// Import your existing data sources
import * as prismaDb from '../../lib/data/postgres';

// Import types from existing system
import type { Event as RawEvent } from '../../lib/data/types';

export class EventRepository implements IEventRepository {
  private dataSource = prismaDb; // Use postgres as default

  async findAll(): Promise<Event[]> {
    const rawEvents = await this.dataSource.getEvents();
    return rawEvents.map((e: RawEvent) => this.toDomainEntity(e));
  }

  async findById(id: string): Promise<Event | null> {
    const rawEvents = await this.dataSource.getEvents();
    const rawEvent = rawEvents.find((e: RawEvent) => e.id === id);
    return rawEvent ? this.toDomainEntity(rawEvent) : null;
  }

  async findActive(): Promise<Event[]> {
    const rawEvents = await this.dataSource.getActiveEvents();
    return rawEvents.map((e: RawEvent) => this.toDomainEntity(e));
  }

  async save(event: Event): Promise<Event> {
    const plainObject = event.toPlainObject();
    
    // Convert domain EventType to legacy database format
    const dbPayload = {
      ...plainObject,
      type: plainObject.type as any // Type assertion to handle legacy format
    };
    
    // Check if event exists
    const existing = await this.findById(event.id);
    
    if (existing) {
      // Update existing event
      const updated = await this.dataSource.updateEvent(event.id, dbPayload);
      return updated ? this.toDomainEntity(updated) : event;
    } else {
      // Create new event
      const created = await this.dataSource.createEvent(dbPayload);
      return this.toDomainEntity(created);
    }
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.deleteEvent(id);
  }

  async exists(id: string): Promise<boolean> {
    const event = await this.findById(id);
    return event !== null;
  }

  private toDomainEntity(rawEvent: RawEvent): Event {
    // Convert date format from DD-MM-YYYY to YYYY-MM-DD for DateRange
    const convertDateFormat = (dateStr: string): string => {
      // Check if date is already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      // Convert from DD-MM-YYYY to YYYY-MM-DD
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      }
      throw new Error(`Unsupported date format: ${dateStr}`);
    };

    return new Event(
      rawEvent.id,
      LocalizedText.fromPlainObject(rawEvent.name),
      EventType.fromString(rawEvent.type || 'simple_packages'),
      new DateRange(
        convertDateFormat(rawEvent.startDate), 
        convertDateFormat(rawEvent.endDate)
      ),
      rawEvent.status,
      rawEvent.description ? LocalizedText.fromPlainObject(rawEvent.description) : undefined,
      rawEvent.image,
      rawEvent.aiHint
    );
  }
}
