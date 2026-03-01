import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, MessageSquare, Hand, LogOut,
  Send, Volume2, VolumeX, Play, ChevronRight, Sparkles,
  Clock, Users, BookOpen, Download
} from "lucide-react";
import { HumanAvatar } from "@/components/interview/HumanAvatar";

interface ChatMessage {
  id: string;
  role: "student" | "instructor" | "system";
  content: string;
  timestamp: Date;
  userName?: string;
}

interface LessonPlan {
  title: string;
  sections: { heading: string; content: string; duration: number }[];
}

const DEFAULT_LESSON: LessonPlan = {
  title: "Introduction to Technical Interviews",
  sections: [
    { heading: "Welcome & Overview", content: "Welcome to today's class on mastering technical interviews. We'll cover the key strategies that top candidates use to stand out. Technical interviews test not just your coding ability, but your problem-solving approach, communication skills, and ability to handle pressure.", duration: 2 },
    { heading: "The STAR Method", content: "The STAR method is your secret weapon for behavioral questions. STAR stands for Situation, Task, Action, and Result. When answering, first describe the Situation you faced, then the specific Task you needed to accomplish. Next, explain the Action you took, and finally share the measurable Result. For example, instead of saying 'I improved the system,' say 'I redesigned the caching layer, reducing API response time by 40% and saving $50,000 annually in infrastructure costs.'", duration: 3 },
    { heading: "System Design Principles", content: "For system design interviews, always start by clarifying requirements. Ask about scale, availability needs, and constraints. Then sketch a high-level architecture before diving into details. Remember the key principles: scalability through horizontal scaling, reliability through redundancy, and performance through caching and CDNs. A great framework is: Requirements, Estimation, API Design, Data Model, High-Level Design, then Deep Dive into specific components.", duration: 4 },
    { heading: "Coding Interview Strategy", content: "When facing a coding problem, never jump straight into code. First, understand the problem completely by asking clarifying questions. Then work through examples by hand. Discuss your approach before coding, mentioning time and space complexity. Write clean, modular code and test with edge cases. If you're stuck, communicate your thought process — interviewers value problem-solving approach over getting the perfect answer immediately.", duration: 3 },
    { heading: "Q&A and Wrap-up", content: "That concludes our main lesson for today. Remember, interview success comes from consistent practice and self-reflection. Review your performance after each practice session, identify patterns in your mistakes, and focus on improving one skill at a time. Now let's open the floor for any questions you might have.", duration: 2 },
  ]
};

const Classroom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const _classId = searchParams.get("id");

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [handRaised, setHandRaised] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lesson
  const [lesson] = useState<LessonPlan>(DEFAULT_LESSON);
  const [displayedText, setDisplayedText] = useState("");
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);

  // Avatar/TTS
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Video
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (!isSessionActive || isPaused || isSessionEnded) return;
    const interval = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, isPaused, isSessionEnded]);

  // Chat auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  // TTS
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isMuted) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => /female|zira|samantha|jenny|karen/i.test(v.name))
        || voices.find(v => v.lang.startsWith("en"));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utteranceRef.current = utterance;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  // Use browser TTS directly (D-ID API key is invalid)
  const tryDIDAvatarOrTTS = useCallback(async (text: string) => {
    await speakText(text);
  }, [speakText]);

  // Typewriter effect for displayed text
  const typeText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 25);
    });
  }, []);

  // Start session
  const startSession = async () => {
    setIsSessionActive(true);
    await startCamera();
    setChatMessages([{
      id: "system-start",
      role: "system",
      content: `📚 Class "${lesson.title}" has started. Welcome!`,
      timestamp: new Date()
    }]);
    teachSection(0);
  };

  // Teach a section
  const teachSection = async (index: number) => {
    if (index >= lesson.sections.length) {
      endSession();
      return;
    }
    setCurrentSectionIndex(index);
    const section = lesson.sections[index];

    setChatMessages(prev => [...prev, {
      id: `section-${index}`,
      role: "instructor",
      content: `📖 **${section.heading}**`,
      timestamp: new Date()
    }]);

    // Speak and type simultaneously
    await Promise.all([
      tryDIDAvatarOrTTS(section.content),
      typeText(section.content)
    ]);

    // Brief pause between sections
    await new Promise(r => setTimeout(r, 2000));

    // Auto-advance if not paused
    if (!isPaused) {
      teachSection(index + 1);
    }
  };

  // End session
  const endSession = async () => {
    setIsSessionEnded(true);
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
    stopCamera();

    setChatMessages(prev => [...prev, {
      id: "system-end",
      role: "system",
      content: "🎓 Class has ended! Generating summary...",
      timestamp: new Date()
    }]);

    // Generate summary via AI
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classroom-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "generate_summary",
          lessonTitle: lesson.title,
          sections: lesson.sections.map(s => s.heading),
          chatHistory: chatMessages.filter(m => m.role !== "system").map(m => m.content).join("\n"),
          duration: elapsedTime
        }),
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let summary = "";
        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: d } = await reader.read();
            done = d;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
                  try {
                    const parsed = JSON.parse(line.slice(6));
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) summary += content;
                  } catch { /* skip */ }
                }
              }
            }
          }
        }
        setSessionSummary(summary || "Class completed successfully!");
      }
    } catch {
      setSessionSummary("Class completed successfully. Great session!");
    }

    // Create notification
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("notifications").insert({
          user_id: session.user.id,
          title: "Class Completed! 🎓",
          message: `You completed "${lesson.title}". +50 points earned!`,
          type: "class_complete",
          link: "/courses"
        });
      }
    } catch { /* ignore */ }

    toast.success("Class completed! Summary generated.");
  };

  // Handle Q&A
  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const question = chatInput.trim();
    setChatInput("");

    setChatMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "student",
      content: question,
      timestamp: new Date(),
      userName: "You"
    }]);

    setIsChatLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classroom-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "answer_question",
          question,
          lessonContext: lesson.sections.map(s => `${s.heading}: ${s.content}`).join("\n"),
          currentTopic: lesson.sections[currentSectionIndex]?.heading || lesson.title
        }),
      });

      if (!res.ok) throw new Error("Failed");

      let answer = "";
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        const msgId = `ai-${Date.now()}`;
        setChatMessages(prev => [...prev, { id: msgId, role: "instructor", content: "", timestamp: new Date() }]);
        let done = false;
        while (!done) {
          const { value, done: d } = await reader.read();
          done = d;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
                try {
                  const parsed = JSON.parse(line.slice(6));
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    answer += content;
                    setChatMessages(prev => prev.map(m =>
                      m.id === msgId ? { ...m, content: answer } : m
                    ));
                  }
                } catch { /* skip */ }
              }
            }
          }
        }
      }
    } catch {
      setChatMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "instructor",
        content: "I apologize, I'm having trouble answering that right now. Please try again.",
        timestamp: new Date()
      }]);
    }
    setIsChatLoading(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = lesson.sections.length > 0
    ? ((currentSectionIndex + (isSessionEnded ? 1 : 0)) / lesson.sections.length) * 100
    : 0;

  // Pre-session lobby
  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full mx-4 text-center space-y-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-white/60">AI-powered interactive classroom session</p>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~15 min</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {lesson.sections.length} sections</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Live Q&A</span>
          </div>
          <Button
            onClick={startSession}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-6 text-lg rounded-xl"
          >
            <Play className="w-5 h-5 mr-2" /> Enter Classroom
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/40 hover:text-white/70">
            ← Back to Schedule
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a1a] text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0d0d20]/90 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-indigo-500/50 text-indigo-400 bg-indigo-500/10">
            {isSessionEnded ? "Ended" : isSpeaking ? "🔴 LIVE" : "Active"}
          </Badge>
          <h2 className="text-sm font-medium truncate max-w-[200px] md:max-w-none">{lesson.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 font-mono">{formatTime(elapsedTime)}</span>
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-white/40">
              {currentSectionIndex + 1}/{lesson.sections.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Theater Stage */}
        <div className="flex-1 flex flex-col relative">
          {/* Avatar Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-purple-900/10" />

            <motion.div
              className="relative z-10"
              animate={{ scale: isSpeaking ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {avatarVideoUrl ? (
                <video
                  src={avatarVideoUrl}
                  autoPlay
                  onEnded={() => { setAvatarVideoUrl(null); setIsSpeaking(false); }}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl shadow-indigo-500/20"
                />
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80">
                  <HumanAvatar
                    isSpeaking={isSpeaking}
                    isLoading={isAvatarLoading}
                  />
                </div>
              )}

              {/* Speaking indicator */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-indigo-400 rounded-full"
                        animate={{ height: [8, 20 + Math.random() * 16, 8] }}
                        transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Lesson text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <AnimatePresence mode="wait">
                {displayedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl mx-auto bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-sm md:text-base text-white/90 leading-relaxed">{displayedText}</p>
                    <p className="text-xs text-indigo-400 mt-2 font-medium">
                      {lesson.sections[currentSectionIndex]?.heading}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Student video PIP */}
            <div className="absolute top-4 right-4 w-32 h-24 md:w-40 md:h-30 rounded-lg overflow-hidden border border-white/20 bg-black/50 shadow-xl">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-white/40" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="h-16 border-t border-white/10 bg-[#0d0d20]/90 flex items-center justify-center gap-3 px-4 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isMicOn ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isCameraOn ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => setIsCameraOn(!isCameraOn)}
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isMuted ? "bg-red-600/50 hover:bg-red-600/70" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) window.speechSynthesis.cancel();
              }}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${handRaised ? "bg-yellow-500 hover:bg-yellow-400" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => {
                setHandRaised(!handRaised);
                toast(handRaised ? "Hand lowered" : "✋ Hand raised! Type your question in the chat.");
              }}
            >
              <Hand className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-white/20 mx-1" />

            {!isSessionEnded && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20"
                onClick={() => {
                  if (currentSectionIndex < lesson.sections.length - 1) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    teachSection(currentSectionIndex + 1);
                  }
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={() => isSessionEnded ? navigate("/schedule") : endSession()}
              className="rounded-full bg-red-600 hover:bg-red-500 text-white px-4 h-10 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1" />
              {isSessionEnded ? "Exit" : "End Class"}
            </Button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 lg:w-96 border-l border-white/10 bg-[#0d0d20]/80 flex flex-col hidden md:flex">
          <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">Live Chat & Q&A</span>
            <Sparkles className="w-3 h-3 text-indigo-400 ml-auto" />
          </div>

          {/* Session summary */}
          <AnimatePresence>
            {isSessionEnded && sessionSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-b border-white/10 p-4 bg-indigo-500/10"
              >
                <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Session Summary
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{sessionSummary}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                  onClick={() => {
                    const blob = new Blob([sessionSummary], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${lesson.title}-summary.txt`;
                    a.click();
                  }}
                >
                  <Download className="w-3 h-3 mr-1" /> Download Summary
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {chatMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    msg.role === "system"
                      ? "text-center text-white/40 text-xs py-2"
                      : msg.role === "student"
                      ? "text-right"
                      : ""
                  }`}
                >
                  {msg.role === "system" ? (
                    <span>{msg.content}</span>
                  ) : (
                    <div className={`inline-block max-w-[85%] ${msg.role === "student" ? "ml-auto" : ""}`}>
                      <span className={`text-xs font-medium mb-1 block ${
                        msg.role === "instructor" ? "text-indigo-400" : "text-emerald-400"
                      }`}>
                        {msg.role === "instructor" ? "AI Instructor" : msg.userName || "You"}
                      </span>
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.role === "student"
                          ? "bg-indigo-600/30 border border-indigo-500/20"
                          : "bg-white/5 border border-white/10"
                      }`}>
                        <p className="text-white/85 text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  </motion.div>
                  <span>AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-white/10 p-3 shrink-0">
            <form onSubmit={e => { e.preventDefault(); handleSendChat(); }} className="flex gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm"
                disabled={isSessionEnded}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!chatInput.trim() || isChatLoading || isSessionEnded}
                className="bg-indigo-600 hover:bg-indigo-500 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
