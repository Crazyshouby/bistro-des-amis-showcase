
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface EventsFilterProps {
  showPast: boolean;
  handleTogglePast: (value: boolean) => void;
}

const EventsFilter = ({
  showPast,
  handleTogglePast
}: EventsFilterProps) => {
  return (
    <ToggleGroup type="single" value={showPast ? "past" : "upcoming"} onValueChange={(value) => value && handleTogglePast(value === "past")}>
      <ToggleGroupItem 
        value="upcoming" 
        className={`relative flex items-center gap-2 border border-bistro-wood/20 
          ${!showPast 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-foreground hover:bg-muted'}`}
      >
        À venir
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="past" 
        className={`relative flex items-center gap-2 border border-bistro-wood/20 
          ${showPast 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-foreground hover:bg-muted'}`}
      >
        Passés
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default EventsFilter;
