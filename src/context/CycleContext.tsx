
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PeriodEntry, MoodEntry, SymptomEntry, UserPreferences } from '@/types';
import { predictNextPeriod } from '@/lib/date-utils';
import { useToast } from "@/hooks/use-toast";
import { addLogEntry } from '@/lib/activity-logger';
import { checkScheduledNotifications, schedulePeriodReminder, scheduleOvulationReminder } from '@/lib/notification-scheduler';

// Define the shape of our context
interface CycleContextType {
  // Data
  periods: PeriodEntry[];
  symptoms: SymptomEntry[];
  moods: MoodEntry[];
  userPreferences: UserPreferences;
  
  // Calculated data
  nextPeriod: Date | null;
  
  // Actions
  addPeriod: (period: Omit<PeriodEntry, 'id'>) => void;
  updatePeriod: (period: PeriodEntry) => void;
  deletePeriod: (id: string) => void;
  
  addSymptom: (symptom: Omit<SymptomEntry, 'id'>) => void;
  updateSymptom: (symptom: SymptomEntry) => void;
  deleteSymptom: (id: string) => void;
  
  addMood: (mood: Omit<MoodEntry, 'id'>) => void;
  updateMood: (mood: MoodEntry) => void;
  deleteMood: (id: string) => void;
  
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Authentication-related
  isAuthenticated: boolean;
  checkAuthStatus: () => boolean;
}

// Create the context
const CycleContext = createContext<CycleContextType | undefined>(undefined);

// Default user preferences
const defaultPreferences: UserPreferences = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  notifications: true,
  reminders: {
    periodStart: true,
    periodEnd: true,
    fertility: true,
    ovulation: true,
  },
};

// Mock initial data for development purposes
const initialPeriods: PeriodEntry[] = [
  {
    id: '1',
    startDate: format(addDays(new Date(), -35), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), -30), 'yyyy-MM-dd'),
    notes: 'Regular flow',
  },
  {
    id: '2',
    startDate: format(addDays(new Date(), -7), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
    notes: 'Light flow',
  },
];

// Provider component
export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const [periods, setPeriods] = useState<PeriodEntry[]>(initialPeriods);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Check for scheduled notifications on mount
  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  // Calculate next period prediction when periods data changes
  useEffect(() => {
    const predictedDate = predictNextPeriod(periods);
    setNextPeriod(predictedDate);
    
    // Schedule notifications if user has preferences set
    if (predictedDate && userPreferences.notifications) {
      // Schedule period reminder
      if (userPreferences.reminders.periodStart) {
        schedulePeriodReminder(predictedDate);
      }
      
      // Calculate and schedule ovulation reminder
      // Ovulation typically occurs ~14 days before the next period
      if (userPreferences.reminders.ovulation) {
        const ovulationDate = addDays(predictedDate, -14);
        scheduleOvulationReminder(ovulationDate);
      }
    }
  }, [periods, userPreferences]);

  // Period management functions
  const addPeriod = (period: Omit<PeriodEntry, 'id'>) => {
    const newPeriod = { ...period, id: uuidv4() };
    setPeriods(prev => [...prev, newPeriod]);
    
    // Log the activity
    addLogEntry({
      action: 'Period Logged',
      details: `Period logged from ${period.startDate} to ${period.endDate}`,
    });
    
    // Show toast notification
    toast({
      title: "Period Logged",
      description: "Your period data has been saved successfully.",
    });
    
    // Request notification permission and show notification
    if (userPreferences.notifications) {
      requestNotificationPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Maven Period Tracker', {
            body: 'Period data has been saved successfully',
          });
        }
      });
    }
  };

  const updatePeriod = (period: PeriodEntry) => {
    setPeriods(prev => prev.map(p => (p.id === period.id ? period : p)));
    
    // Log the activity
    addLogEntry({
      action: 'Period Updated',
      details: `Period entry updated for ${period.startDate}`,
    });
    
    // Show toast notification
    toast({
      title: "Period Updated",
      description: "Your period data has been updated successfully.",
    });
  };

  const deletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
    
    // Log the activity
    addLogEntry({
      action: 'Period Deleted',
      details: 'Period entry was deleted',
    });
    
    // Show toast notification
    toast({
      title: "Period Deleted",
      description: "Your period data has been deleted.",
    });
  };

  // Symptom management functions
  const addSymptom = (symptom: Omit<SymptomEntry, 'id'>) => {
    const newSymptom = { ...symptom, id: uuidv4() };
    setSymptoms(prev => [...prev, newSymptom]);
    
    // Log the activity
    addLogEntry({
      action: 'Symptom Logged',
      details: `${symptom.type} symptom logged for ${symptom.date}`,
    });
    
    // Show toast notification
    toast({
      title: "Symptom Logged",
      description: "Your symptom data has been saved successfully.",
    });
  };

  const updateSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => prev.map(s => (s.id === symptom.id ? symptom : s)));
    
    // Log the activity
    addLogEntry({
      action: 'Symptom Updated',
      details: `${symptom.type} symptom updated for ${symptom.date}`,
    });
    
    // Show toast notification
    toast({
      title: "Symptom Updated",
      description: "Your symptom data has been updated successfully.",
    });
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    
    // Log the activity
    addLogEntry({
      action: 'Symptom Deleted',
      details: 'Symptom entry was deleted',
    });
    
    // Show toast notification
    toast({
      title: "Symptom Deleted",
      description: "Your symptom data has been deleted.",
    });
  };

  // Mood management functions
  const addMood = (mood: Omit<MoodEntry, 'id'>) => {
    const newMood = { ...mood, id: uuidv4() };
    setMoods(prev => [...prev, newMood]);
    
    // Log the activity
    addLogEntry({
      action: 'Mood Logged',
      details: `${mood.mood} mood logged for ${mood.date}`,
    });
    
    // Show toast notification
    toast({
      title: "Mood Logged",
      description: "Your mood data has been saved successfully.",
    });
  };

  const updateMood = (mood: MoodEntry) => {
    setMoods(prev => prev.map(m => (m.id === mood.id ? mood : m)));
    
    // Log the activity
    addLogEntry({
      action: 'Mood Updated',
      details: `${mood.mood} mood updated for ${mood.date}`,
    });
    
    // Show toast notification
    toast({
      title: "Mood Updated",
      description: "Your mood data has been updated successfully.",
    });
  };

  const deleteMood = (id: string) => {
    setMoods(prev => prev.filter(m => m.id !== id));
    
    // Log the activity
    addLogEntry({
      action: 'Mood Deleted',
      details: 'Mood entry was deleted',
    });
    
    // Show toast notification
    toast({
      title: "Mood Deleted",
      description: "Your mood data has been deleted.",
    });
  };

  // Preferences management
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => {
      const updated = { ...prev, ...preferences };
      
      // Log the activity
      addLogEntry({
        action: 'Preferences Updated',
        details: 'User preferences were updated',
      });
      
      // Show toast notification
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been updated successfully.",
      });
      
      return updated;
    });
  };

  // Helper function to request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }
    
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  };
  
  // Check if user is authenticated
  const checkAuthStatus = () => {
    const email = localStorage.getItem('mavenUserEmail');
    const isAuth = Boolean(email);
    setIsAuthenticated(isAuth);
    return isAuth;
  };

  const value = {
    periods,
    symptoms,
    moods,
    userPreferences,
    nextPeriod,
    addPeriod,
    updatePeriod,
    deletePeriod,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    addMood,
    updateMood,
    deleteMood,
    updatePreferences,
    isAuthenticated,
    checkAuthStatus,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
};

// Custom hook for using the context
export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};
