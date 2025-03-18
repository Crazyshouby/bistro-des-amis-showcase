
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Event } from "@/types";
import { EventDialog } from "./events/EventDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsHeader } from "./events/EventsHeader";
import { EventsContent } from "./events/EventsContent";

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
        <EventsHeader 
          onAddEvent={handleAddEvent} 
          isMobile={isMobile} 
        />
        <EventsContent 
          events={events} 
          onEditEvent={handleEditEvent} 
          onDeleteEvent={(id) => onDeleteRequest('event', id)} 
          isMobile={isMobile} 
        />
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
