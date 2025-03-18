
import React from "react";
import { CalendarIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface EventsViewToggleProps {
  viewMode: 'list' | 'calendar';
  setViewMode: (mode: 'list' | 'calendar') => void;
}

const EventsViewToggle = ({
  viewMode,
  setViewMode
}: EventsViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'calendar')}>
      <ToggleGroupItem 
        value="list" 
        className={`relative flex items-center gap-2 border border-bistro-wood/20 
          ${viewMode === 'list' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-foreground hover:bg-muted'}`}
      >
        <ListFilter className="h-4 w-4 stroke-[1.5px]" />
        <span>Liste</span>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="calendar" 
        className={`relative flex items-center gap-2 border border-bistro-wood/20 
          ${viewMode === 'calendar' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-foreground hover:bg-muted'}`}
      >
        <CalendarIcon className="h-4 w-4 stroke-[1.5px]" />
        <span>Calendrier</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default EventsViewToggle;
