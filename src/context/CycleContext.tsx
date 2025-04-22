
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PeriodEntry, MoodEntry, SymptomEntry, UserPreferences } from '@/types';
import { predictNextPeriod } from '@/lib/date-utils';

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

  // Calculate next period prediction when periods data changes
  useEffect(() => {
    const predictedDate = predictNextPeriod(periods);
    setNextPeriod(predictedDate);
  }, [periods]);

  // Period management functions
  const addPeriod = (period: Omit<PeriodEntry, 'id'>) => {
    const newPeriod = { ...period, id: uuidv4() };
    setPeriods(prev => [...prev, newPeriod]);
    
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
  };

  const deletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  };

  // Symptom management functions
  const addSymptom = (symptom: Omit<SymptomEntry, 'id'>) => {
    const newSymptom = { ...symptom, id: uuidv4() };
    setSymptoms(prev => [...prev, newSymptom]);
  };

  const updateSymptom = (symptom: SymptomEntry) => {
    setSymptoms(prev => prev.map(s => (s.id === symptom.id ? symptom : s)));
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  // Mood management functions
  const addMood = (mood: Omit<MoodEntry, 'id'>) => {
    const newMood = { ...mood, id: uuidv4() };
    setMoods(prev => [...prev, newMood]);
  };

  const updateMood = (mood: MoodEntry) => {
    setMoods(prev => prev.map(m => (m.id === mood.id ? mood : m)));
  };

  const deleteMood = (id: string) => {
    setMoods(prev => prev.filter(m => m.id !== id));
  };

  // Preferences management
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
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
