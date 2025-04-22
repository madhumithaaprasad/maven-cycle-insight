
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import LogEntry from "./pages/LogEntry";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { CycleProvider } from "./context/CycleContext";
import { useEffect } from "react";
import { checkScheduledNotifications } from "./lib/notification-scheduler";

const queryClient = new QueryClient();

const App = () => {
  // Check for scheduled notifications on app start
  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CycleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/log" element={<LogEntry />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CycleProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
