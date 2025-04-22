
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCycle } from '@/context/CycleContext';

// Form schema validation
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  dob: z.string().refine(date => {
    const parsedDate = new Date(date);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 10); // Minimum age of 10
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 70); // Maximum age of 70
    
    return parsedDate <= minAge && parsedDate >= maxAge;
  }, { message: 'Please enter a valid date of birth. Age must be between 10-70 years.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePreferences } = useCycle();

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      dob: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call a real registration API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the registration
      console.log('User registered:', {
        name: data.name,
        email: data.email,
        dob: data.dob,
      });
      
      // Store user info in localStorage
      localStorage.setItem('mavenUser', JSON.stringify({
        name: data.name,
        email: data.email,
        dob: data.dob,
        registeredAt: new Date().toISOString(),
      }));
      
      localStorage.setItem('mavenUserEmail', data.email);
      
      // Update user preferences in context
      updatePreferences({
        notifications: true,
        reminders: {
          periodStart: true,
          periodEnd: true,
          fertility: true,
          ovulation: true,
        }
      });
      
      // Show success notification
      toast({
        title: "Registration Successful",
        description: "Your account has been created. A verification email has been sent to your inbox.",
      });
      
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Helmet>
        <title>Register - Maven Period Tracker</title>
      </Helmet>
      
      <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-maven-purple">Maven</h1>
          <p className="text-gray-600">Create your account</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Jane Doe" className="pl-10" {...field} />
                    </div>
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="your@email.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="date" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full bg-maven-purple hover:bg-maven-purple/90" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 text-maven-purple"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
