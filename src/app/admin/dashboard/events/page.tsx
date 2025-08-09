
'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { getEventsAction, createEventAction, updateEventAction, deleteEventAction } from '@/lib/data/clean-actions';
import { formatDateForUI, formatDateForInput } from '@/lib/utils';
import type { Event } from '@/lib/data/types';


const ITEMS_PER_PAGE = 5;

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [createStatus, setCreateStatus] = useState(true);
    const [editStatus, setEditStatus] = useState(true);
    const [createEventType, setCreateEventType] = useState('simple_packages');
    const [editEventType, setEditEventType] = useState('simple_packages');

    const fetchEvents = async () => {
        const fetchedEvents = await getEventsAction() as Event[];
        setEvents(fetchedEvents);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const name = typeof event.name === 'string' ? event.name : event.name.en;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        try {
            await createEventAction(formData);
            fetchEvents();
            setCreateDialogOpen(false);
            setCreateStatus(true); // Reset status to default
            setCreateEventType('simple_packages'); // Reset event type to default
            form.reset();
        } catch (error) {
            console.error('Failed to create event:', error);
            alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      
      const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedEvent) return;
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await updateEventAction(selectedEvent.id, formData);
            fetchEvents();
            setEditDialogOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Failed to update event:', error);
            alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    
      const handleDeleteEvent = async (id: string) => {
        await deleteEventAction(id);
        fetchEvents();
      };

      const openEditDialog = (event: Event) => {
        setSelectedEvent(event);
        setEditStatus(event.status);
        setEditEventType(event.type || 'simple_packages');
        setEditDialogOpen(true);
      }

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>Manage your promotional events.</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create New Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>
                              Fill in the details for your new promotional event.
                            </DialogDescription>
                          </DialogHeader>
                          <form id="create-event-form" onSubmit={handleCreateEvent}>
                              <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name_en" className="text-right">Name (EN)</Label>
                                      <Input id="name_en" name="name_en" className="col-span-3" required />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name_vi" className="text-right">Name (VI)</Label>
                                      <Input id="name_vi" name="name_vi" className="col-span-3" required />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="type" className="text-right">Event Type</Label>
                                      <Select value={createEventType} onValueChange={setCreateEventType}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Select event type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="simple_packages">Simple Packages</SelectItem>
                                          <SelectItem value="complex_packages">Complex Packages</SelectItem>
                                          <SelectItem value="flash_sale">Flash Sale</SelectItem>
                                          <SelectItem value="seasonal">Seasonal</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="startDate" className="text-right">Start Date</Label>
                                      <Input id="startDate" name="startDate" type="date" className="col-span-3" required />
                                  </div>
                                   <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="endDate" className="text-right">End Date</Label>
                                      <Input id="endDate" name="endDate" type="date" className="col-span-3" required />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="status" className="text-right">Status</Label>
                                      <Switch 
                                          id="status" 
                                          className="col-span-3" 
                                          checked={createStatus}
                                          onCheckedChange={setCreateStatus}
                                      />
                                  </div>
                                  <input type="hidden" name="type" value={createEventType} />
                                  <input type="hidden" name="status" value={createStatus.toString()} />
                              </div>
                          </form>
                          <DialogFooter>
                            <Button type="submit" form="create-event-form">Create</Button>
                          </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedEvents.map((event) => (
                <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>{typeof event.name === 'string' ? event.name : event.name.en}</TableCell>
                    <TableCell>{formatDateForUI(event.startDate)}</TableCell>
                    <TableCell>{formatDateForUI(event.endDate)}</TableCell>
                    <TableCell>
                    <Badge variant={event.status ? "default" : "secondary"}>
                        {event.status ? 'On' : 'Off'}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Dialog open={isEditDialogOpen && selectedEvent?.id === event.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedEvent(null); setEditDialogOpen(isOpen);}}>
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog(event)}>
                                            <Edit className="mr-2 h-4 w-4"/>
                                            Edit
                                        </DropdownMenuItem>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this event.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Event</DialogTitle>
                                    <DialogDescription>
                                    Make changes to the event details below.
                                    </DialogDescription>
                                </DialogHeader>
                                <form id="edit-event-form" onSubmit={handleEditEvent}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name_en" className="text-right">Name (EN)</Label>
                                            <Input id="edit-name_en" name="name_en" className="col-span-3" defaultValue={selectedEvent ? (typeof selectedEvent.name === 'object' ? selectedEvent.name.en : selectedEvent.name) : ''} required />
                                        </div>
                                         <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name_vi" className="text-right">Name (VI)</Label>
                                            <Input id="edit-name_vi" name="name_vi" className="col-span-3" defaultValue={selectedEvent ? (typeof selectedEvent.name === 'object' ? selectedEvent.name.vi : selectedEvent.name) : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-type" className="text-right">Event Type</Label>
                                            <Select value={editEventType} onValueChange={setEditEventType}>
                                              <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select event type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="simple_packages">Simple Packages</SelectItem>
                                                <SelectItem value="complex_packages">Complex Packages</SelectItem>
                                                <SelectItem value="flash_sale">Flash Sale</SelectItem>
                                                <SelectItem value="seasonal">Seasonal</SelectItem>
                                              </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-startDate" className="text-right">Start Date</Label>
                                            <Input id="edit-startDate" name="startDate" type="date" className="col-span-3" defaultValue={selectedEvent?.startDate ? formatDateForInput(selectedEvent.startDate) : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-endDate" className="text-right">End Date</Label>
                                            <Input id="edit-endDate" name="endDate" type="date" className="col-span-3" defaultValue={selectedEvent?.endDate ? formatDateForInput(selectedEvent.endDate) : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-status" className="text-right">Status</Label>
                                            <Switch 
                                                id="edit-status" 
                                                className="col-span-3" 
                                                checked={editStatus}
                                                onCheckedChange={setEditStatus}
                                            />
                                        </div>
                                        <input type="hidden" name="type" value={editEventType} />
                                        <input type="hidden" name="status" value={editStatus.toString()} />
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button type="submit" form="edit-event-form">Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
          <CardFooter className="flex justify-center items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>
            <span>
                Page {currentPage} of {totalPages || 1}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages <= 1}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  )
}
