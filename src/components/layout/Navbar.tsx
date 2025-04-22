
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, PlusCircle, History, Settings, Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCycle } from '@/context/CycleContext';

export function Navbar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const { isAuthenticated, checkAuthStatus } = useCycle();
  
  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);
  
  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: PlusCircle, label: 'Log', path: '/log' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  // Add profile link if authenticated
  if (isAuthenticated) {
    navItems.push({ icon: User, label: 'Profile', path: '/profile' });
  }

  return (
    <nav className="bg-white shadow-md py-3 px-4 fixed bottom-0 left-0 right-0 z-10 md:top-0 md:bottom-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="hidden md:block">
            <Link to="/" className="text-xl font-semibold text-maven-purple">
              Maven
            </Link>
          </div>
          
          <div className="flex justify-around w-full md:w-auto md:gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center md:flex-row md:gap-2 px-3 py-2",
                  activeTab === item.path
                    ? "text-maven-purple border-b-2 border-maven-purple rounded-none"
                    : "text-gray-500"
                )}
                onClick={() => setActiveTab(item.path)}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              </Button>
            ))}
            
            {!isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center md:flex-row md:gap-2 px-3 py-2",
                  activeTab === '/login'
                    ? "text-maven-purple border-b-2 border-maven-purple rounded-none"
                    : "text-gray-500"
                )}
                onClick={() => setActiveTab('/login')}
                asChild
              >
                <Link to="/login">
                  <User className="h-5 w-5" />
                  <span className="text-xs md:text-sm">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
