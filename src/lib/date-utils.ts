
import { addDays, differenceInDays, format, isSameDay, parseISO, startOfDay, subDays } from "date-fns";

// Calculate the predicted period start date based on past periods
export function predictNextPeriod(
  periods: Array<{ startDate: string; endDate: string }>
): Date | null {
  // Need at least one period to make a prediction
  if (periods.length === 0) return null;

  // Sort periods by start date, most recent first
  const sortedPeriods = [...periods].sort(
    (a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime()
  );

  // Get the most recent period
  const mostRecentPeriod = sortedPeriods[0];
  const mostRecentStartDate = parseISO(mostRecentPeriod.startDate);

  // If there's only one period, assume a 28-day cycle
  if (sortedPeriods.length === 1) {
    return addDays(mostRecentStartDate, 28);
  }

  // Calculate average cycle length from available data
  let totalCycleDays = 0;
  let cycleCount = 0;

  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const currentPeriodStart = parseISO(sortedPeriods[i].startDate);
    const prevPeriodStart = parseISO(sortedPeriods[i + 1].startDate);
    
    const cycleDays = differenceInDays(currentPeriodStart, prevPeriodStart);
    if (cycleDays > 0 && cycleDays < 60) { // Filter out potential data errors
      totalCycleDays += cycleDays;
      cycleCount++;
    }
  }

  // If we couldn't calculate based on history, use standard 28-day cycle
  const avgCycleLength = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 28;
  
  return addDays(mostRecentStartDate, avgCycleLength);
}

// Calculate fertility window and ovulation
export function calculateFertilityWindow(
  nextPeriodDate: Date,
  avgCycleLength = 28
): { 
  fertilityStart: Date; 
  fertilityEnd: Date;
  ovulationDate: Date;
} {
  // Ovulation typically occurs 14 days before the next period
  const ovulationDate = subDays(nextPeriodDate, 14);
  
  // Fertility window is typically 5 days before ovulation plus ovulation day itself
  const fertilityStart = subDays(ovulationDate, 5);
  const fertilityEnd = ovulationDate;

  return {
    fertilityStart,
    fertilityEnd,
    ovulationDate,
  };
}

// Format date for display
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

// Check if a date is within the period
export function isInPeriod(
  date: Date, 
  periods: Array<{ startDate: string; endDate: string }>
): boolean {
  const targetDate = startOfDay(date);
  
  return periods.some(period => {
    const periodStart = startOfDay(parseISO(period.startDate));
    const periodEnd = startOfDay(parseISO(period.endDate));
    
    return (
      (targetDate >= periodStart && targetDate <= periodEnd) ||
      isSameDay(targetDate, periodStart) || 
      isSameDay(targetDate, periodEnd)
    );
  });
}

// Get the status of a specific date
export function getDateStatus(
  date: Date,
  periods: Array<{ startDate: string; endDate: string }>,
  nextPeriod: Date | null
): {
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isPredictedPeriod: boolean;
} {
  const isPeriod = isInPeriod(date, periods);
  
  let isFertile = false;
  let isOvulation = false;
  let isPredictedPeriod = false;
  
  if (nextPeriod) {
    // Calculate expected period and fertility info
    const { fertilityStart, fertilityEnd, ovulationDate } = calculateFertilityWindow(nextPeriod);
    
    // Check if date is during fertility window
    if (date >= fertilityStart && date <= fertilityEnd) {
      isFertile = true;
    }
    
    // Check if date is ovulation day
    if (isSameDay(date, ovulationDate)) {
      isOvulation = true;
    }
    
    // Check if date is predicted period (assume average period length of 5 days)
    if (date >= nextPeriod && date <= addDays(nextPeriod, 5)) {
      isPredictedPeriod = true;
    }
  }
  
  return {
    isPeriod,
    isFertile,
    isOvulation,
    isPredictedPeriod
  };
}
