import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AIInterviewBot from "./pages/AIInterviewBot";
import VideoInterview from "./pages/VideoInterview";
import Settings from "./pages/Settings";
import Practice from "./pages/Practice";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import CameraDemo from "./pages/CameraDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-bot" element={<AIInterviewBot />} />
          <Route path="/video-interview" element={<VideoInterview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
          <Route path="/camera-demo" element={<CameraDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
