
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
    <div className="bg-transparent">
      <div
        style={{
          backgroundColor: 'var(--dynamic-background)'
        }}
        className="inline-flex rounded-lg p-1 bg-orange-200"
      >
        <button 
          className={`px-4 py-2 rounded-md transition-all duration-200`}
          style={{
            backgroundColor: !showPast ? 'var(--dynamic-button)' : 'transparent',
            color: !showPast ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
          }}
          onClick={() => handleTogglePast(false)}
        >
          À venir
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-all duration-200`}
          style={{
            backgroundColor: showPast ? 'var(--dynamic-button)' : 'transparent',
            color: showPast ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
          }}
          onClick={() => handleTogglePast(true)}
        >
          Passés
        </button>
      </div>
    </div>
  );
};

export default EventsFilter;
