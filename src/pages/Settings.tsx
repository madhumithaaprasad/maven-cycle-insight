
import { Helmet } from 'react-helmet-async';
import { useCycle } from '@/context/CycleContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Settings = () => {
  const { userPreferences, updatePreferences } = useCycle();
  const [isSaving, setIsSaving] = useState(false);
  
  // Create local state to track changes
  const [preferences, setPreferences] = useState({
    averageCycleLength: userPreferences.averageCycleLength,
    averagePeriodLength: userPreferences.averagePeriodLength,
    notifications: userPreferences.notifications,
    reminders: { ...userPreferences.reminders },
  });
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue) || numValue < 1) return;
    
    setPreferences((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === 'notifications') {
      setPreferences((prev) => ({
        ...prev,
        notifications: checked,
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        reminders: {
          ...prev.reminders,
          [name]: checked,
        },
      }));
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Request notification permission if needed
      if (preferences.notifications && !userPreferences.notifications) {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          
          if (permission !== 'granted') {
            toast.error('Notification permission denied. Enable in browser settings to receive notifications.');
            setPreferences((prev) => ({ ...prev, notifications: false }));
            return;
          }
        }
      }
      
      // Update preferences in context
      updatePreferences(preferences);
      
      // Show success message
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Settings | Maven</title>
      </Helmet>
      
      <main className="container max-w-3xl mx-auto px-4 pt-6 pb-24 md:pb-6 md:pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-maven-purple">Settings</h1>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="cycle">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="cycle">Cycle Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cycle">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Cycle Settings</h2>
              
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="averageCycleLength">Average Cycle Length (days)</Label>
                    <Input
                      id="averageCycleLength"
                      name="averageCycleLength"
                      type="number"
                      min="1"
                      value={preferences.averageCycleLength}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="averagePeriodLength">Average Period Length (days)</Label>
                    <Input
                      id="averagePeriodLength"
                      name="averagePeriodLength"
                      type="number"
                      min="1"
                      value={preferences.averagePeriodLength}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Notification Settings</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-gray-500 cursor-help">
                        <InfoCircledIcon className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Notifications will help you prepare for upcoming cycle events with timely reminders and health tips.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-toggle" className="text-base font-medium">Enable All Notifications</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive browser notifications for reminders and predictions
                    </p>
                  </div>
                  <Switch
                    id="notifications-toggle"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handleSwitchChange('notifications', checked)}
                  />
                </div>
                
                {preferences.notifications && (
                  <div className="space-y-6 pt-4 pl-4 border-l-2 border-maven-light-purple">
                    <h3 className="text-base font-medium mb-2">Period Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="period-start-toggle">Period Start Predictions</Label>
                          <p className="text-xs text-gray-500">Multiple notifications leading up to your period</p>
                        </div>
                        <Switch
                          id="period-start-toggle"
                          checked={preferences.reminders.periodStart}
                          onCheckedChange={(checked) => handleSwitchChange('periodStart', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="period-end-toggle">Period End Notification</Label>
                          <p className="text-xs text-gray-500">Get notified when your period is likely ending</p>
                        </div>
                        <Switch
                          id="period-end-toggle"
                          checked={preferences.reminders.periodEnd}
                          onCheckedChange={(checked) => handleSwitchChange('periodEnd', checked)}
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-base font-medium mb-2">Fertility Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="fertility-toggle">Fertility Window Alerts</Label>
                          <p className="text-xs text-gray-500">Get notified about your fertility window</p>
                        </div>
                        <Switch
                          id="fertility-toggle"
                          checked={preferences.reminders.fertility}
                          onCheckedChange={(checked) => handleSwitchChange('fertility', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ovulation-toggle">Ovulation Prediction</Label>
                          <p className="text-xs text-gray-500">Receive reminders before and during ovulation</p>
                        </div>
                        <Switch
                          id="ovulation-toggle"
                          checked={preferences.reminders.ovulation}
                          onCheckedChange={(checked) => handleSwitchChange('ovulation', checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button 
            onClick={handleSave}
            className="bg-maven-purple hover:bg-maven-deep-purple w-full"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Maven Period Tracker - Version 1.1.0
            <br />
            Your data is stored locally in your browser
          </p>
        </div>
      </main>
      
      <Navbar />
    </div>
  );
};

export default Settings;
