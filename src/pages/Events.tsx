
import { useState, useEffect } from "react";
import { format, parseISO, isFuture } from "date-fns";
import { fr } from "date-fns/locale";
import AnimatedSection from "@/components/shared/AnimatedSection";
import EventCard from "@/components/shared/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ListFilter } from "lucide-react";
import type { Event } from "@/types";

const Events = () => {
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
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
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
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Nos Événements</h1>
        </div>
      </div>
      
      {/* Events Section */}
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
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-bistro-sand-light rounded-lg p-1">
              <button 
                className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'list' ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => setViewMode('list')}
              >
                <ListFilter className="mr-2 h-4 w-4" />
                Liste
              </button>
              <button 
                className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'calendar' ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendrier
              </button>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-bistro-sand-light rounded-lg p-1">
              <button 
                className={`px-4 py-2 rounded-md ${!showPast ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => handleTogglePast(false)}
              >
                À venir
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${showPast ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => handleTogglePast(true)}
              >
                Passés
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-bistro-wood">Chargement des événements...</p>
            </div>
          ) : (
            <>
              {viewMode === 'calendar' ? (
                <div className="flex flex-col md:flex-row gap-8 bg-white/50 p-6 rounded-lg shadow-sm">
                  <div className="w-full md:w-1/2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border bg-white"
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
                      <div className="space-y-4">
                        {filteredEvents.map(event => (
                          <EventCard key={event.id} event={event} compact={true} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Events Grid */}
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-bistro-wood/70">
                        {selectedDate
                          ? "Aucun événement à cette date."
                          : showPast
                            ? "Aucun événement passé à afficher."
                            : "Aucun événement à venir pour le moment. Revenez bientôt!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredEvents.map((event, index) => (
                        <AnimatedSection key={event.id} delay={0.05 * index} className="h-full">
                          <EventCard event={event} className="h-full" />
                        </AnimatedSection>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
