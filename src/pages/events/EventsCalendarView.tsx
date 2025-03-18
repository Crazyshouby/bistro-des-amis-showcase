
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/shared/EventCard";
import type { Event } from "@/types";

interface EventsCalendarViewProps {
  filteredEvents: Event[];
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  eventDates: Date[];
  showPast: boolean;
}

const EventsCalendarView = ({
  filteredEvents,
  selectedDate,
  setSelectedDate,
  eventDates,
  showPast
}: EventsCalendarViewProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 bg-white/50 p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
      <div className="w-full md:w-1/2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border bg-white w-full max-w-full"
          modifiers={{
            hasEvent: eventDates
          }}
          modifiersStyles={{
            hasEvent: {
              backgroundColor: "rgba(104, 130, 82, 0.1)",
              border: "1px solid rgba(104, 130, 82, 0.5)",
              fontWeight: "bold"
            }
          }}
        />
        {selectedDate && (
          <Button
            variant="outline"
            className="mt-4 text-bistro-olive"
            onClick={() => setSelectedDate(undefined)}
          >
            Effacer la sélection
          </Button>
        )}
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-xl font-playfair font-bold text-bistro-wood mb-4">
          {selectedDate
            ? `Événements du ${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`
            : showPast
              ? "Événements passés"
              : "Événements à venir"
          }
        </h3>
        {filteredEvents.length === 0 ? (
          <p className="text-bistro-wood/70">
            {selectedDate
              ? "Aucun événement à cette date."
              : showPast
                ? "Aucun événement passé à afficher."
                : "Aucun événement à venir pour le moment."}
          </p>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} compact={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCalendarView;
