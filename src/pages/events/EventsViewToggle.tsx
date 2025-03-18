
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ListFilter } from "lucide-react";

interface EventsViewToggleProps {
  viewMode: 'list' | 'calendar';
  setViewMode: (mode: 'list' | 'calendar') => void;
}

const EventsViewToggle = ({ viewMode, setViewMode }: EventsViewToggleProps) => {
  return (
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
  );
};

export default EventsViewToggle;
