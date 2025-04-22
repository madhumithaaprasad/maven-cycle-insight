
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export const ActivityLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Load logs from localStorage
    const storedLogs = localStorage.getItem('mavenActivityLogs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
      {logs.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No activity recorded yet.
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border-b border-gray-100 pb-2">
                <div className="flex justify-between">
                  <span className="font-medium text-maven-purple">{log.action}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
