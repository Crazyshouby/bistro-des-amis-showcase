
import React from "react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { MenuItem } from "@/types";
import { MenuItemCard } from "@/components/admin/menu/MenuItemCard";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface EventsListViewProps {
  filteredEvents: Event[];
  selectedDate: Date | undefined;
  showPast: boolean;
}

const EventsListView = ({ filteredEvents, selectedDate, showPast }: EventsListViewProps) => {
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-bistro-wood/70">
          {selectedDate
            ? "Aucun événement à cette date."
            : showPast
              ? "Aucun événement passé à afficher."
              : "Aucun événement à venir pour le moment. Revenez bientôt!"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredEvents.map((event, index) => (
        <AnimatedSection key={event.id} delay={0.05 * index} className="h-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
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
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-bistro-wood truncate" title={event.titre}>
                  {event.titre}
                </h3>
              </div>
              <div className="flex items-center text-bistro-olive mb-2">
                <CalendarDays size={16} className="mr-1" />
                {format(parseISO(event.date), "d MMMM yyyy", { locale: fr })}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 overflow-hidden" title={event.description}>
                {event.description}
              </p>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default EventsListView;
