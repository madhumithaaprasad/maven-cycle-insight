
import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCycle } from '@/context/CycleContext';
import { getDateStatus } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export function CycleCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { periods, nextPeriod } = useCycle();

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Get all days in the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Weekday headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</h2>
        <Button variant="ghost" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Render weekday headers */}
        {weekDays.map((day) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        
        {/* Render calendar days */}
        {daysInMonth.map((day) => {
          // Check the status of this date
          const { isPeriod, isFertile, isOvulation, isPredictedPeriod } = getDateStatus(
            day,
            periods,
            nextPeriod
          );
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "aspect-square flex flex-col items-center justify-center p-1 relative rounded-full",
                !isSameMonth(day, currentMonth) && "opacity-30",
                isToday(day) && "border border-maven-purple",
                isPeriod && "bg-maven-purple text-white",
                isPredictedPeriod && "bg-maven-light-purple",
                isFertile && !isPeriod && !isPredictedPeriod && "bg-maven-soft-peach",
                isOvulation && "ring-2 ring-maven-teal"
              )}
            >
              <div className="text-sm">{format(day, 'd')}</div>
            </div>
          );
        })}
      </div>
      
      {/* Calendar Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-maven-purple"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-maven-light-purple"></div>
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-maven-soft-peach"></div>
          <span>Fertility</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-maven-teal"></div>
          <span>Ovulation</span>
        </div>
      </div>
    </div>
  );
}
