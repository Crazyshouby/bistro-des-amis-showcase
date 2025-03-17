
import { useState } from "react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/shared/EventCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { Event } from "@/types";

// Données initiales pour démonstration
const initialEvents: Event[] = [
  {
    id: "1",
    date: "2025-03-19",
    titre: "Soirée Quiz - Culture Générale",
    description: "Lots à gagner : vin ou conso gratuite."
  },
  {
    id: "2",
    date: "2025-03-21",
    titre: "Concert acoustique - Les Étoiles Vagabondes",
    description: "Duo guitare/voix, dès 20h."
  },
  {
    id: "3",
    date: "2025-03-29",
    titre: "Dégustation de bières artisanales",
    description: "3 brasseries locales, 20 CAD/pers avec planche apéro."
  },
  {
    id: "4",
    date: "2025-03-30",
    titre: "Brunch dominical",
    description: "Buffet sucré/salé, 35 CAD/pers, réservations conseillées."
  }
];

const Events = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)); // Mars 2025
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Obtenir tous les jours du mois actuel
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Fonction pour obtenir les événements d'un jour spécifique
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
      return isSameDay(eventDate, day);
    });
  };
  
  // Navigation des mois
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  
  // Sélection d'un jour
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };
  
  // Vérifie si un jour a des événements
  const dayHasEvents = (day: Date) => {
    return events.some(event => {
      const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Nos Événements</h1>
        </div>
      </div>
      
      {/* Events Content */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <p className="text-center max-w-3xl mx-auto mb-12 text-lg">
              Découvrez notre programme d'événements et rejoignez-nous pour des moments conviviaux. Concerts, dégustations, quiz et bien d'autres animations vous attendent au Bistro des Amis.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <AnimatedSection className="col-span-1 lg:col-span-2">
              <div className="bg-bistro-sand-light rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-bistro-wood">
                    {format(currentMonth, 'MMMM yyyy', {locale: fr})}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={prevMonth}
                      className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={nextMonth}
                      className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {/* Days header */}
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
                    <div 
                      key={i} 
                      className="text-center py-2 font-medium text-bistro-wood"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {daysInMonth.map((day, i) => {
                    // Ajuster l'indice pour commencer le lundi (1) au lieu du dimanche (0)
                    const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1;
                    const hasEvents = dayHasEvents(day);
                    const isSelected = selectedDay && isSameDay(day, selectedDay);
                    
                    // Ajouter une marge au premier jour du mois
                    const marginLeft = i === 0 ? `col-start-${dayOfWeek + 1}` : '';
                    
                    return (
                      <div 
                        key={i}
                        className={`${marginLeft} relative p-2 border border-bistro-sand rounded-md text-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                          !isSameMonth(day, currentMonth) ? 'opacity-50' : ''
                        } ${
                          isToday(day) ? 'border-bistro-brick font-bold' : ''
                        } ${
                          hasEvents ? 'bg-bistro-olive text-white' : 'hover:bg-bistro-sand/50'
                        } ${
                          isSelected ? 'ring-2 ring-bistro-brick' : ''
                        }`}
                        onClick={() => handleDayClick(day)}
                      >
                        <span className="text-sm">{format(day, 'd')}</span>
                        {hasEvents && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Selected day events */}
                {selectedDay && (
                  <div className="mt-8">
                    <h3 className="font-playfair text-xl font-bold text-bistro-wood mb-4">
                      Événements du {format(selectedDay, 'd MMMM yyyy', {locale: fr})}
                    </h3>
                    <div className="space-y-4">
                      {getEventsForDay(selectedDay).length > 0 ? (
                        getEventsForDay(selectedDay).map(event => (
                          <EventCard key={event.id} event={event} compact />
                        ))
                      ) : (
                        <p className="text-bistro-wood/70 italic">Aucun événement ce jour-là.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
            
            {/* Next events */}
            <AnimatedSection className="col-span-1" delay={300} direction="right">
              <div className="bg-bistro-sand-light rounded-lg shadow-md p-6">
                <h2 className="font-playfair text-2xl font-bold text-bistro-wood mb-6">Prochains événements</h2>
                <div className="space-y-4">
                  {events.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img 
                      src="/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png" 
                      alt="Événement au Bistro des Amis" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <p className="text-white p-4 font-medium">Rejoignez-nous pour des moments inoubliables</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
