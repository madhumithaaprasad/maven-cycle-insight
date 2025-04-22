
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, PlusCircle, History, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [activeTab, setActiveTab] = useState('/');
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: PlusCircle, label: 'Log', path: '/log' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

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
          </div>
        </div>
      </div>
    </nav>
  );
}
