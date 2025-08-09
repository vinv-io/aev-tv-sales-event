import { Event } from '../entities/Event';

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  findActive(): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
