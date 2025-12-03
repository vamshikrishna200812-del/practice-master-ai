import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useBrowserTTS } from "@/hooks/useBrowserTTS";
import { VideoCallInterface } from "./VideoCallInterface";
import { InterviewSetup } from "./InterviewSetup";
import { InterviewReport } from "./InterviewReport";
import { InterviewProcessing } from "./InterviewProcessing";

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
  const [currentFeedback, setCurrentFeedback] = useState<InterviewResponse["feedback"] | null>(null);

  // Avatar state
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Media state
  const [isCameraOn, setIsCameraOn] = useState(false);
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
      if (phase === "interview" && !isRecording && !isLoading) {
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
      stopCamera();
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
    toast.info("Listening... Speak your answer", { duration: 2000 });
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
      setCurrentFeedback(feedback);

      // Show brief feedback
      if (feedback?.feedback) {
        toast.success(`Score: ${feedback.score}/100`, { duration: 3000 });
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

        // Reset user transcript
        resetTranscript();
        setUserTranscript("");

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
    }
  };

  // Skip current question
  const skipQuestion = async () => {
    stopListening();
    setIsRecording(false);
    
    const newResponse: InterviewResponse = {
      question: currentQuestion,
      answer: "[Skipped]",
    };
    setResponses(prev => [...prev, newResponse]);

    if (questionNumber >= totalQuestions) {
      await generateFinalReport();
    } else {
      setIsLoading(true);
      setQuestionNumber(prev => prev + 1);
      
      try {
        const nextQuestion = await generateQuestion();
        setCurrentQuestion(nextQuestion);
        previousQuestionsRef.current.push(nextQuestion);
        
        resetTranscript();
        setUserTranscript("");
        
        const videoUrl = await generateAvatarVideo(nextQuestion);
        if (videoUrl) {
          setAvatarVideoUrl(videoUrl);
        } else {
          speak(nextQuestion);
        }
      } catch (error) {
        console.error("Skip error:", error);
        toast.error("Failed to load next question");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // End interview early
  const endInterview = () => {
    if (responses.length > 0) {
      generateFinalReport();
    } else {
      stopCamera();
      stopSpeaking();
      setPhase("setup");
    }
  };

  // Handle avatar video end
  const handleAvatarVideoEnd = () => {
    if (!isRecording && !isLoading && phase === "interview") {
      startRecording();
    }
  };

  // Reset interview
  const resetInterview = () => {
    setPhase("setup");
    setResponses([]);
    setQuestionNumber(0);
    setFinalReport(null);
    setCurrentFeedback(null);
    setCurrentQuestion("");
    setUserTranscript("");
    setAvatarVideoUrl(null);
    previousQuestionsRef.current = [];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopListening();
      stopSpeaking();
    };
  }, []);

  // Render based on phase
  if (phase === "setup") {
    return (
      <InterviewSetup
        interviewType={interviewType}
        totalQuestions={totalQuestions}
        isCameraOn={isCameraOn}
        isSpeechSupported={isSpeechSupported}
        isLoading={isLoading}
        userVideoRef={userVideoRef}
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        onStartInterview={startInterview}
      />
    );
  }

  if (phase === "interview") {
    return (
      <VideoCallInterface
        avatarVideoUrl={avatarVideoUrl}
        isAvatarLoading={isAvatarLoading}
        isSpeaking={isSpeaking}
        avatarError={avatarError}
        onAvatarVideoEnd={handleAvatarVideoEnd}
        currentQuestion={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        userTranscript={userTranscript || transcript}
        isRecording={isRecording}
        isListening={isListening}
        isLoading={isLoading}
        currentFeedback={currentFeedback}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onSkipQuestion={skipQuestion}
        onEndInterview={endInterview}
        userVideoRef={userVideoRef}
        isCameraOn={isCameraOn}
      />
    );
  }

  if (phase === "processing") {
    return <InterviewProcessing />;
  }

  if (phase === "complete" && finalReport) {
    return (
      <InterviewReport
        report={finalReport}
        responses={responses}
        interviewType={interviewType}
        onPracticeAgain={resetInterview}
      />
    );
  }

  return null;
};
