import React from "react";
interface EventsFilterProps {
  showPast: boolean;
  handleTogglePast: (value: boolean) => void;
}
const EventsFilter = ({
  showPast,
  handleTogglePast
}: EventsFilterProps) => {
  return <div className="flex justify-center mb-6">
      <div style={{
      backgroundColor: 'var(--dynamic-background)'
    }} className="inline-flex rounded-lg p-1 bg-orange-200">
        <button className={`px-4 py-2 rounded-md ${!showPast ? 'text-white' : ''}`} onClick={() => handleTogglePast(false)} style={{
        backgroundColor: !showPast ? 'var(--dynamic-button)' : 'transparent',
        color: !showPast ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
      }}>
          À venir
        </button>
        <button className={`px-4 py-2 rounded-md ${showPast ? 'text-white' : ''}`} onClick={() => handleTogglePast(true)} style={{
        backgroundColor: showPast ? 'var(--dynamic-button)' : 'transparent',
        color: showPast ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
      }}>
          Passés
        </button>
      </div>
    </div>;
};
export default EventsFilter;