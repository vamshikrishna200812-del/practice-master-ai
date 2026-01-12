import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  PhoneOff,
  Volume2,
  MessageSquare,
  Brain,
  Loader2,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Settings,
  Maximize2,
  BarChart3
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
  // AI Avatar
  avatarVideoUrl: string | null;
  isAvatarLoading: boolean;
  isSpeaking: boolean;
  avatarError: string | null;
  onAvatarVideoEnd: () => void;
  
  // Question
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  
  // User
  userTranscript: string;
  isRecording: boolean;
  isListening: boolean;
  isLoading: boolean;
  
  // Feedback
  currentFeedback: FeedbackData | null;
  
  // Actions
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSkipQuestion: () => void;
  onEndInterview: () => void;
  
  // Camera ref
  userVideoRef: React.RefObject<HTMLVideoElement>;
  userStream: MediaStream | null;
  isCameraOn: boolean;
  
  // Avatar emotion
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
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(true);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);

  // Re-attach stream when component mounts
  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream, userVideoRef]);

  // Generate waveform animation when speaking
  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setAudioWaveform(Array.from({ length: 5 }, () => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    }
    setAudioWaveform([20, 20, 20, 20, 20]);
  }, [isSpeaking, isListening]);

  // Handle avatar video
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
    <div className="fixed inset-0 bg-[hsl(220_25%_8%)] flex flex-col z-50">
      {/* Top Bar */}
      <div className="h-14 bg-[hsl(220_25%_10%)] border-b border-[hsl(220_25%_18%)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">AI Interview</span>
          </div>
          <Badge variant="outline" className="border-green-500 text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Live Session
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Question {questionNumber} of {totalQuestions}</span>
          </div>
          <Progress 
            value={(questionNumber / totalQuestions) * 100} 
            className="w-32 h-2"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* AI Interviewer - Main Stage */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(220_25%_12%)] to-[hsl(220_25%_8%)] border border-[hsl(220_25%_18%)]">
            {/* Avatar Video or Animated Avatar */}
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

            {/* Loading Overlay */}
            <AnimatePresence>
              {avatarVideoUrl && !isAvatarVideoReady && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[hsl(220_25%_8%)] flex items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Speaker Badge */}
            <AnimatePresence>
              {(isSpeaking || isAvatarLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4"
                >
                  <Badge className="bg-primary/90 text-primary-foreground gap-2">
                    <Volume2 className="w-3.5 h-3.5" />
                    {isAvatarLoading ? "Thinking..." : "AI Speaking"}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name Badge */}
            <div className="absolute bottom-4 right-4">
              <Badge variant="secondary" className="bg-[hsl(220_25%_15%)] text-foreground">
                AI Interviewer
              </Badge>
            </div>
          </div>

          {/* Subtitles / Question Display */}
          <motion.div 
            layout
            className="bg-[hsl(220_25%_10%)] rounded-xl p-4 border border-[hsl(220_25%_18%)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Current Question</p>
                <p className="text-foreground leading-relaxed">{currentQuestion}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-[hsl(220_25%_18%)] flex flex-col bg-[hsl(220_25%_10%)]">
          {/* User Camera Preview - Enhanced */}
          <div className="p-4 border-b border-[hsl(220_25%_18%)]">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[hsl(220_25%_8%)] ring-2 ring-primary/30 shadow-lg shadow-primary/10">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(220_25%_15%)] to-[hsl(220_25%_8%)]">
                  <div className="w-16 h-16 rounded-full bg-[hsl(220_25%_20%)] flex items-center justify-center mb-2">
                    <VideoOff className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Camera Off</span>
                </div>
              )}

              {/* Face Detection Feedback */}
              <FaceDetectionFeedback 
                videoRef={userVideoRef} 
                isActive={isCameraOn} 
              />

              {/* Recording/Listening Indicator */}
              <AnimatePresence>
                {(isRecording || isListening) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 right-2"
                  >
                    <Badge className="bg-red-600 text-white gap-1.5 animate-pulse shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      {isListening ? "Listening..." : "Recording"}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live indicator when camera is on */}
              {isCameraOn && !isRecording && !isListening && (
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs bg-black/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              )}

              {/* User Name Badge */}
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-foreground text-xs border border-white/10">
                  You
                </Badge>
              </div>
            </div>
          </div>

          {/* User Transcript */}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Your Response
              </h4>
              {isListening && (
                <div className="flex items-center gap-1 h-4">
                  {audioWaveform.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-green-500 rounded-full"
                      animate={{ height: `${Math.max(4, height * 0.16)}px` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <p className={cn(
                "text-sm leading-relaxed",
                userTranscript ? "text-foreground" : "text-muted-foreground italic"
              )}>
                {userTranscript || "Start speaking to see your response here..."}
              </p>
            </ScrollArea>
          </div>

          {/* Feedback Panel */}
          {showFeedbackPanel && currentFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-[hsl(220_25%_18%)] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Last Response Feedback
                </h4>
                <Badge 
                  variant={currentFeedback.score >= 70 ? "default" : "secondary"}
                  className={currentFeedback.score >= 70 ? "bg-green-600" : ""}
                >
                  {currentFeedback.score}/100
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">{currentFeedback.feedback}</p>
              
              {currentFeedback.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-green-500 mb-1">Strengths</p>
                  <div className="space-y-0.5">
                    {currentFeedback.strengths.slice(0, 2).map((s, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {currentFeedback.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-500 mb-1">To Improve</p>
                  <div className="space-y-0.5">
                    {currentFeedback.improvements.slice(0, 2).map((s, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <TrendingUp className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="h-20 bg-[hsl(220_25%_10%)] border-t border-[hsl(220_25%_18%)] flex items-center justify-center gap-3 px-4">
        {/* Mute Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            isMuted 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-[hsl(220_25%_18%)] hover:bg-[hsl(220_25%_22%)] text-foreground"
          )}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Camera Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            !isCameraOn 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-[hsl(220_25%_18%)] hover:bg-[hsl(220_25%_22%)] text-foreground"
          )}
          disabled
        >
          {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        {/* Record/Submit Answer Button */}
        {isRecording ? (
          <Button
            onClick={onStopRecording}
            disabled={isLoading}
            className="h-12 px-6 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Answer
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onStartRecording}
            disabled={isLoading || isSpeaking || isAvatarLoading}
            className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Speaking
          </Button>
        )}

        {/* Skip Button */}
        <Button
          variant="ghost"
          onClick={onSkipQuestion}
          disabled={isLoading}
          className="h-12 px-4 rounded-full bg-[hsl(220_25%_18%)] hover:bg-[hsl(220_25%_22%)] text-foreground"
        >
          Skip
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Toggle Feedback Panel */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full",
            showFeedbackPanel 
              ? "bg-primary/20 text-primary" 
              : "bg-[hsl(220_25%_18%)] hover:bg-[hsl(220_25%_22%)] text-foreground"
          )}
          onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
        >
          <BarChart3 className="w-5 h-5" />
        </Button>

        {/* End Interview Button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white ml-4"
          onClick={onEndInterview}
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
