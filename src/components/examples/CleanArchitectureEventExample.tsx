'use client';

import { useState, useEffect } from 'react';
import { getEventsAction, createEventAction } from '@/lib/data/clean-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDateForUI } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  name: { en: string; vi: string };
  type: string;
  startDate: string;
  endDate: string;
  status: boolean;
}

export function CleanArchitectureEventExample() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventData = await getEventsAction();
      setEvents(eventData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('name_en', 'Sample Event');
      formData.append('name_vi', 'Sự Kiện Mẫu');
      formData.append('type', 'simple_packages');
      formData.append('startDate', '2025-01-01');
      formData.append('endDate', '2025-12-31');
      formData.append('status', 'true');

      await createEventAction(formData);
      await fetchEvents(); // Refresh list
      
      toast({
        title: 'Success',
        description: 'Event created successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Clean Architecture Event Example</CardTitle>
        <Button onClick={handleCreateEvent} className="w-fit">
          Create Sample Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p>No events found</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">
                  {event.name.en} / {event.name.vi}
                </h3>
                <p className="text-sm text-gray-600">
                  Type: {event.type} | Status: {event.status ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {formatDateForUI(event.startDate)} to {formatDateForUI(event.endDate)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
