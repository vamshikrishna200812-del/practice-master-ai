import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
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
import Promo from "./pages/Promo";
import QuestionBank from "./pages/QuestionBank";
import CheatSheet from "./pages/CheatSheet";
import CertificateVerify from "./pages/CertificateVerify";
import RecruiterMode from "./pages/RecruiterMode";
import Leaderboard from "./pages/Leaderboard";
import { ChatWidget } from "./components/chat-widget";
import AIAssistant from "./pages/AIAssistant";
import ResumeBuilder from "./pages/ResumeBuilder";
import Classroom from "./pages/Classroom";
import ResetPassword from "./pages/ResetPassword";

// Create QueryClient outside component to prevent recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

/**
 * App Component - Root application with global error handling
 * Implements Professional Architect resilience standards
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<EmailVerification />} />
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
            <Route path="/promo" element={<Promo />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/cheat-sheet" element={<CheatSheet />} />
            <Route path="/verify" element={<CertificateVerify />} />
            <Route path="/recruiter-mode" element={<RecruiterMode />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget
            title="AI Assistant"
            greeting="👋 Hi there! I'm your AI assistant. Ask me anything about interview prep, coding, or career advice!"
            onSendMessage={async (messages, settings) => {
              const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-widget`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                  },
                  body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                    settings,
                  }),
                }
              );
              if (!res.ok) throw new Error('Failed to get response');
              return res.body!;
            }}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
