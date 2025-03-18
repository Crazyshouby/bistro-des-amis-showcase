
import React from "react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import EventCard from "@/components/shared/EventCard";
import type { Event } from "@/types";

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
    <div className="grid grid-cols-1 gap-6">
      {filteredEvents.map((event, index) => (
        <AnimatedSection key={event.id} delay={0.05 * index} className="h-full">
          <EventCard event={event} className="h-full" />
        </AnimatedSection>
      ))}
    </div>
  );
};

export default EventsListView;
