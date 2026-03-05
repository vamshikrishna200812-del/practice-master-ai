import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

// Lazy-load all pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AIInterviewBot = lazy(() => import("./pages/AIInterviewBot"));
const VideoInterview = lazy(() => import("./pages/VideoInterview"));
const Settings = lazy(() => import("./pages/Settings"));
const Practice = lazy(() => import("./pages/Practice"));
const Courses = lazy(() => import("./pages/Courses"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Help = lazy(() => import("./pages/Help"));
const CameraDemo = lazy(() => import("./pages/CameraDemo"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Promo = lazy(() => import("./pages/Promo"));
const QuestionBank = lazy(() => import("./pages/QuestionBank"));
const CheatSheet = lazy(() => import("./pages/CheatSheet"));
const CertificateVerify = lazy(() => import("./pages/CertificateVerify"));
const RecruiterMode = lazy(() => import("./pages/RecruiterMode"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const Classroom = lazy(() => import("./pages/Classroom"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Lazy-load chat widget since it's non-critical
const ChatWidget = lazy(() => import("./components/chat-widget").then(m => ({ default: m.ChatWidget })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
          <Suspense fallback={null}>
            <ChatWidget
              title="AI Assistant"
              greeting="👋 Hi there! I'm your AI assistant. Ask me anything about interview prep, coding, or career advice!"
              onSendMessage={async (messages, settings) => {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(
                  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-widget`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                      'Authorization': `Bearer ${session?.access_token ?? ''}`,
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
