import { v4 as uuidv4 } from 'uuid';

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface LogParams {
  action: string;
  details: string;
}

// Maximum number of log entries to keep
const MAX_LOG_ENTRIES = 100;

export const addLogEntry = (params: LogParams): void => {
  const { action, details } = params;
  
  // Create new log entry
  const newEntry: LogEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  
  // Get existing logs
  const storedLogs = localStorage.getItem('mavenActivityLogs');
  let logs: LogEntry[] = storedLogs ? JSON.parse(storedLogs) : [];
  
  // Add new entry at the beginning
  logs = [newEntry, ...logs];
  
  // Limit the number of entries
  if (logs.length > MAX_LOG_ENTRIES) {
    logs = logs.slice(0, MAX_LOG_ENTRIES);
  }
  
  // Save back to localStorage
  localStorage.setItem('mavenActivityLogs', JSON.stringify(logs));
  
  // Also log to console for debugging
  console.log(`[Activity Log] ${action}: ${details}`);
};

export const clearLogs = (): void => {
  localStorage.removeItem('mavenActivityLogs');
};
