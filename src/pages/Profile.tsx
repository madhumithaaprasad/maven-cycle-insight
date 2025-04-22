
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { UserProfile } from '@/components/user/UserProfile';
import { ActivityLog } from '@/components/user/ActivityLog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addLogEntry } from '@/lib/activity-logger';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('mavenUserEmail');
    setIsLoggedIn(Boolean(email));
    
    // If not logged in, redirect to login page
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Log the logout activity
    addLogEntry({
      action: 'Logged Out',
      details: 'User logged out of the application',
    });
    
    // Clear user email (this is our simple "logged in" token)
    localStorage.removeItem('mavenUserEmail');
    
    // Show toast notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login page
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null; // Don't render anything while checking login status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Profile - Maven Period Tracker</title>
      </Helmet>
      
      <main className="container max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-maven-purple">Your Profile</h1>
            <p className="text-gray-600">Manage your account and view activity</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need to log back in to access your period tracking data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <UserProfile />
          </div>
          
          <div className="md:col-span-1">
            <ActivityLog />
          </div>
        </div>
      </main>
      
      <Navbar />
    </div>
  );
};

export default Profile;
