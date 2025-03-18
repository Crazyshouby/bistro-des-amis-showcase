
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EventsHeaderProps {
  onAddEvent: () => void;
  isMobile: boolean;
}

export const EventsHeader = ({ onAddEvent, isMobile }: EventsHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-playfair text-bistro-wood">Événements</CardTitle>
      {isMobile ? (
        <Button 
          onClick={onAddEvent}
          className="bg-[#4A5E3A] hover:bg-[#D4A017] text-white hover:text-[#3A2E1F] rounded-md w-10 h-10 p-0 flex items-center justify-center"
          aria-label="Ajouter un événement"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      ) : (
        <Button 
          onClick={onAddEvent}
          className="bg-[#4A5E3A] hover:bg-[#D4A017] text-white hover:text-[#3A2E1F] rounded-md px-4 py-2 flex items-center justify-center gap-2"
          aria-label="Ajouter un événement"
        >
          <PlusCircle className="h-5 w-5" />
          Ajouter un événement
        </Button>
      )}
    </CardHeader>
  );
};
