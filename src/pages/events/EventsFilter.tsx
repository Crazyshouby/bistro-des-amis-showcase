
import React from "react";

interface EventsFilterProps {
  showPast: boolean;
  handleTogglePast: (value: boolean) => void;
}

const EventsFilter = ({ showPast, handleTogglePast }: EventsFilterProps) => {
  return (
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
  );
};

export default EventsFilter;
