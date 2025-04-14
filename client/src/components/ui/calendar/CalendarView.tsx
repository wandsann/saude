import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events?: Array<{
    date: Date;
    type: "appointment" | "exam" | "reminder";
    status?: "confirmed" | "pending" | "canceled";
  }>;
  onDateSelect?: (date: Date) => void;
}

export function CalendarView({ events = [], onDateSelect }: CalendarViewProps) {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const locale = language === "pt" ? ptBR : enUS;
  
  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day names based on the current locale
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(2021, 0, i + 1); // Sunday = 0, Monday = 1, etc.
    return format(date, "EEE", { locale });
  });
  
  // Calculate the number of empty cells at the beginning of the month
  const startWeekday = getDay(monthStart);
  
  // Helper to check if a date has events
  const getEventForDate = (date: Date) => {
    return events.find(event => 
      format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">
            {format(currentMonth, "MMMM yyyy", { locale })}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={prevMonth}
            >
              <span className="material-icons">chevron_left</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={nextMonth}
            >
              <span className="material-icons">chevron_right</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {/* Days of week */}
          {weekDays.map((day, i) => (
            <div key={i} className="text-gray-500 text-sm font-medium">
              {day}
            </div>
          ))}
          
          {/* Empty cells at the beginning of the month */}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`empty-start-${i}`} className="p-2 text-gray-300"></div>
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map(day => {
            const dateEvent = getEventForDate(day);
            const isCurrentDay = isToday(day);
            
            let bgColor = "";
            let textColor = "";
            
            if (dateEvent) {
              if (dateEvent.status === "confirmed" || !dateEvent.status) {
                bgColor = "bg-primary-100";
                textColor = "text-primary-700";
              } else if (dateEvent.status === "pending") {
                bgColor = "bg-amber-100";
                textColor = "text-amber-700";
              } else if (dateEvent.status === "canceled") {
                bgColor = "bg-red-100";
                textColor = "text-red-700";
              }
            }
            
            return (
              <button
                key={day.toString()}
                className={cn(
                  "p-2 rounded-full relative",
                  isCurrentDay ? "font-bold" : "",
                  bgColor,
                  textColor,
                  "hover:bg-gray-100 cursor-pointer"
                )}
                onClick={() => onDateSelect?.(day)}
              >
                {format(day, "d")}
                {dateEvent && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current"></span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
