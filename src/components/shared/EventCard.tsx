
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
          "bg-bistro-sand-light border border-bistro-sand rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {compact ? (
          <div className="flex items-center justify-between">
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
          <>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-playfair font-bold text-bistro-wood">{event.titre}</h3>
            </div>
            <div className="flex items-center text-bistro-olive mb-2">
              <CalendarDays size={16} className="mr-1" />
              <span className="text-sm">{capitalizedDay} {formattedDate}</span>
            </div>
            <p className="text-sm text-bistro-wood/80 line-clamp-2">{event.description}</p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-bistro-olive hover:text-bistro-olive-light"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              Voir les détails
            </Button>
          </>
        )}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-bistro-sand-light border-bistro-sand">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-bistro-wood">{event.titre}</DialogTitle>
            <DialogDescription className="text-bistro-olive font-medium">
              {capitalizedDay} {formattedDate}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-bistro-wood/90 whitespace-pre-line">{event.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
