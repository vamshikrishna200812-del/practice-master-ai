import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Brain, Loader2, ChevronRight, TrendingUp, CheckCircle2,
  AlertTriangle, Sparkles, Lightbulb, User, Zap, Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HumanAvatar } from "./HumanAvatar";
import { FaceDetectionFeedback } from "./FaceDetectionFeedback";
import { AvatarEmotion } from "./AnimatedAvatar";
import { InterviewState } from "./AIVideoInterview";

interface FeedbackData {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface VideoCallInterfaceProps {
  avatarVideoUrl: string | null;
  isAvatarLoading: boolean;
  isSpeaking: boolean;
  avatarError: string | null;
  onAvatarVideoEnd: () => void;
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  userTranscript: string;
  isRecording: boolean;
  isListening: boolean;
  isLoading: boolean;
  currentFeedback: FeedbackData | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSkipQuestion: () => void;
  onEndInterview: () => void;
  userVideoRef: React.RefObject<HTMLVideoElement>;
  userStream: MediaStream | null;
  isCameraOn: boolean;
  emotion?: AvatarEmotion;
  interviewState?: InterviewState;
  proTips?: string[];
}

export const VideoCallInterface = ({
  avatarVideoUrl,
  isAvatarLoading,
  isSpeaking,
  avatarError,
  onAvatarVideoEnd,
  currentQuestion,
  questionNumber,
  totalQuestions,
  userTranscript,
  isRecording,
  isListening,
  isLoading,
  currentFeedback,
  onStartRecording,
  onStopRecording,
  onSkipQuestion,
  onEndInterview,
  userVideoRef,
  userStream,
  isCameraOn,
  emotion = "neutral",
  interviewState = "IDLE",
  proTips = [],
}: VideoCallInterfaceProps) => {
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const [isAvatarVideoReady, setIsAvatarVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(24).fill(4));
  const [displayedText, setDisplayedText] = useState("");
  const feedEndRef = useRef<HTMLDivElement>(null);
  const [copilotMessages, setCopilotMessages] = useState<
    { id: string; type: "hint" | "transcript" | "feedback" | "tip" | "user"; text: string; time: string }[]
  >([
    {
      id: "welcome",
      type: "hint",
      text: "Great to see you! Ready for your NextGen Interview? I'll provide real-time hints and feedback as you go. 🚀",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Attach user stream
  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream, userVideoRef]);

  // Voice waveform
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setWaveformBars(
          Array.from({ length: 24 }, (_, i) => {
            const dist = Math.abs(i - 12);
            return Math.max(4, 28 - dist * 2) + Math.random() * 18;
          })
        );
      }, 80);
      return () => clearInterval(interval);
    }
    setWaveformBars(Array(24).fill(4));
  }, [isSpeaking]);

  // Typewriter
  useEffect(() => {
    if (!currentQuestion) {
      setDisplayedText("");
      return;
    }
    setDisplayedText("");
    let i = 0;
    const speed = isSpeaking ? 40 : 10;
    const id = setInterval(() => {
      i++;
      setDisplayedText(currentQuestion.slice(0, i));
      if (i >= currentQuestion.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [currentQuestion, isSpeaking]);

  // Push questions to copilot feed
  useEffect(() => {
    if (currentQuestion) {
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: `q-${questionNumber}-${Date.now()}`,
          type: "transcript",
          text: `Q${questionNumber}: ${currentQuestion}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [currentQuestion, questionNumber]);

  // Push feedback to copilot
  useEffect(() => {
    if (currentFeedback) {
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: `fb-${Date.now()}`,
          type: "feedback",
          text: `Score: ${currentFeedback.score}/100 — ${currentFeedback.feedback}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [currentFeedback]);

  // Push pro-tips to copilot
  useEffect(() => {
    if (proTips.length > 0) {
      const latestTip = proTips[proTips.length - 1];
      setCopilotMessages((prev) => {
        // Don't duplicate the same tip
        if (prev.some(m => m.text === latestTip)) return prev;
        return [
          ...prev,
          {
            id: `tip-${Date.now()}`,
            type: "tip",
            text: latestTip,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      });
    }
  }, [proTips]);

  // Auto-scroll copilot feed
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [copilotMessages]);

  // Avatar video handling
  useEffect(() => {
    if (avatarVideoUrl && avatarVideoRef.current) {
      setIsAvatarVideoReady(false);
      avatarVideoRef.current.load();
    }
  }, [avatarVideoUrl]);

  const handleAvatarCanPlay = () => {
    setIsAvatarVideoReady(true);
    avatarVideoRef.current?.play().catch(console.error);
  };

  const getStateLabel = () => {
    switch (interviewState) {
      case "LISTENING": return { label: "Listening to you...", color: "bg-blue-500", icon: Mic };
      case "THINKING": return { label: "AI Processing...", color: "bg-amber-500", icon: Brain };
      case "RESPONDING": return { label: "AI Speaking", color: "bg-emerald-500", icon: Zap };
      default: return { label: "Ready", color: "bg-gray-400", icon: Eye };
    }
  };

  const stateInfo = getStateLabel();
  const StateIcon = stateInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row select-none overflow-y-auto" style={{ background: "#F3F4F6", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══════════════════════ LEFT: INTERVIEW STAGE (70%) ═══════════════════════ */}
      <div className="flex-1 lg:w-[70%] flex flex-col min-h-0 p-3 lg:p-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-800 tracking-tight">AI Interview Chamber</h1>
              <p className="text-[10px] text-gray-400">Adaptive AI Interviewer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Interview State Badge */}
            <Badge className={cn(
              "text-white border-0 text-[10px] gap-1.5 px-2.5 py-0.5 shadow-sm",
              stateInfo.color
            )}>
              <StateIcon className="w-3 h-3" />
              {stateInfo.label}
            </Badge>

            <span className="text-xs text-gray-400 hidden sm:inline">
              {questionNumber}/{totalQuestions}
            </span>
            <Progress
              value={(questionNumber / totalQuestions) * 100}
              className="w-20 md:w-32 h-1.5 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-violet-500"
            />
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl min-h-[300px] lg:min-h-0">
          {/* AI Avatar */}
          <div className="absolute inset-0">
            {avatarVideoUrl && !avatarError ? (
              <video
                ref={avatarVideoRef}
                src={avatarVideoUrl}
                onCanPlay={handleAvatarCanPlay}
                onEnded={onAvatarVideoEnd}
                className="w-full h-full object-cover"
                playsInline
              />
            ) : (
              <HumanAvatar
                isSpeaking={isSpeaking}
                isLoading={isAvatarLoading || isLoading}
                emotion={emotion}
              />
            )}

            {/* Loading */}
            <AnimatePresence>
              {avatarVideoUrl && !isAvatarVideoReady && (
                <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Thinking Aura */}
            <AnimatePresence>
              {interviewState === "THINKING" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full border border-amber-400/20"
                    animate={{ rotate: 360, scale: [1, 1.06, 1] }}
                    transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                    style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.3)_100%)]" />
          </div>

          {/* ── AI Live Badge ── */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-emerald-500/90 text-white border-0 text-xs gap-1.5 px-3 py-1 shadow-lg">
              <motion.div
                className="w-2 h-2 rounded-full bg-white"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              AI Live
            </Badge>
          </div>

          {/* ── Voice Waveform (AI Speaking) ── */}
          <AnimatePresence>
            {interviewState === "RESPONDING" && isSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-10"
              >
                {waveformBars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-gradient-to-t from-blue-400/70 to-violet-400/90"
                    animate={{ height: `${h}px` }}
                    transition={{ duration: 0.08, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Listening Waveform (User Speaking) ── */}
          <AnimatePresence>
            {interviewState === "LISTENING" && isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-1.5 flex items-end overflow-hidden"
              >
                {Array.from({ length: 80 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-blue-500/50 rounded-t"
                    animate={{ height: [`${2}px`, `${3 + Math.random() * 8}px`, `${2}px`] }}
                    transition={{ duration: 0.25 + Math.random() * 0.25, repeat: Infinity, delay: i * 0.01 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Live Transcript Overlay ── */}
          {displayedText && (
            <motion.div layout className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl">
              <div className="bg-black/50 backdrop-blur-xl rounded-xl px-4 py-3">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-medium">AI Interviewer</p>
                    <p className="text-sm leading-relaxed text-white/90">
                      {displayedText}
                      {displayedText.length < (currentQuestion?.length || 0) && (
                        <motion.span className="inline-block w-[2px] h-4 bg-blue-400 ml-0.5 align-text-bottom" animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── User PiP Webcam ── */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-4 right-4">
            <div
              className={cn(
                "w-36 h-28 md:w-48 md:h-36 rounded-lg overflow-hidden relative shadow-2xl",
                "backdrop-blur-sm bg-white/10",
                isListening
                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "border-2 border-white/20"
              )}
            >
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className={cn("w-full h-full object-cover transition-opacity", isCameraOn ? "opacity-100" : "opacity-0")}
                style={{ transform: "scaleX(-1)" }}
              />

              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                  <VideoOff className="w-6 h-6 text-white/30 mb-1" />
                  <span className="text-[10px] text-white/30">Camera Off</span>
                </div>
              )}

              <FaceDetectionFeedback videoRef={userVideoRef} isActive={isCameraOn} />

              <AnimatePresence>
                {(isRecording || isListening) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-2 right-2">
                    <Badge className="bg-red-600 text-white text-[10px] gap-1 py-0 h-5 border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      REC
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-1.5 left-2">
                <span className="text-[10px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">You</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Control Bar ── */}
        <div className="flex items-center justify-center mt-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center gap-2 md:gap-3 bg-white rounded-full px-4 py-2.5 shadow-lg border border-gray-200"
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                isMuted ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                !isCameraOn ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              disabled
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <div className="w-px h-7 bg-gray-200" />

            {isRecording ? (
              <Button
                onClick={onStopRecording}
                disabled={isLoading}
                className="h-11 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm border-0 shadow-md"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline ml-1">Processing</span></>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /><span className="hidden sm:inline ml-1">Submit</span></>
                )}
              </Button>
            ) : (
              <Button
                onClick={onStartRecording}
                disabled={isLoading || isSpeaking || isAvatarLoading}
                className="h-11 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm border-0 shadow-md"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Speak</span>
              </Button>
            )}

            <button
              onClick={onSkipQuestion}
              disabled={isLoading}
              className="h-11 px-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-sm transition-all disabled:opacity-30 flex items-center gap-1"
            >
              Skip <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-7 bg-gray-200" />

            <button
              onClick={() => setShowEndModal(true)}
              className="w-11 h-11 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all shadow-md"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════ RIGHT: COPILOT SIDEBAR (30%) ═══════════════════════ */}
      <div className="lg:w-[30%] h-72 lg:h-auto bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Live Interview Feed</h2>
              <p className="text-[11px] text-gray-400">Copilot • Real-time AI assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              interviewState === "THINKING" ? "bg-amber-400 animate-pulse" :
              interviewState === "LISTENING" ? "bg-blue-400 animate-pulse" :
              interviewState === "RESPONDING" ? "bg-emerald-400 animate-pulse" :
              "bg-gray-300"
            )} />
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {interviewState === "IDLE" ? "Ready" : interviewState}
            </span>
          </div>
        </div>

        {/* Copilot Feed */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-3">
            {copilotMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl p-3 text-sm",
                  msg.type === "hint" && "bg-violet-50 border border-violet-100",
                  msg.type === "transcript" && "bg-blue-50 border border-blue-100",
                  msg.type === "feedback" && "bg-emerald-50 border border-emerald-100",
                  msg.type === "tip" && "bg-amber-50 border border-amber-100",
                  msg.type === "user" && "bg-gray-50 border border-gray-100"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {msg.type === "hint" && <Sparkles className="w-3.5 h-3.5 text-violet-500" />}
                  {msg.type === "transcript" && <MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
                  {msg.type === "feedback" && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                  {msg.type === "tip" && <Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
                  {msg.type === "user" && <User className="w-3.5 h-3.5 text-gray-400" />}
                  <span className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    msg.type === "hint" && "text-violet-500",
                    msg.type === "transcript" && "text-blue-500",
                    msg.type === "feedback" && "text-emerald-500",
                    msg.type === "tip" && "text-amber-600",
                    msg.type === "user" && "text-gray-400"
                  )}>
                    {msg.type === "hint" ? "Welcome" : msg.type === "transcript" ? "Question" : msg.type === "feedback" ? "Feedback" : msg.type === "tip" ? "Pro Tip" : "Your Answer"}
                  </span>
                  <span className="text-[10px] text-gray-300 ml-auto">{msg.time}</span>
                </div>
                <p className={cn(
                  "text-[13px] leading-relaxed",
                  msg.type === "hint" && "text-violet-700",
                  msg.type === "transcript" && "text-blue-700",
                  msg.type === "feedback" && "text-emerald-700",
                  msg.type === "tip" && "text-amber-700",
                  msg.type === "user" && "text-gray-600"
                )}>
                  {msg.text}
                </p>
              </motion.div>
            ))}

            {/* Live user transcript */}
            {userTranscript && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-3 bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Your Answer (Live)</span>
                  {isListening && (
                    <div className="flex items-center gap-0.5 ml-auto">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1 bg-blue-400 rounded-full" animate={{ height: ["3px", "10px", "3px"] }} transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{userTranscript}</p>
              </motion.div>
            )}

            <div ref={feedEndRef} />
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <div className={cn("w-2 h-2 rounded-full", isLoading || isAvatarLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
              {isLoading || isAvatarLoading ? "AI is thinking…" : "AI ready"}
            </div>
            <span className="text-[10px] text-gray-300">Q{questionNumber}/{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ END SESSION MODAL ═══════════════════════ */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-gray-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">End Interview Session?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your progress will be saved and a report will be generated based on your completed answers.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setShowEndModal(false)}>
                    Continue
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
                    onClick={() => { setShowEndModal(false); onEndInterview(); }}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
