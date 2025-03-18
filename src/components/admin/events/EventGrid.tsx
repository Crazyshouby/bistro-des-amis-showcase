
import { Button } from "@/components/ui/button";
import { Trash, CalendarDays } from "lucide-react";
import { Event } from "@/types";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface EventGridProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventGrid = ({ events, onEditEvent, onDeleteEvent }: EventGridProps) => {
  const renderEventCard = (event: Event) => {
    const eventDate = parseISO(event.date);
    const formattedDate = format(eventDate, "d MMMM yyyy", { locale: fr });
    
    return (
      <div 
        key={event.id} 
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
        onClick={() => onEditEvent(event)}
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
                onDeleteEvent(event.id);
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

  return (
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
};
