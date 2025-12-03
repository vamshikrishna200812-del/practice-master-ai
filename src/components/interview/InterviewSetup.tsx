import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Video, 
  VideoOff, 
  Mic, 
  Play, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InterviewSetupProps {
  interviewType: "behavioral" | "technical" | "coding";
  totalQuestions: number;
  isCameraOn: boolean;
  isSpeechSupported: boolean;
  isLoading: boolean;
  userVideoRef: React.RefObject<HTMLVideoElement>;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onStartInterview: () => void;
}

export const InterviewSetup = ({
  interviewType,
  totalQuestions,
  isCameraOn,
  isSpeechSupported,
  isLoading,
  userVideoRef,
  onStartCamera,
  onStopCamera,
  onStartInterview,
}: InterviewSetupProps) => {
  const [step, setStep] = useState<"intro" | "setup">("intro");

  const interviewTypeConfig = {
    behavioral: {
      title: "Behavioral Interview",
      description: "Practice situational and behavioral questions using the STAR method",
      icon: "💬",
      color: "from-blue-500 to-blue-600"
    },
    technical: {
      title: "Technical Interview",
      description: "Answer technical questions about concepts, architecture, and problem-solving",
      icon: "🧠",
      color: "from-purple-500 to-purple-600"
    },
    coding: {
      title: "Coding Interview",
      description: "Solve coding problems and explain your approach",
      icon: "💻",
      color: "from-green-500 to-green-600"
    }
  };

  const config = interviewTypeConfig[interviewType];

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 border-2 border-border/50 shadow-xl">
            <div className="text-center space-y-6">
              {/* Header */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className={cn(
                  "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4",
                  "bg-gradient-to-br", config.color,
                  "text-4xl shadow-lg"
                )}>
                  {config.icon}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{config.title}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">{config.description}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 py-6"
              >
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">AI Interviewer</p>
                    <p className="text-xs text-muted-foreground">Natural conversation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Voice Response</p>
                    <p className="text-xs text-muted-foreground">Speech-to-text</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Video Call Style</p>
                    <p className="text-xs text-muted-foreground">Zoom-like interface</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Instant Feedback</p>
                    <p className="text-xs text-muted-foreground">Real-time scoring</p>
                  </div>
                </div>
              </motion.div>

              {/* Session Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                <Badge variant="secondary" className="px-3 py-1">
                  {totalQuestions} Questions
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  ~{totalQuestions * 3} Minutes
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Automatic Flow
                </Badge>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={() => setStep("setup")}
                  className="w-full max-w-xs h-12 text-base font-medium"
                >
                  Setup Camera & Mic
                  <Video className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <Card className="p-8 border-2 border-border/50 shadow-xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Setup Your Camera</h2>
              <p className="text-muted-foreground">
                Make sure your camera and microphone are working before we begin
              </p>
            </div>

            {/* Camera Preview */}
            <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border-2 border-border">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10"
                    >
                      <VideoOff className="w-10 h-10 text-muted-foreground" />
                    </motion.div>
                    <p className="text-muted-foreground">Camera is off</p>
                  </div>
                </div>
              )}

              {isCameraOn && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Camera Ready
                  </Badge>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isCameraOn ? "destructive" : "outline"}
                size="lg"
                onClick={isCameraOn ? onStopCamera : onStartCamera}
                className="w-40"
              >
                {isCameraOn ? (
                  <>
                    <VideoOff className="w-4 h-4 mr-2" />
                    Turn Off
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Turn On
                  </>
                )}
              </Button>
            </div>

            {/* Warnings */}
            {!isSpeechSupported && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Speech recognition is not supported in this browser. Please use Chrome or Edge for the best experience.
                </p>
              </div>
            )}

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-3">
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                isCameraOn ? "bg-green-500/10 border-green-500/30" : "bg-muted border-border"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  isCameraOn ? "bg-green-500" : "bg-muted-foreground/20"
                )}>
                  {isCameraOn ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Video className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isCameraOn ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                )}>
                  Camera Connected
                </span>
              </div>

              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                isSpeechSupported ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  isSpeechSupported ? "bg-green-500" : "bg-amber-500"
                )}>
                  {isSpeechSupported ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isSpeechSupported ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  Speech Recognition
                </span>
              </div>
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              onClick={onStartInterview}
              disabled={!isCameraOn || isLoading}
              className="w-full h-14 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Interview
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
