
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { fetchData } from "@/lib/supabase-utils";

interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  status: string;
}

interface ReservationDay {
  date: Date;
  count: number;
}

export const ReservationsCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [reservationDays, setReservationDays] = useState<ReservationDay[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservationDays = async (selectedDate: Date) => {
    setLoading(true);
    
    try {
      // Fetch all reservations
      const data = await fetchData<Reservation>("reservations");
      
      // Count reservations per day
      const counts: { [key: string]: number } = {};
      
      data.forEach(reservation => {
        const dateStr = reservation.date;
        if (!counts[dateStr]) {
          counts[dateStr] = 0;
        }
        counts[dateStr] += 1;
      });
      
      // Convert to array of reservation days
      const days: ReservationDay[] = Object.keys(counts).map(dateStr => ({
        date: parse(dateStr, 'yyyy-MM-dd', new Date()),
        count: counts[dateStr]
      }));
      
      setReservationDays(days);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationDays(date);
    // Actualisez les données lorsque le mois change
  }, [date]);

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="mb-4 border-b pb-3">
        <h3 className="text-lg font-medium text-bistro-wood">Calendrier des réservations</h3>
      </div>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={newDate => newDate && setDate(newDate)}
          className="rounded-md border"
          locale={fr}
          modifiers={{
            booked: reservationDays.map(day => day.date)
          }}
          modifiersClassNames={{
            booked: "bg-bistro-olive-light/10 font-medium"
          }}
          components={{
            DayContent: ({ date }) => {
              const reservationDay = reservationDays.find(day => 
                isSameDay(day.date, date)
              );
              
              return (
                <div className="relative h-full w-full p-2 flex items-center justify-center">
                  {date.getDate()}
                  {reservationDay && (
                    <Badge 
                      className="absolute bottom-0 right-0 h-2 w-2 p-0 bg-bistro-olive rounded-full" 
                      variant="secondary" 
                    />
                  )}
                </div>
              );
            }
          }}
        />
      </div>
    </div>
  );
};
