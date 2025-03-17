
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types";
import { EventDialog } from "./EventDialog";

interface EventsTabProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  onDeleteRequest: (type: 'menu' | 'event', id: string) => void;
}

export const EventsTab = ({ events, setEvents, onDeleteRequest }: EventsTabProps) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsEventDialogOpen(false);
    setEditingEvent(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Événements</CardTitle>
          <Button 
            onClick={handleAddEvent}
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un événement
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Aucun événement programmé. Cliquez sur "Ajouter un événement" pour commencer.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.date}</TableCell>
                    <TableCell className="font-medium">{event.titre}</TableCell>
                    <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                    <TableCell>
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.titre}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteRequest('event', event.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EventDialog 
        isOpen={isEventDialogOpen}
        setIsOpen={setIsEventDialogOpen}
        editingEvent={editingEvent}
        setEvents={setEvents}
        onClose={handleCloseDialog}
      />
    </>
  );
};
