import type { Event, EventType } from '@/types';
import { prisma } from '@/lib/database';
import { format, isWithinInterval } from 'date-fns';

export class EventService {
  /**
   * Get all events
   */
  static async getAll(): Promise<Event[]> {
    const allEvents = await prisma.event.findMany();
    return allEvents.map(e => ({
      ...e,
      name: JSON.parse(e.name as string),
      type: e.type as EventType,
      startDate: format(new Date(e.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(e.endDate), 'dd-MM-yyyy')
    }));
  }

  /**
   * Get active events (within date range and enabled)
   */
  static async getActive(): Promise<Event[]> {
    const allEvents = await prisma.event.findMany();
    const now = new Date();
    
    const active = allEvents.filter(event => 
      event.status && isWithinInterval(now, { 
        start: new Date(event.startDate), 
        end: new Date(event.endDate) 
      })
    ).map(e => ({
      ...e,
      name: JSON.parse(e.name as string),
      type: e.type as EventType,
      startDate: format(new Date(e.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(e.endDate), 'dd-MM-yyyy')
    }));
    
    return active;
  }

  /**
   * Create a new event
   */
  static async create(eventData: Omit<Event, 'id'>): Promise<Event> {
    const newEvent = {
      id: `EVT${Date.now()}`,
      name: JSON.stringify(eventData.name),
      type: eventData.type || 'simple_packages',
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      status: eventData.status,
    };
    
    const result = await prisma.event.create({
      data: newEvent
    });
    
    return {
      ...result,
      name: JSON.parse(result.name as string),
      type: result.type as EventType,
      startDate: format(new Date(result.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(result.endDate), 'dd-MM-yyyy')
    };
  }

  /**
   * Update an existing event
   */
  static async update(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const updateData: any = { ...eventData };
    if (updateData.name) {
      updateData.name = JSON.stringify(updateData.name);
    }
    
    const result = await prisma.event.update({
      where: { id },
      data: updateData
    });
    
    return {
      ...result,
      name: JSON.parse(result.name as string),
      type: result.type as EventType,
      startDate: format(new Date(result.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(result.endDate), 'dd-MM-yyyy')
    };
  }

  /**
   * Delete an event
   */
  static async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id }
    });
  }
}
