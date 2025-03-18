
import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/shared/AnimatedSection";
import EventsCalendarView from "./EventsCalendarView";
import EventsListView from "./EventsListView";
import type { Event } from "@/types";

interface EventsContentProps {
  viewMode: 'list' | 'calendar';
  showPast: boolean;
}

const EventsContent = ({ viewMode, showPast }: EventsContentProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date');
        
        if (error) throw error;
        
        setEvents(data as Event[]);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les événements. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Filter events based on date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const filteredEvents = events.filter(event => {
    // First filter by past/future
    const isPastEvent = event.date < currentDate;
    if (showPast !== isPastEvent) return false;
    
    // Then filter by selected date if any
    if (selectedDate) {
      const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
      return event.date === formattedSelectedDate;
    }
    
    return true;
  });

  // Generate dates with events for the calendar
  const eventDates = events.map(event => parseISO(event.date));
  
  // Reset selectedDate when toggling between past and future events
  useEffect(() => {
    setSelectedDate(undefined);
  }, [showPast]);

  return (
    <AnimatedSection>
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-bistro-wood">Chargement des événements...</p>
        </div>
      ) : (
        <>
          {viewMode === 'calendar' ? (
            <EventsCalendarView 
              filteredEvents={filteredEvents}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              eventDates={eventDates}
              showPast={showPast}
            />
          ) : (
            <EventsListView 
              filteredEvents={filteredEvents}
              selectedDate={selectedDate}
              showPast={showPast}
            />
          )}
        </>
      )}
    </AnimatedSection>
  );
};

export default EventsContent;
