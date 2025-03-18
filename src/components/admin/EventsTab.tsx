
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Event } from "@/types";
import { EventDialog } from "./events/EventDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventList } from "./events/EventList";
import { EventGrid } from "./events/EventGrid";

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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Événements</CardTitle>
          <Button 
            onClick={handleAddEvent}
            className="bg-[#4A5E3A] hover:bg-[#D4A017] text-[#F5E9D7] hover:text-[#3A2E1F] rounded-md w-10 h-10 p-0 flex items-center justify-center"
            aria-label="Ajouter un événement"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <EventGrid 
              events={events} 
              onEditEvent={handleEditEvent} 
              onDeleteEvent={(id) => onDeleteRequest('event', id)} 
            />
          ) : (
            <EventList 
              events={events} 
              onEditEvent={handleEditEvent} 
              onDeleteEvent={(id) => onDeleteRequest('event', id)} 
            />
          )}
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
