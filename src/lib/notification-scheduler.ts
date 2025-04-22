import { addDays, format, isAfter } from 'date-fns';
import { addLogEntry } from './activity-logger';

interface ScheduleNotificationParams {
  title: string;
  body: string;
  scheduledDate: Date;
  type: 'period' | 'fertility' | 'ovulation' | 'reminder';
  id?: string;
}

export const scheduleNotification = async ({
  title,
  body,
  scheduledDate,
  type,
  id = Math.random().toString(36).substring(2, 9)
}: ScheduleNotificationParams): Promise<boolean> => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    // Request permission if not already granted
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return false;
      }
    }

    // For demo purposes, store scheduled notifications in localStorage
    const scheduledNotifications = JSON.parse(
      localStorage.getItem('mavenScheduledNotifications') || '[]'
    );

    // Add new notification to the list
    const newNotification = {
      id,
      title,
      body,
      scheduledDate: scheduledDate.toISOString(),
      type,
      createdAt: new Date().toISOString(),
    };

    scheduledNotifications.push(newNotification);
    localStorage.setItem('mavenScheduledNotifications', JSON.stringify(scheduledNotifications));

    // Log the scheduled notification
    addLogEntry({
      action: 'Notification Scheduled',
      details: `${type} notification scheduled for ${format(scheduledDate, 'MMM d, yyyy')}`,
    });

    return true;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Function to check and trigger due notifications (should be called on app startup)
export const checkScheduledNotifications = (): void => {
  try {
    const scheduledNotifications = JSON.parse(
      localStorage.getItem('mavenScheduledNotifications') || '[]'
    );

    const now = new Date();
    const updatedNotifications = [];

    for (const notification of scheduledNotifications) {
      const scheduledDate = new Date(notification.scheduledDate);

      // If the notification is due, show it
      if (isAfter(now, scheduledDate)) {
        // Show notification
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/favicon.ico',
          });

          // Log that the notification was triggered
          addLogEntry({
            action: 'Notification Sent',
            details: `${notification.type} notification: ${notification.title}`,
          });
        }
      } else {
        // Keep notifications that are still scheduled for the future
        updatedNotifications.push(notification);
      }
    }

    // Update the stored notifications
    localStorage.setItem('mavenScheduledNotifications', JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error checking scheduled notifications:', error);
  }
};

// Schedule period prediction notification
export const schedulePeriodReminder = (predictedDate: Date): void => {
  // Remind 3 days before expected period
  const reminderDate = addDays(predictedDate, -3);
  
  scheduleNotification({
    title: 'Period Reminder',
    body: `Your next period is expected to start in 3 days, on ${format(predictedDate, 'MMM d, yyyy')}.`,
    scheduledDate: reminderDate,
    type: 'period',
  });
};

// Schedule ovulation notification
export const scheduleOvulationReminder = (ovulationDate: Date): void => {
  // Remind 1 day before expected ovulation
  const reminderDate = addDays(ovulationDate, -1);
  
  scheduleNotification({
    title: 'Ovulation Reminder',
    body: `You are expected to ovulate tomorrow, on ${format(ovulationDate, 'MMM d, yyyy')}.`,
    scheduledDate: reminderDate,
    type: 'ovulation',
  });
};
