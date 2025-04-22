
import { format, parseISO } from 'date-fns';
import { useCycle } from '@/context/CycleContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function RecentEntries() {
  const { periods, symptoms, moods } = useCycle();
  
  // Sort all entries by date (most recent first)
  const recentPeriods = [...periods]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);
  
  const recentSymptoms = [...symptoms]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const recentMoods = [...moods]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Check if there are any entries
  const hasEntries = recentPeriods.length > 0 || recentSymptoms.length > 0 || recentMoods.length > 0;
  
  if (!hasEntries) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-medium mb-4">Recent Entries</h3>
        <p className="text-gray-500">
          No entries logged yet. Start tracking your cycle to see your data here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-medium mb-6">Recent Entries</h3>
      
      {recentPeriods.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-maven-purple">Periods</h4>
          {recentPeriods.map((period) => (
            <div key={period.id} className="p-3 bg-maven-light-purple bg-opacity-20 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {format(parseISO(period.startDate), 'MMM d, yyyy')} - {format(parseISO(period.endDate), 'MMM d, yyyy')}
                  </p>
                  {period.notes && <p className="text-sm text-gray-600 mt-1">{period.notes}</p>}
                </div>
                <Badge variant="outline" className="bg-maven-purple text-white">
                  Period
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {recentPeriods.length > 0 && (recentSymptoms.length > 0 || recentMoods.length > 0) && (
        <Separator className="my-4" />
      )}
      
      {recentSymptoms.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-maven-teal">Symptoms</h4>
          {recentSymptoms.map((symptom) => (
            <div key={symptom.id} className="p-3 bg-maven-teal bg-opacity-10 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {symptom.type} - {symptom.severity}
                  </p>
                  <p className="text-xs text-gray-500">{format(parseISO(symptom.date), 'MMM d, yyyy')}</p>
                  {symptom.notes && <p className="text-sm text-gray-600 mt-1">{symptom.notes}</p>}
                </div>
                <Badge variant="outline" className="bg-maven-teal text-white">
                  Symptom
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {recentSymptoms.length > 0 && recentMoods.length > 0 && (
        <Separator className="my-4" />
      )}
      
      {recentMoods.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-maven-deep-purple">Moods</h4>
          {recentMoods.map((mood) => (
            <div key={mood.id} className="p-3 bg-maven-deep-purple bg-opacity-10 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{mood.mood}</p>
                  <p className="text-xs text-gray-500">{format(parseISO(mood.date), 'MMM d, yyyy')}</p>
                  {mood.notes && <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>}
                </div>
                <Badge variant="outline" className="bg-maven-deep-purple text-white">
                  Mood
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
