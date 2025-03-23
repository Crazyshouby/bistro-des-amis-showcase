
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Sync, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { fetchData, deleteData } from "@/lib/supabase-utils";
import { supabase } from "@/integrations/supabase/client";

interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  status: string;
  synced?: boolean;
}

export const RecentReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await fetchData<Reservation>("reservations", {
        order: [["date", "desc"], ["time", "desc"]]
      });
      
      // Ajoute un état "synced" pour simuler la synchronisation
      const reservationsWithSync = data.map(res => ({
        ...res,
        synced: res.status === "confirmed"
      }));
      
      setReservations(reservationsWithSync);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      const success = await deleteData("reservations", id);
      if (success) {
        setReservations(reservations.filter(r => r.id !== id));
        toast({
          title: "Succès",
          description: "Réservation supprimée avec succès",
        });
      }
    }
  };

  const handleSync = async (id: string) => {
    try {
      // Simuler une synchronisation avec Google Calendar
      const { data, error } = await supabase
        .from("reservations")
        .update({ status: "confirmed" })
        .eq("id", id)
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Réservation synchronisée avec Google Calendar",
      });

      // Mettre à jour l'état local
      setReservations(
        reservations.map(r => 
          r.id === id ? { ...r, status: "confirmed", synced: true } : r
        )
      );
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de synchroniser avec Google Calendar",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    try {
      const date = parseISO(dateStr);
      const day = format(date, "EEEE d MMMM yyyy", { locale: fr });
      return `${day.charAt(0).toUpperCase() + day.slice(1)}, ${timeStr}`;
    } catch (error) {
      return `${dateStr}, ${timeStr}`;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement des réservations...</div>;
  }

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-bistro-wood">Réservations récentes</h3>
      </div>
      <div className="overflow-x-auto">
        {reservations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune réservation trouvée
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date et heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Personnes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">
                    {formatDate(reservation.date, reservation.time)}
                  </TableCell>
                  <TableCell>
                    <div>{reservation.name}</div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                    <div className="text-sm text-gray-500">{reservation.phone}</div>
                  </TableCell>
                  <TableCell>{reservation.people}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.synced 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reservation.synced ? "Synchronisé" : "Non synchronisé"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(reservation.id)}
                        disabled={reservation.synced}
                      >
                        <Sync className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(reservation.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
