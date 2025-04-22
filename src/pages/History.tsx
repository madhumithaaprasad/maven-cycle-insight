
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { useCycle } from '@/context/CycleContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const History = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { periods, symptoms, moods } = useCycle();
  
  // Sort entries by date (newest first)
  const sortedPeriods = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const sortedSymptoms = [...symptoms].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const sortedMoods = [...moods].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Create a combined list for "All" tab, sorted by date
  const allEntries = [
    ...sortedPeriods.map((entry) => ({ 
      ...entry, 
      type: 'period',
      date: entry.startDate,
    })),
    ...sortedSymptoms.map((entry) => ({ 
      ...entry, 
      type: 'symptom', 
    })),
    ...sortedMoods.map((entry) => ({ 
      ...entry, 
      type: 'mood', 
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Check if there are any entries
  const hasEntries = periods.length > 0 || symptoms.length > 0 || moods.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>History | Maven</title>
      </Helmet>
      
      <main className="container max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-maven-purple">History</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="periods" className="text-maven-purple data-[state=active]:bg-maven-light-purple">
              Periods
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="text-maven-teal data-[state=active]:bg-maven-teal data-[state=active]:text-white">
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="moods" className="text-maven-deep-purple data-[state=active]:bg-maven-deep-purple data-[state=active]:text-white">
              Moods
            </TabsTrigger>
          </TabsList>
          
          {!hasEntries ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                No entries found. Start tracking your cycle to see your history here.
              </p>
              <Button asChild className="mt-4 bg-maven-purple">
                <Link to="/log">Log Entry</Link>
              </Button>
            </Card>
          ) : (
            <>
              <TabsContent value="all" className="mt-0 space-y-4">
                {allEntries.map((entry) => {
                  if (entry.type === 'period') {
                    return (
                      <Card key={`period-${entry.id}`} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-maven-purple">Period</Badge>
                              <p className="font-medium">
                                {format(parseISO('startDate' in entry ? entry.startDate : entry.date), 'MMM d, yyyy')} - {format(parseISO('endDate' in entry ? entry.endDate : entry.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            {entry.notes && <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>}
                          </div>
                        </div>
                      </Card>
                    );
                  } else if (entry.type === 'symptom') {
                    return (
                      <Card key={`symptom-${entry.id}`} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-maven-teal">Symptom</Badge>
                              <p className="font-medium">
                                {'severity' in entry ? `${entry.type} - ${entry.severity}` : entry.type}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM d, yyyy')}</p>
                            {entry.notes && <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>}
                          </div>
                        </div>
                      </Card>
                    );
                  } else {
                    return (
                      <Card key={`mood-${entry.id}`} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-maven-deep-purple">Mood</Badge>
                              <p className="font-medium">
                                {'mood' in entry ? entry.mood : ''}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM d, yyyy')}</p>
                            {entry.notes && <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>}
                          </div>
                        </div>
                      </Card>
                    );
                  }
                })}
              </TabsContent>
              
              <TabsContent value="periods" className="mt-0 space-y-4">
                {sortedPeriods.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No period entries logged yet.</p>
                    <Button asChild className="mt-4 bg-maven-purple">
                      <Link to="/log">Log Period</Link>
                    </Button>
                  </Card>
                ) : (
                  sortedPeriods.map((period) => (
                    <Card key={period.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-maven-purple">Period</Badge>
                            <p className="font-medium">{format(parseISO(period.startDate), 'MMM d, yyyy')} - {format(parseISO(period.endDate), 'MMM d, yyyy')}</p>
                          </div>
                          {period.notes && <p className="text-sm text-gray-600 mt-1">{period.notes}</p>}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="symptoms" className="mt-0 space-y-4">
                {sortedSymptoms.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No symptom entries logged yet.</p>
                    <Button asChild className="mt-4 bg-maven-teal">
                      <Link to="/log">Log Symptom</Link>
                    </Button>
                  </Card>
                ) : (
                  sortedSymptoms.map((symptom) => (
                    <Card key={symptom.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-maven-teal">Symptom</Badge>
                            <p className="font-medium">{symptom.type} - {symptom.severity}</p>
                          </div>
                          <p className="text-xs text-gray-500">{format(parseISO(symptom.date), 'MMM d, yyyy')}</p>
                          {symptom.notes && <p className="text-sm text-gray-600 mt-1">{symptom.notes}</p>}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="moods" className="mt-0 space-y-4">
                {sortedMoods.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No mood entries logged yet.</p>
                    <Button asChild className="mt-4 bg-maven-deep-purple">
                      <Link to="/log">Log Mood</Link>
                    </Button>
                  </Card>
                ) : (
                  sortedMoods.map((mood) => (
                    <Card key={mood.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-maven-deep-purple">Mood</Badge>
                            <p className="font-medium">{mood.mood}</p>
                          </div>
                          <p className="text-xs text-gray-500">{format(parseISO(mood.date), 'MMM d, yyyy')}</p>
                          {mood.notes && <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      
      <Navbar />
    </div>
  );
};

export default History;
