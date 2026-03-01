import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, MessageSquare,
  Brain, Loader2, ChevronRight, TrendingUp, CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HumanAvatar } from "./HumanAvatar";
import { FaceDetectionFeedback } from "./FaceDetectionFeedback";
import { AvatarEmotion } from "./AnimatedAvatar";

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
}: VideoCallInterfaceProps) => {
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const [isAvatarVideoReady, setIsAvatarVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(24).fill(4));
  const [displayedText, setDisplayedText] = useState("");

  // Attach user stream
  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream, userVideoRef]);

  // Voice waveform animation
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setWaveformBars(
          Array.from({ length: 24 }, (_, i) => {
            const center = 12;
            const dist = Math.abs(i - center);
            const base = Math.max(4, 28 - dist * 2);
            return base + Math.random() * 18;
          })
        );
      }, 80);
      return () => clearInterval(interval);
    }
    setWaveformBars(Array(24).fill(4));
  }, [isSpeaking]);

  // Typewriter effect for live transcript
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

  return (
    <div className="fixed inset-0 bg-[hsl(222,20%,6%)] flex flex-col z-50 select-none">
      {/* ─── TOP STATUS BAR ─── */}
      <div className="h-12 flex items-center justify-between px-4 md:px-6 bg-white/[0.03] border-b border-white/[0.06] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white/90 hidden sm:inline">
            AI Interview Chamber
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0 h-5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            LIVE
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 hidden sm:inline">
            Question {questionNumber}/{totalQuestions}
          </span>
          <Progress
            value={(questionNumber / totalQuestions) * 100}
            className="w-24 md:w-36 h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-violet-500"
          />
        </div>
      </div>

      {/* ─── MAIN STAGE ─── */}
      <div className="flex-1 relative overflow-hidden">
        {/* AI Avatar - Full Cinematic View */}
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

          {/* Loading overlay */}
          <AnimatePresence>
            {avatarVideoUrl && !isAvatarVideoReady && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[hsl(222,20%,6%)] flex items-center justify-center"
              >
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Thinking Aura */}
          <AnimatePresence>
            {(isAvatarLoading || isLoading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[500px] md:h-[500px] rounded-full border border-blue-500/20"
                  animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                  transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                  style={{
                    background: "radial-gradient(circle, hsl(220 80% 60% / 0.08) 0%, transparent 70%)",
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full border border-violet-500/15"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(222,20%,6%)_100%)]" />
        </div>

        {/* ─── VOICE WAVEFORM (bottom of AI frame) ─── */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-10"
            >
              {waveformBars.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-gradient-to-t from-blue-500/60 to-violet-400/80"
                  animate={{ height: `${h}px` }}
                  transition={{ duration: 0.08, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── LIVE TRANSCRIPT OVERLAY ─── */}
        <motion.div
          layout
          className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl"
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 font-medium">
                  AI Interviewer
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/90 font-light">
                  {displayedText}
                  {displayedText.length < (currentQuestion?.length || 0) && (
                    <motion.span
                      className="inline-block w-[2px] h-4 bg-blue-400 ml-0.5 align-text-bottom"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── USER PIP FEED ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 md:bottom-36 md:top-auto md:right-6"
        >
          <div
            className={cn(
              "w-36 h-28 md:w-52 md:h-40 rounded-2xl overflow-hidden border relative",
              isListening
                ? "border-blue-500/60 shadow-[0_0_24px_hsl(220_80%_60%/0.25)]"
                : "border-white/[0.08] shadow-2xl"
            )}
          >
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isCameraOn ? "opacity-100" : "opacity-0"
              )}
              style={{ transform: "scaleX(-1)" }}
            />

            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[hsl(222,20%,10%)]">
                <VideoOff className="w-6 h-6 text-white/20 mb-1" />
                <span className="text-[10px] text-white/20">Camera Off</span>
              </div>
            )}

            <FaceDetectionFeedback videoRef={userVideoRef} isActive={isCameraOn} />

            {/* Recording indicator */}
            <AnimatePresence>
              {(isRecording || isListening) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 right-2"
                >
                  <Badge className="bg-red-600/90 text-white text-[10px] gap-1 py-0 h-5 border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    REC
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {isCameraOn && !isRecording && !isListening && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/50 backdrop-blur-sm text-emerald-400 text-[10px] py-0 h-5 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
            )}

            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] text-white/50 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                You
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── AI SPEAKING BADGE ─── */}
        <AnimatePresence>
          {(isSpeaking || isAvatarLoading) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-4 left-4"
            >
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs gap-1.5 px-3 py-1">
                {isAvatarLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Thinking…
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" />
                    Speaking
                  </>
                )}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FEEDBACK TOAST ─── */}
        <AnimatePresence>
          {currentFeedback && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="absolute top-4 right-44 md:top-6 md:right-64 w-64"
            >
              <div className="bg-black/70 backdrop-blur-xl border border-white/[0.08] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                    Feedback
                  </span>
                  <Badge
                    className={cn(
                      "text-[10px] h-5 border-0",
                      currentFeedback.score >= 70
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {currentFeedback.score}/100
                  </Badge>
                </div>
                <p className="text-xs text-white/60 mb-2 line-clamp-2">
                  {currentFeedback.feedback}
                </p>
                {currentFeedback.strengths.slice(0, 1).map((s, i) => (
                  <p key={i} className="text-[10px] text-emerald-400/80 flex items-start gap-1">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{s}</span>
                  </p>
                ))}
                {currentFeedback.improvements.slice(0, 1).map((s, i) => (
                  <p key={i} className="text-[10px] text-amber-400/80 flex items-start gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{s}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── FLOATING CONTROL DOCK ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex items-center gap-2 md:gap-3 bg-black/70 backdrop-blur-2xl border border-white/[0.08] rounded-full px-3 md:px-5 py-2.5 shadow-2xl"
        >
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
              isMuted
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
              !isCameraOn
                ? "bg-red-500/20 text-red-400"
                : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
            )}
            disabled
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-white/[0.08]" />

          {/* Record / Submit */}
          {isRecording ? (
            <Button
              onClick={onStopRecording}
              disabled={isLoading}
              className="h-11 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm border-0 shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline ml-1">Processing</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Submit</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onStartRecording}
              disabled={isLoading || isSpeaking || isAvatarLoading}
              className="h-11 px-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm border-0 shadow-lg shadow-blue-500/20"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Speak</span>
            </Button>
          )}

          {/* Skip */}
          <button
            onClick={onSkipQuestion}
            disabled={isLoading}
            className="h-11 px-4 rounded-full bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white/80 text-sm transition-all disabled:opacity-30 flex items-center gap-1"
          >
            Skip
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-white/[0.08]" />

          {/* End Session */}
          <button
            onClick={() => setShowEndModal(true)}
            className="w-11 h-11 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all duration-200"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* ─── END SESSION MODAL ─── */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[hsl(222,20%,10%)] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  End Interview Session?
                </h3>
                <p className="text-sm text-white/50 mb-6">
                  Your progress will be saved and a report will be generated
                  based on your completed answers.
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="ghost"
                    className="flex-1 h-11 rounded-xl bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white border-0"
                    onClick={() => setShowEndModal(false)}
                  >
                    Continue
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0"
                    onClick={() => {
                      setShowEndModal(false);
                      onEndInterview();
                    }}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── USER TRANSCRIPT SIDEBAR (Desktop) ─── */}
      <div className="hidden lg:block absolute top-12 right-0 bottom-0 w-72 bg-black/40 backdrop-blur-xl border-l border-white/[0.06]">
        <div className="p-4 border-b border-white/[0.06]">
          <h4 className="text-xs uppercase tracking-widest text-white/30 font-medium flex items-center gap-2">
            <Mic className="w-3.5 h-3.5" />
            Your Response
          </h4>
        </div>
        <ScrollArea className="h-[calc(100%-48px)] p-4">
          {isListening && (
            <div className="flex items-center gap-1 mb-3 h-4">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-400 rounded-full"
                  animate={{ height: [`${4}px`, `${8 + Math.random() * 12}px`, `${4}px`] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
              <span className="text-[10px] text-blue-400 ml-2">Listening…</span>
            </div>
          )}
          <p
            className={cn(
              "text-sm leading-relaxed",
              userTranscript ? "text-white/80" : "text-white/20 italic"
            )}
          >
            {userTranscript || "Start speaking to see your response here…"}
          </p>
        </ScrollArea>
      </div>
    </div>
  );
};
