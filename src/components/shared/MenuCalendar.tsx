
import { useState } from "react";
import { format, addMonths, subMonths, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types";

interface MenuCalendarProps {
  menuItems: MenuItem[];
  onSelectDate?: (date: Date) => void;
  onSelectItem?: (item: MenuItem) => void;
  className?: string;
}

const MenuCalendar = ({ menuItems, onSelectDate, onSelectItem, className }: MenuCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Navigation du calendrier
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Définir les jours du mois
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Jours de la semaine en français
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Fonction pour attribuer des items de menu aux jours (simulée)
  const getMenuItemsForDay = (day: Date) => {
    // Dans un cas réel, vous filtreriez vos items de menu par jour
    // Ici, nous attribuons de façon aléatoire pour la démonstration
    return menuItems.filter(() => Math.random() > 0.7);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  return (
    <Card className={cn("bg-bistro-sand-light border-bistro-sand", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevMonth}
            className="text-bistro-olive hover:text-bistro-olive-light"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-playfair text-lg font-bold text-bistro-wood">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextMonth}
            className="text-bistro-olive hover:text-bistro-olive-light"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-bistro-wood/70">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array(days[0].getDay() === 0 ? 6 : days[0].getDay() - 1)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="h-10 md:h-12" />
            ))}
            
          {days.map((day) => {
            const dayMenuItems = getMenuItemsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "relative h-10 md:h-12 rounded-md flex flex-col justify-center items-center text-sm border border-transparent",
                  isSameMonth(day, currentMonth) ? "text-bistro-wood" : "text-bistro-wood/30",
                  isToday(day) && "border-bistro-olive font-bold",
                  isSelected && "bg-bistro-olive/10",
                  dayMenuItems.length > 0 && "cursor-pointer hover:bg-bistro-olive/5"
                )}
                onClick={() => dayMenuItems.length > 0 && handleDateClick(day)}
              >
                {format(day, 'd')}
                {dayMenuItems.length > 0 && (
                  <div className="absolute bottom-1 w-4 h-1 rounded-full bg-bistro-olive" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Affichage des items de menu pour le jour sélectionné */}
        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-playfair text-md font-bold text-bistro-wood mb-2">
              Menu du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </h3>
            <div className="space-y-2">
              {getMenuItemsForDay(selectedDate).length > 0 ? (
                getMenuItemsForDay(selectedDate).map((item) => (
                  <div 
                    key={item.id}
                    className="p-2 border border-bistro-sand bg-white rounded-md cursor-pointer hover:bg-bistro-sand-light/50"
                    onClick={() => onSelectItem && onSelectItem(item)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{item.nom}</span>
                      <span className="text-bistro-olive">{item.prix} CAD</span>
                    </div>
                    <p className="text-xs text-bistro-wood/70 line-clamp-1">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-bistro-wood/70">Aucun item de menu pour cette date</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCalendar;
