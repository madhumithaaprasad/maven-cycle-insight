
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInYears, parse } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { addLogEntry } from '@/lib/activity-logger';

interface UserData {
  name: string;
  email: string;
  dob: string;
  notes: string;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional(),
  dob: z.string().optional(),
  notes: z.string().max(500, { message: 'Notes must be less than 500 characters.' }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('mavenUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      dob: userData?.dob || '',
      notes: userData?.notes || '',
    },
    values: userData || undefined,
  });

  // Update form when userData changes
  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to update the user profile
      // For now, we'll update localStorage
      const updatedUserData = {
        ...userData,
        ...data,
      };
      
      localStorage.setItem('mavenUser', JSON.stringify(updatedUserData));
      setUserData(updatedUserData as UserData);
      
      // Log the activity
      addLogEntry({
        action: 'Profile Updated',
        details: 'Updated profile information',
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string | undefined) => {
    if (!dob) return '';
    try {
      const dobDate = parse(dob, 'yyyy-MM-dd', new Date());
      return `${differenceInYears(new Date(), dobDate)} years`;
    } catch {
      return '';
    }
  };

  if (!userData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="w-1/2">
              <div className="form-item">
                <div className="text-sm font-medium mb-2">Age</div>
                <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                  {calculateAge(form.watch('dob'))}
                </div>
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any personal notes or health information here..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-gray-500 text-right">
                  {field.value?.length || 0}/500
                </div>
              </FormItem>
            )}
          />
          
          <div className="pt-2">
            <Button type="submit" className="bg-maven-purple hover:bg-maven-purple/90" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
