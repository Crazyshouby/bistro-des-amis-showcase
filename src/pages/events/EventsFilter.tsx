
import React from "react";

interface EventsFilterProps {
  showPast: boolean;
  handleTogglePast: (value: boolean) => void;
}

const EventsFilter = ({
  showPast,
  handleTogglePast
}: EventsFilterProps) => {
  return (
    <div className="flex space-x-2">
      <button 
        className={`px-4 py-2 rounded-md transition-all duration-200 ${
          !showPast 
            ? 'bg-[#4A5E3A] text-white' 
            : 'bg-bistro-sand-light text-bistro-wood border border-[#4A5E3A]/20'
        }`} 
        onClick={() => handleTogglePast(false)}
      >
        À venir
      </button>
      <button 
        className={`px-4 py-2 rounded-md transition-all duration-200 ${
          showPast 
            ? 'bg-[#4A5E3A] text-white' 
            : 'bg-bistro-sand-light text-bistro-wood border border-[#4A5E3A]/20'
        }`} 
        onClick={() => handleTogglePast(true)}
      >
        Passés
      </button>
    </div>
  );
};

export default EventsFilter;
