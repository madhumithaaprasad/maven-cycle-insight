
import { addDays, format, isAfter, subDays, differenceInDays } from 'date-fns';
import { addLogEntry } from './activity-logger';

interface ScheduleNotificationParams {
  title: string;
  body: string;
  scheduledDate: Date;
  type: 'period' | 'fertility' | 'ovulation' | 'reminder' | 'precaution';
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

// Schedule period prediction notifications with multiple reminders
export const schedulePeriodReminders = (predictedDate: Date, periodLength: number = 5): void => {
  // Advanced notification - 5 days before expected period
  const advancedReminderDate = subDays(predictedDate, 5);
  
  scheduleNotification({
    title: 'Period Coming Soon',
    body: `Your next period is expected to begin in 5 days, on ${format(predictedDate, 'MMM d, yyyy')}. Consider stocking up on supplies.`,
    scheduledDate: advancedReminderDate,
    type: 'precaution',
  });
  
  // Reminder notification - 3 days before expected period
  const reminderDate = subDays(predictedDate, 3);
  
  scheduleNotification({
    title: 'Period Reminder',
    body: `Your next period is expected to start in 3 days, on ${format(predictedDate, 'MMM d, yyyy')}. Prepare your essentials.`,
    scheduledDate: reminderDate,
    type: 'period',
  });
  
  // Day before notification
  const dayBeforeDate = subDays(predictedDate, 1);
  
  scheduleNotification({
    title: 'Period Starting Tomorrow',
    body: `Your period is expected to start tomorrow. Here are some self-care tips: rest well, stay hydrated, and have pain relief on hand if needed.`,
    scheduledDate: dayBeforeDate,
    type: 'precaution',
  });
  
  // Period start notification
  scheduleNotification({
    title: 'Period Expected Today',
    body: `Your period is expected to start today. Remember to track your symptoms for better future predictions.`,
    scheduledDate: new Date(predictedDate),
    type: 'period',
  });
  
  // Period end notification
  const endDate = addDays(predictedDate, periodLength - 1);
  
  scheduleNotification({
    title: 'Period Expected to End',
    body: `Based on your cycle history, your period is expected to end today. How are you feeling?`,
    scheduledDate: endDate,
    type: 'period',
  });
};

// Enhanced ovulation notification with fertility advice
export const scheduleEnhancedOvulationReminders = (ovulationDate: Date, fertilityWindowStart: Date): void => {
  // Fertility window start notification
  scheduleNotification({
    title: 'Fertility Window Beginning',
    body: `Your fertility window is beginning. If you're trying to conceive, this is a good time to plan.`,
    scheduledDate: fertilityWindowStart,
    type: 'fertility',
  });
  
  // Pre-ovulation notification - 2 days before
  const preOvulationDate = subDays(ovulationDate, 2);
  
  scheduleNotification({
    title: 'Approaching Peak Fertility',
    body: `You're approaching your most fertile day. Track any changes in cervical mucus which may become clearer and more stretchy.`,
    scheduledDate: preOvulationDate,
    type: 'fertility',
  });
  
  // Ovulation notification - 1 day before
  const dayBeforeOvulation = subDays(ovulationDate, 1);
  
  scheduleNotification({
    title: 'Ovulation Reminder',
    body: `You are expected to ovulate tomorrow, on ${format(ovulationDate, 'MMM d, yyyy')}. This is your peak fertility day if you're trying to conceive.`,
    scheduledDate: dayBeforeOvulation,
    type: 'ovulation',
  });
  
  // Ovulation day notification
  scheduleNotification({
    title: 'Ovulation Day',
    body: `Today is your estimated ovulation day. You may experience a slight increase in basal body temperature or mild cramping.`,
    scheduledDate: ovulationDate,
    type: 'ovulation',
  });
};

// Schedule PMS warning with symptom management tips
export const schedulePMSReminder = (periodDate: Date): void => {
  // PMS often starts 7-10 days before period
  const pmsStartDate = subDays(periodDate, 7);
  
  scheduleNotification({
    title: 'PMS May Begin Soon',
    body: `PMS symptoms may begin soon. Consider these tips: regular exercise, stress management, and reducing caffeine and salt intake can help ease symptoms.`,
    scheduledDate: pmsStartDate,
    type: 'precaution',
  });
};

// Schedule personalized cycle insights
export const schedulePersonalizedInsights = (
  periods: Array<{startDate: string, endDate: string}>,
  predictedDate: Date
): void => {
  if (periods.length >= 3) {
    // Calculate cycle consistency based on historical data
    const cycleDeviations = [];
    for (let i = 1; i < periods.length; i++) {
      const currentCycleLength = differenceInDays(
        new Date(periods[i-1].startDate),
        new Date(periods[i].startDate)
      );
      const previousCycleLength = i > 1 ? differenceInDays(
        new Date(periods[i-2].startDate),
        new Date(periods[i-1].startDate)
      ) : currentCycleLength;
      
      cycleDeviations.push(Math.abs(currentCycleLength - previousCycleLength));
    }
    
    // Average deviation to determine consistency
    const averageDeviation = cycleDeviations.reduce((sum, val) => sum + val, 0) / cycleDeviations.length;
    
    // Schedule insight notification a week after most recent period
    const mostRecentPeriod = periods[0];
    const insightDate = addDays(new Date(mostRecentPeriod.endDate), 7);
    
    let insightMessage = '';
    if (averageDeviation <= 2) {
      insightMessage = `Your cycles are very regular (varying by ~${Math.round(averageDeviation)} days). Your predictions should be quite accurate.`;
    } else if (averageDeviation <= 5) {
      insightMessage = `Your cycles have moderate variability (averaging ~${Math.round(averageDeviation)} days difference). Consider tracking additional factors like stress and exercise that may influence cycle length.`;
    } else {
      insightMessage = `Your cycles show significant variability (averaging ~${Math.round(averageDeviation)} days difference). Consider consulting with a healthcare provider if this is unusual for you.`;
    }
    
    scheduleNotification({
      title: 'Your Cycle Insights',
      body: insightMessage,
      scheduledDate: insightDate,
      type: 'reminder',
    });
  }
};

