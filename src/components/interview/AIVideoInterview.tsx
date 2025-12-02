import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Play,
  Square,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  Brain,
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useBrowserTTS } from "@/hooks/useBrowserTTS";
import { InterviewAvatar } from "./InterviewAvatar";

interface InterviewResponse {
  question: string;
  answer: string;
  feedback?: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

interface FinalReport {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface AIVideoInterviewProps {
  interviewType?: "behavioral" | "technical" | "coding";
  totalQuestions?: number;
  onComplete?: (report: FinalReport) => void;
}

export const AIVideoInterview = ({
  interviewType = "behavioral",
  totalQuestions = 5,
  onComplete,
}: AIVideoInterviewProps) => {
  // Interview state
  const [phase, setPhase] = useState<"setup" | "interview" | "processing" | "complete">("setup");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Avatar state
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Media state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");

  // Refs
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const previousQuestionsRef = useRef<string[]>([]);

  // Speech recognition
  const { 
    transcript, 
    isListening, 
    isSupported: isSpeechSupported,
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition({
    onResult: (text) => setUserTranscript(text),
  });

  // Text-to-speech (browser)
  const { 
    speak, 
    stop: stopSpeaking, 
    isSpeaking,
    isSupported: isTTSSupported 
  } = useBrowserTTS({
    rate: 0.95,
    onEnd: () => {
      // Auto-start listening after AI finishes speaking
      if (phase === "interview" && !isRecording) {
        startRecording();
      }
    },
  });

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: true,
      });
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      toast.success("Camera ready");
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(track => track.stop());
      userStreamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Generate avatar video with D-ID
  const generateAvatarVideo = async (text: string): Promise<string | null> => {
    setIsAvatarLoading(true);
    setAvatarError(null);

    try {
      // Create talk
      const { data: createData, error: createError } = await supabase.functions.invoke("did-avatar", {
        body: { type: "create_talk", text },
      });

      if (createError || createData?.error) {
        throw new Error(createData?.error || createError?.message || "Failed to create avatar");
      }

      const talkId = createData.talkId;
      console.log("Avatar talk created:", talkId);

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: statusData, error: statusError } = await supabase.functions.invoke("did-avatar", {
          body: { type: "get_talk_status", talkId },
        });

        if (statusError || statusData?.error) {
          throw new Error(statusData?.error || statusError?.message);
        }

        console.log("Avatar status:", statusData.status);

        if (statusData.status === "done" && statusData.resultUrl) {
          setIsAvatarLoading(false);
          return statusData.resultUrl;
        }

        if (statusData.status === "error") {
          throw new Error("Avatar generation failed");
        }

        attempts++;
      }

      throw new Error("Avatar generation timed out");
    } catch (error) {
      console.error("Avatar error:", error);
      setAvatarError(error instanceof Error ? error.message : "Avatar generation failed");
      setIsAvatarLoading(false);
      return null;
    }
  };

  // Generate question with AI
  const generateQuestion = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("ai-interview", {
      body: {
        type: "generate_question",
        context: {
          questionNumber: questionNumber + 1,
          totalQuestions,
          previousQuestions: previousQuestionsRef.current,
          interviewType,
        },
      },
    });

    if (error || data?.error) {
      throw new Error(data?.error || error?.message || "Failed to generate question");
    }

    return data.content;
  };

  // Analyze user response
  const analyzeResponse = async (question: string, answer: string) => {
    const { data, error } = await supabase.functions.invoke("ai-interview", {
      body: {
        type: "analyze_response",
        question,
        userResponse: answer,
      },
    });

    if (error || data?.error) {
      console.error("Analysis error:", data?.error || error);
      return null;
    }

    return data;
  };

  // Generate final report
  const generateFinalReport = async () => {
    setPhase("processing");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: {
          type: "generate_feedback",
          allResponses: responses,
        },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message);
      }

      setFinalReport(data);
      setPhase("complete");
      onComplete?.(data);
    } catch (error) {
      console.error("Report error:", error);
      toast.error("Failed to generate report");
      setPhase("interview");
    } finally {
      setIsLoading(false);
    }
  };

  // Start interview
  const startInterview = async () => {
    if (!isCameraOn) {
      toast.error("Please turn on your camera first");
      return;
    }

    setIsLoading(true);
    setPhase("interview");
    setQuestionNumber(1);

    try {
      const question = await generateQuestion();
      setCurrentQuestion(question);
      previousQuestionsRef.current.push(question);

      // Try D-ID avatar first, fallback to browser TTS
      const videoUrl = await generateAvatarVideo(question);
      if (videoUrl) {
        setAvatarVideoUrl(videoUrl);
      } else {
        // Fallback to browser TTS
        speak(question);
      }
    } catch (error) {
      console.error("Start error:", error);
      toast.error("Failed to start interview");
      setPhase("setup");
    } finally {
      setIsLoading(false);
    }
  };

  // Start recording user response
  const startRecording = () => {
    if (!isSpeechSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    setIsRecording(true);
    resetTranscript();
    setUserTranscript("");
    startListening();
    toast.info("Recording... Speak your answer");
  };

  // Stop recording and process response
  const stopRecording = async () => {
    stopListening();
    setIsRecording(false);

    const answer = userTranscript || transcript;
    if (!answer.trim()) {
      toast.warning("No response detected. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Analyze the response
      const feedback = await analyzeResponse(currentQuestion, answer);

      // Save response
      const newResponse: InterviewResponse = {
        question: currentQuestion,
        answer,
        feedback,
      };
      setResponses(prev => [...prev, newResponse]);

      // Show brief feedback
      if (feedback?.feedback) {
        toast.success(feedback.feedback, { duration: 4000 });
      }

      // Move to next question or finish
      if (questionNumber >= totalQuestions) {
        await generateFinalReport();
      } else {
        // Generate next question
        setQuestionNumber(prev => prev + 1);
        const nextQuestion = await generateQuestion();
        setCurrentQuestion(nextQuestion);
        previousQuestionsRef.current.push(nextQuestion);

        // Generate avatar for next question
        const videoUrl = await generateAvatarVideo(nextQuestion);
        if (videoUrl) {
          setAvatarVideoUrl(videoUrl);
        } else {
          speak(nextQuestion);
        }
      }
    } catch (error) {
      console.error("Process error:", error);
      toast.error("Failed to process response");
    } finally {
      setIsLoading(false);
      resetTranscript();
      setUserTranscript("");
    }
  };

  // Skip current question
  const skipQuestion = () => {
    stopListening();
    setIsRecording(false);
    
    const newResponse: InterviewResponse = {
      question: currentQuestion,
      answer: "[Skipped]",
    };
    setResponses(prev => [...prev, newResponse]);

    if (questionNumber >= totalQuestions) {
      generateFinalReport();
    } else {
      setQuestionNumber(prev => prev + 1);
      generateQuestion().then(q => {
        setCurrentQuestion(q);
        previousQuestionsRef.current.push(q);
        speak(q);
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopListening();
      stopSpeaking();
    };
  }, []);

  // Render setup phase
  if (phase === "setup") {
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Video Interview</h2>
            <p className="text-muted-foreground">
              Practice your {interviewType} interview skills with our AI interviewer.
              You'll answer {totalQuestions} questions with real-time feedback.
            </p>
          </div>

          {/* Camera preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant={isCameraOn ? "destructive" : "outline"}
              onClick={isCameraOn ? stopCamera : startCamera}
            >
              {isCameraOn ? <VideoOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </Button>
          </div>

          {/* Browser support warnings */}
          {!isSpeechSupported && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Speech recognition not supported. Please use Chrome or Edge.</span>
            </div>
          )}

          {/* Start button */}
          <Button
            size="lg"
            onClick={startInterview}
            disabled={!isCameraOn || isLoading}
            className="w-full max-w-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  // Render interview phase
  if (phase === "interview") {
    return (
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Question {questionNumber} of {totalQuestions}</span>
          <Progress value={(questionNumber / totalQuestions) * 100} className="flex-1" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Avatar */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
              <InterviewAvatar
                videoUrl={avatarVideoUrl}
                isLoading={isAvatarLoading}
                isSpeaking={isSpeaking}
                error={avatarError}
                onVideoEnd={() => {
                  if (!isRecording) {
                    startRecording();
                  }
                }}
              />
              
              {/* Speaking indicator */}
              {(isSpeaking || isAvatarLoading) && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">
                    {isAvatarLoading ? "Preparing..." : "AI Speaking"}
                  </span>
                </div>
              )}
            </div>
            
            {/* Current question */}
            <div className="p-4">
              <p className="text-lg font-medium">{currentQuestion}</p>
            </div>
          </Card>

          {/* User camera */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}

              {/* Listening indicator */}
              {isListening && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
              )}
            </div>

            {/* User transcript */}
            <div className="p-4 min-h-[100px]">
              <p className="text-sm text-muted-foreground mb-1">Your response:</p>
              <p className="text-sm">{userTranscript || transcript || "Start speaking to see your response here..."}</p>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Submit Answer
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={startRecording}
                  disabled={isLoading || isSpeaking || isAvatarLoading}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Speaking
                </Button>
              )}

              <Button
                variant="outline"
                onClick={skipQuestion}
                disabled={isLoading}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render processing phase
  if (phase === "processing") {
    return (
      <Card className="p-8 max-w-xl mx-auto">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Performance</h2>
            <p className="text-muted-foreground">
              Our AI is reviewing your responses and generating a detailed feedback report...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Render complete phase
  if (phase === "complete" && finalReport) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
            <p className="text-muted-foreground">{finalReport.summary}</p>
          </div>

          {/* Score cards */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <Award className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold text-primary">{finalReport.overallScore}</p>
              <p className="text-sm text-muted-foreground">Overall</p>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{finalReport.communicationScore}</p>
              <p className="text-sm text-muted-foreground">Communication</p>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{finalReport.confidenceScore}</p>
              <p className="text-sm text-muted-foreground">Confidence</p>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{finalReport.technicalScore}</p>
              <p className="text-sm text-muted-foreground">Technical</p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {finalReport.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {finalReport.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {finalReport.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">{i + 1}</Badge>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Response details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Your Responses</h3>
          <div className="space-y-4">
            {responses.map((r, i) => (
              <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                <p className="font-medium text-sm text-primary mb-1">Q{i + 1}: {r.question}</p>
                <p className="text-sm text-muted-foreground mb-2">{r.answer}</p>
                {r.feedback && (
                  <div className="flex items-center gap-2">
                    <Badge variant={r.feedback.score >= 70 ? "default" : "secondary"}>
                      Score: {r.feedback.score}/100
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => {
            setPhase("setup");
            setResponses([]);
            setQuestionNumber(0);
            setFinalReport(null);
            previousQuestionsRef.current = [];
          }}>
            <Play className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
