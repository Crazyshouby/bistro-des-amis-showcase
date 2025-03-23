
import { RecentReservations } from "./RecentReservations";
import { ReservationsCalendar } from "./ReservationsCalendar";

export const ReservationsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentReservations />
        </div>
        <div className="lg:col-span-2">
          <ReservationsCalendar />
        </div>
      </div>
    </div>
  );
};
