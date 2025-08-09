import { 
  GetAllEventsUseCase,
  GetActiveEventsUseCase,
  GetEventByIdUseCase,
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
  CreateEventRequest,
  UpdateEventRequest
} from '../use-cases/EventUseCases';
import { EventRepository } from '../../infrastructure/repositories/EventRepository';
import { Event } from '../../domain/entities/Event';

export class EventApplicationService {
  private eventRepository = new EventRepository();
  
  // Use cases
  private getAllEventsUseCase = new GetAllEventsUseCase(this.eventRepository);
  private getActiveEventsUseCase = new GetActiveEventsUseCase(this.eventRepository);
  private getEventByIdUseCase = new GetEventByIdUseCase(this.eventRepository);
  private createEventUseCase = new CreateEventUseCase(this.eventRepository);
  private updateEventUseCase = new UpdateEventUseCase(this.eventRepository);
  private deleteEventUseCase = new DeleteEventUseCase(this.eventRepository);

  async getAllEvents(): Promise<Event[]> {
    return await this.getAllEventsUseCase.execute();
  }

  async getActiveEvents(): Promise<Event[]> {
    return await this.getActiveEventsUseCase.execute();
  }

  async getEventById(id: string): Promise<Event> {
    return await this.getEventByIdUseCase.execute(id);
  }

  async createEvent(request: CreateEventRequest): Promise<Event> {
    return await this.createEventUseCase.execute(request);
  }

  async updateEvent(id: string, request: UpdateEventRequest): Promise<Event> {
    return await this.updateEventUseCase.execute(id, request);
  }

  async deleteEvent(id: string): Promise<void> {
    return await this.deleteEventUseCase.execute(id);
  }

  // Convenience method for legacy compatibility
  async getEventsAsPlainObjects(): Promise<any[]> {
    const events = await this.getAllEvents();
    return events.map(event => event.toPlainObject());
  }

  async getActiveEventsAsPlainObjects(): Promise<any[]> {
    const events = await this.getActiveEvents();
    return events.map(event => event.toPlainObject());
  }
}
