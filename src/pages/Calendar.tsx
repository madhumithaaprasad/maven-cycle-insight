
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { CycleCalendar } from '@/components/calendar/CycleCalendar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Calendar | Maven</title>
      </Helmet>
      
      <main className="container max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-maven-purple">Calendar View</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <CycleCalendar />
          
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-medium">Calendar Legend</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-maven-purple"></div>
                <span>Period Days</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-maven-light-purple"></div>
                <span>Predicted Period</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-maven-soft-peach"></div>
                <span>Fertile Window</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-maven-teal"></div>
                <span>Ovulation Day</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-500 text-sm">
              The calendar shows your recorded periods and predictions for your next cycle. 
              Fertility window and ovulation predictions are calculated based on your cycle history.
            </p>
          </div>
        </div>
      </main>
      
      <Navbar />
    </div>
  );
};

export default Calendar;
