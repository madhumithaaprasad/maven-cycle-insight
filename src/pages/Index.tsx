
import { Helmet } from 'react-helmet-async';
import { CycleProvider } from '@/context/CycleContext';
import { Navbar } from '@/components/layout/Navbar';
import { CycleOverview } from '@/components/dashboard/CycleOverview';
import { RecentEntries } from '@/components/dashboard/RecentEntries';
import { CycleCalendar } from '@/components/calendar/CycleCalendar';

const Index = () => {
  return (
    <CycleProvider>
      <Helmet>
        <title>Maven | Period Tracker</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <main className="container max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-maven-purple">Maven</h1>
            <p className="text-gray-600">Track your cycle, understand your body</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <CycleOverview />
              <RecentEntries />
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-medium mb-4">Calendar</h2>
                <CycleCalendar />
              </div>
            </div>
          </div>
        </main>
        
        <Navbar />
      </div>
    </CycleProvider>
  );
};

export default Index;
