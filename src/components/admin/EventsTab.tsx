
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, CalendarDays } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types";
import { EventDialog } from "./events/EventDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface EventsTabProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  onDeleteRequest: (type: 'menu' | 'event', id: string) => void;
}

export const EventsTab = ({ events, setEvents, onDeleteRequest }: EventsTabProps) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const isMobile = useIsMobile();

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

  const renderEventCard = (event: Event) => {
    const eventDate = parseISO(event.date);
    const formattedDate = format(eventDate, "d MMMM yyyy", { locale: fr });
    
    return (
      <div 
        key={event.id} 
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
        onClick={() => handleEditEvent(event)}
      >
        <div className="relative h-40 bg-gray-100">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400">Aucune image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="outline" 
              size="icon"
              className="h-7 w-7 bg-white hover:bg-red-500 hover:text-white border-red-500 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest('event', event.id);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-bistro-wood truncate" title={event.titre}>
              {event.titre}
            </h3>
          </div>
          <div className="flex items-center text-bistro-olive mb-2">
            <CalendarDays size={16} className="mr-1" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 h-10" title={event.description}>
            {event.description}
          </p>
        </div>
      </div>
    );
  };

  const renderEventList = () => (
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
            <TableRow key={event.id} onClick={() => handleEditEvent(event)} className="cursor-pointer">
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
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRequest('event', event.id);
                  }}
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
  );

  const renderEventGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-bistro-wood/50">Aucun événement programmé. Cliquez sur "Ajouter un événement" pour commencer.</p>
        </div>
      ) : (
        events.map(event => renderEventCard(event))
      )}
    </div>
  );

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
          {isMobile ? renderEventGrid() : renderEventList()}
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
