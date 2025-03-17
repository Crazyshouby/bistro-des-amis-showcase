
import { useState, useEffect } from "react";
import { format, parseISO, isFuture } from "date-fns";
import { fr } from "date-fns/locale";
import AnimatedSection from "@/components/shared/AnimatedSection";
import EventCard from "@/components/shared/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Event } from "@/types";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

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
  
  const futureEvents = events.filter(event => {
    return event.date >= currentDate;
  });
  
  const pastEvents = events.filter(event => {
    return event.date < currentDate;
  });
  
  const displayedEvents = showPast ? pastEvents : futureEvents;

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
          
          {/* Filter Buttons */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-bistro-sand-light rounded-lg p-1">
              <button 
                className={`px-4 py-2 rounded-md ${!showPast ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => setShowPast(false)}
              >
                À venir
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${showPast ? 'bg-bistro-olive text-white' : 'text-bistro-wood hover:bg-bistro-sand/50'}`}
                onClick={() => setShowPast(true)}
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
              {/* Events Grid */}
              {displayedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-bistro-wood/70">
                    {showPast ? 
                      "Aucun événement passé à afficher." : 
                      "Aucun événement à venir pour le moment. Revenez bientôt!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedEvents.map((event, index) => (
                    <AnimatedSection key={event.id} delay={0.05 * index} className="h-full">
                      <EventCard event={event} className="h-full" />
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
