import React from "react";
import { CalendarIcon, ListFilter } from "lucide-react";
interface EventsViewToggleProps {
  viewMode: 'list' | 'calendar';
  setViewMode: (mode: 'list' | 'calendar') => void;
}
const EventsViewToggle = ({
  viewMode,
  setViewMode
}: EventsViewToggleProps) => {
  return <div className="flex justify-center mb-6 bg-transparent">
      <div style={{
      backgroundColor: 'var(--dynamic-background)'
    }} className="inline-flex rounded-lg p-1 bg-orange-200">
        <button className={`px-4 py-2 rounded-md flex items-center`} onClick={() => setViewMode('list')} style={{
        backgroundColor: viewMode === 'list' ? 'var(--dynamic-button)' : 'transparent',
        color: viewMode === 'list' ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
      }}>
          <ListFilter className="mr-2 h-4 w-4" />
          Liste
        </button>
        <button className={`px-4 py-2 rounded-md flex items-center`} onClick={() => setViewMode('calendar')} style={{
        backgroundColor: viewMode === 'calendar' ? 'var(--dynamic-button)' : 'transparent',
        color: viewMode === 'calendar' ? 'var(--dynamic-background)' : 'var(--dynamic-text)'
      }}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendrier
        </button>
      </div>
    </div>;
};
export default EventsViewToggle;