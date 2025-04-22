
// Define types for the Maven period tracker

// Type for period entry
export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

// Type for symptom entry
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomEntry {
  id: string;
  date: string;
  type: string;
  severity: SymptomSeverity;
  notes?: string;
}

// Type for mood entry
export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  notes?: string;
}

// Type for user preferences
export interface UserPreferences {
  averageCycleLength: number;
  averagePeriodLength: number;
  notifications: boolean;
  reminders: {
    periodStart: boolean;
    periodEnd: boolean;
    fertility: boolean;
    ovulation: boolean;
  };
}
