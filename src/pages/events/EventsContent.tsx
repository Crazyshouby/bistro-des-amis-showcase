
import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/shared/AnimatedSection";
import EventsViewToggle from "./EventsViewToggle";
import EventsFilter from "./EventsFilter";
import EventsCalendarView from "./EventsCalendarView";
import EventsListView from "./EventsListView";
import type { Event } from "@/types";

const EventsContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
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
  const handleTogglePast = (value: boolean) => {
    setShowPast(value);
    setSelectedDate(undefined);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <AnimatedSection>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-bistro-wood mb-4">
              Activités & Divertissements
            </h2>
            <p className="text-bistro-wood/80 max-w-2xl mx-auto">
              Découvrez notre programmation d'événements spéciaux: soirées musicales, dégustations, quiz et bien plus encore.
            </p>
          </div>
        </AnimatedSection>
        
        {/* View Toggle */}
        <EventsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        
        {/* Filter Buttons */}
        <EventsFilter showPast={showPast} handleTogglePast={handleTogglePast} />
        
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
      </div>
    </section>
  );
};

export default EventsContent;
