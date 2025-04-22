
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { PeriodLogForm } from '@/components/tracking/PeriodLogForm';
import { SymptomTracker } from '@/components/tracking/SymptomTracker';
import { MoodTracker } from '@/components/tracking/MoodTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LogEntry = () => {
  const [activeTab, setActiveTab] = useState('period');

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Log Entry | Maven</title>
      </Helmet>
      
      <main className="container max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-maven-purple">Log Entry</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="period" className="text-maven-purple data-[state=active]:bg-maven-light-purple">
              Period
            </TabsTrigger>
            <TabsTrigger value="symptom" className="text-maven-teal data-[state=active]:bg-maven-teal data-[state=active]:text-white">
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-maven-deep-purple data-[state=active]:bg-maven-deep-purple data-[state=active]:text-white">
              Mood
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="period" className="mt-0">
            <PeriodLogForm />
          </TabsContent>
          
          <TabsContent value="symptom" className="mt-0">
            <SymptomTracker />
          </TabsContent>
          
          <TabsContent value="mood" className="mt-0">
            <MoodTracker />
          </TabsContent>
        </Tabs>
      </main>
      
      <Navbar />
    </div>
  );
};

export default LogEntry;
