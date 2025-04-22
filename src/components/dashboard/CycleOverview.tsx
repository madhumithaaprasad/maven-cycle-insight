
import { format, addDays, differenceInDays } from 'date-fns';
import { useCycle } from '@/context/CycleContext';
import { formatDate, calculateFertilityWindow } from '@/lib/date-utils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function CycleOverview() {
  const { periods, nextPeriod, userPreferences } = useCycle();
  
  // If there's no prediction yet, show a message
  if (!nextPeriod || periods.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-medium text-maven-purple mb-4">Cycle Overview</h3>
        <p className="text-gray-500">
          Start logging your period to see predictions and insights.
        </p>
      </Card>
    );
  }
  
  // Sort periods by start date, newest first
  const sortedPeriods = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  // Get the latest period
  const lastPeriod = sortedPeriods[0];
  
  // Calculate fertility window and ovulation
  const { fertilityStart, fertilityEnd, ovulationDate } = calculateFertilityWindow(
    nextPeriod,
    userPreferences.averageCycleLength
  );
  
  // Calculate days until next period
  const today = new Date();
  const daysUntil = differenceInDays(nextPeriod, today);
  
  // Calculate expected period end
  const expectedPeriodEnd = addDays(nextPeriod, userPreferences.averagePeriodLength - 1);
  
  // Calculate cycle progress
  const cycleLength = userPreferences.averageCycleLength;
  const daysSinceLastPeriod = differenceInDays(today, new Date(lastPeriod.startDate));
  const cycleProgress = Math.min(100, (daysSinceLastPeriod / cycleLength) * 100);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-medium text-maven-purple mb-4">Cycle Status</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Cycle Day {daysSinceLastPeriod + 1}</span>
            <span className="text-sm text-gray-500">Day {cycleLength}</span>
          </div>
          
          <Progress value={cycleProgress} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Last Period Started</p>
              <p className="font-medium">{formatDate(lastPeriod.startDate)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Next Period Expected</p>
              <p className="font-medium">{formatDate(nextPeriod)}</p>
              <p className="text-xs text-gray-500">
                In {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium text-maven-teal mb-4">Fertility Window</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Fertile Days</p>
            <p className="font-medium">
              {formatDate(fertilityStart)} - {formatDate(fertilityEnd)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Ovulation Day</p>
            <p className="font-medium">{formatDate(ovulationDate)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
