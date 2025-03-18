
import { CardContent } from "@/components/ui/card";
import { Event } from "@/types";
import { EventList } from "./EventList";
import { EventGrid } from "./EventGrid";

interface EventsContentProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  isMobile: boolean;
}

export const EventsContent = ({ events, onEditEvent, onDeleteEvent, isMobile }: EventsContentProps) => {
  return (
    <CardContent>
      {isMobile ? (
        <EventGrid 
          events={events} 
          onEditEvent={onEditEvent} 
          onDeleteEvent={onDeleteEvent} 
        />
      ) : (
        <EventList 
          events={events} 
          onEditEvent={onEditEvent} 
          onDeleteEvent={onDeleteEvent} 
        />
      )}
    </CardContent>
  );
};
