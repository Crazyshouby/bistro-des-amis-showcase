
import React, { useState } from "react";
import EventsBanner from "./events/EventsBanner";
import EventsContent from "./events/EventsContent";
import EventsViewToggle from "./events/EventsViewToggle";
import EventsFilter from "./events/EventsFilter";

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showPast, setShowPast] = useState(false);

  return (
    <div className="bg-texture">
      <EventsBanner />
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-bistro-wood mb-4">
              Activités & Divertissements
            </h2>
            <p className="text-bistro-wood/80 max-w-2xl mx-auto">
              Découvrez notre programmation d'événements spéciaux: soirées musicales, dégustations, quiz et bien plus encore.
            </p>
          </div>
          
          {/* Controls Container - Reorganized */}
          <div className="flex justify-between items-center mb-6">
            {/* View Toggle (Liste/Calendrier) on the left */}
            <div className="flex-shrink-0">
              <EventsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            
            {/* Filter (À venir/Passés) on the right */}
            <div className="flex-shrink-0">
              <EventsFilter showPast={showPast} handleTogglePast={setShowPast} />
            </div>
          </div>
          
          {/* Events Content */}
          <EventsContent 
            viewMode={viewMode} 
            showPast={showPast} 
          />
        </div>
      </section>
    </div>
  );
};

export default Events;
