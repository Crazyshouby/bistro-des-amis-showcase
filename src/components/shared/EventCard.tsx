
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  className?: string;
  compact?: boolean;
}

const EventCard = ({ event, className, compact = false }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const eventDate = parseISO(event.date);
  
  const formattedDate = format(eventDate, "d MMMM yyyy", { locale: fr });
  const dayOfWeek = format(eventDate, "EEEE", { locale: fr });
  const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  
  return (
    <>
      <div 
        className={cn(
          "bg-bistro-sand-light border border-bistro-sand rounded-md shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {compact ? (
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-bold text-bistro-wood">{event.titre}</h3>
              <p className="text-sm text-bistro-wood/70">{capitalizedDay} {formattedDate}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-bistro-olive hover:text-bistro-olive-light hover:bg-transparent"
            >
              <CalendarDays size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {event.image_url && (
              <div className="w-full md:w-1/3 h-48 md:h-auto">
                <img 
                  src={event.image_url} 
                  alt={event.titre}
                  className="w-full h-full object-cover rounded-t-md md:rounded-l-md md:rounded-t-none"
                />
              </div>
            )}
            <div className={cn(
              "flex flex-col justify-between p-4", 
              event.image_url ? "w-full md:w-2/3" : "w-full"
            )}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-playfair font-bold text-bistro-wood">{event.titre}</h3>
                </div>
                <div className="flex items-center text-bistro-olive mb-2">
                  <CalendarDays size={16} className="mr-1" />
                  <span className="text-sm">{capitalizedDay} {formattedDate}</span>
                </div>
                <p className="text-sm text-bistro-wood/80 line-clamp-2">{event.description}</p>
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto mt-2 text-bistro-olive hover:text-bistro-olive-light self-start"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              >
                Voir les détails
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-bistro-sand-light border-bistro-sand max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-bistro-wood">{event.titre}</DialogTitle>
            <DialogDescription className="text-bistro-olive font-medium">
              {capitalizedDay} {formattedDate}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col md:flex-row gap-6">
            {event.image_url && (
              <div className="w-full md:w-1/2">
                <img 
                  src={event.image_url} 
                  alt={event.titre}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
            <div className={event.image_url ? "w-full md:w-1/2" : "w-full"}>
              <p className="text-bistro-wood/90 whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
