
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Event } from "@/types";

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventList = ({ events, onEditEvent, onDeleteEvent }: EventListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Aucun événement programmé. Cliquez sur "Ajouter un événement" pour commencer.
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <TableRow key={event.id} onClick={() => onEditEvent(event)} className="cursor-pointer">
              <TableCell>{event.date}</TableCell>
              <TableCell className="font-medium">{event.titre}</TableCell>
              <TableCell className="max-w-xs truncate">{event.description}</TableCell>
              <TableCell>
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.titre}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEvent(event.id);
                  }}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
