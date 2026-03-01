import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useBrowserTTS } from "@/hooks/useBrowserTTS";
import { useUserProgress } from "@/hooks/useUserProgress";
import { VideoCallInterface } from "./VideoCallInterface";
import { InterviewSetup } from "./InterviewSetup";
import { InterviewReport } from "./InterviewReport";
import { InterviewProcessing } from "./InterviewProcessing";
import { ResumeJDSetup } from "./ResumeJDSetup";
import { parseEmotionTags, AvatarEmotion } from "./AnimatedAvatar";

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
  problemSolvingScore?: number;
  cultureFitScore?: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  sentiment?: { positive: number; neutral: number; hesitant: number };
  confidenceTimeline?: number[];
  betterAnswers?: string[];
  badges?: { name: string; icon: string; description: string }[];
}

interface PersonalizationData {
  resumeText?: string;
  jobDescription?: string;
  customQuestions?: string[];
}

export type InterviewState = "LISTENING" | "THINKING" | "RESPONDING" | "IDLE";

interface AIVideoInterviewProps {
  interviewType?: "behavioral" | "technical" | "coding";
  totalQuestions?: number;
  recruiterMode?: boolean;
  company?: string;
  personality?: string;
  onComplete?: (report: FinalReport) => void;
}

export const AIVideoInterview = ({
  interviewType = "behavioral",
  totalQuestions = 5,
  recruiterMode = false,
  company,
  personality,
  onComplete,
}: AIVideoInterviewProps) => {
  // Interview state
  const [phase, setPhase] = useState<"personalization" | "setup" | "interview" | "processing" | "complete">("personalization");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [displayQuestion, setDisplayQuestion] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>("neutral");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<InterviewResponse["feedback"] | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>("IDLE");
  const [followUpCount, setFollowUpCount] = useState(0); // track follow-ups per question
  
  // Personalization state
  const [personalization, setPersonalization] = useState<PersonalizationData>({});
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Avatar state
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Media state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");

  // Pro-tips feed
  const [proTips, setProTips] = useState<string[]>([]);

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

  // User progress tracking
  const { updateProgress } = useUserProgress();

  // Text-to-speech (browser)
  const { 
    speak, 
    stop: stopSpeaking, 
    isSpeaking,
    isSupported: isTTSSupported 
  } = useBrowserTTS({
    rate: 0.95,
    onEnd: () => {
      setInterviewState("LISTENING");
      if (phase === "interview" && !isRecording && !isLoading) {
        startRecording();
      }
    },
  });

  // Sync interviewState with speaking
  useEffect(() => {
    if (isSpeaking) setInterviewState("RESPONDING");
  }, [isSpeaking]);

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

  const generateAvatarVideo = async (text: string): Promise<string | null> => {
    console.log("Using browser TTS for speech");
    setIsAvatarLoading(false);
    return null;
  };

  // Generate question with AI
  const generateQuestion = async (): Promise<string> => {
    if (customQuestions.length > 0 && questionNumber <= customQuestions.length) {
      return customQuestions[questionNumber - 1] || customQuestions[0];
    }
    
    const { data, error } = await supabase.functions.invoke("ai-interview", {
      body: {
        type: "generate_question",
        context: {
          questionNumber: questionNumber + 1,
          totalQuestions,
          previousQuestions: previousQuestionsRef.current,
          interviewType,
          resumeText: personalization.resumeText,
          jobDescription: personalization.jobDescription,
          recruiterMode,
          company,
          personality,
        },
      },
    });

    if (error || data?.error) {
      throw new Error(data?.error || error?.message || "Failed to generate question");
    }

    return data.content;
  };

  // Generate adaptive follow-up when answer is short/vague
  const generateFollowUp = async (question: string, answer: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("ai-interview", {
      body: {
        type: "generate_question",
        context: {
          questionNumber,
          totalQuestions,
          previousQuestions: previousQuestionsRef.current,
          interviewType,
          resumeText: personalization.resumeText,
          jobDescription: personalization.jobDescription,
          recruiterMode,
          company,
          personality,
          isFollowUp: true,
          previousAnswer: answer,
          previousQuestion: question,
        },
      },
    });

    if (error || data?.error) {
      // Fallback generic follow-up
      return "[thoughtful pause] That's a good start. Could you give me a specific example of when you handled that? I'd love to hear more details about the situation and the outcome.";
    }

    return data.content;
  };

  // Determine if answer needs follow-up (adaptive branching)
  const needsFollowUp = (answer: string): boolean => {
    if (followUpCount >= 2) return false; // max 2 follow-ups per question
    const wordCount = answer.trim().split(/\s+/).length;
    if (wordCount < 20) return true;
    // Check for vague indicators
    const vaguePatterns = /^(i don'?t know|not sure|maybe|i guess|um|uh|i think so|yes|no|ok|okay)$/i;
    if (vaguePatterns.test(answer.trim())) return true;
    return false;
  };

  // Generate a pro-tip based on current question
  const generateProTip = (question: string): string => {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes("tell me about yourself") || lowerQ.includes("your journey")) {
      return "💡 Pro Tip: Use the Present-Past-Future formula. Start with your current role, then highlight key past experiences, and end with why you're excited about this opportunity.";
    }
    if (lowerQ.includes("challenge") || lowerQ.includes("obstacle") || lowerQ.includes("difficult")) {
      return "💡 Pro Tip: Use the STAR method (Situation, Task, Action, Result). Focus on what YOU did, not the team. Quantify your impact if possible.";
    }
    if (lowerQ.includes("leadership") || lowerQ.includes("lead") || lowerQ.includes("manage")) {
      return "💡 Pro Tip: Highlight your leadership style with a concrete example. Show how you motivated others and what the measurable outcome was.";
    }
    if (lowerQ.includes("weakness") || lowerQ.includes("improve")) {
      return "💡 Pro Tip: Choose a genuine weakness, show self-awareness, and emphasize the concrete steps you're taking to improve.";
    }
    if (lowerQ.includes("why") && (lowerQ.includes("company") || lowerQ.includes("role") || lowerQ.includes("here"))) {
      return "💡 Pro Tip: Show you've done your research. Connect your skills and passions to the company's mission and the role's responsibilities.";
    }
    if (lowerQ.includes("conflict") || lowerQ.includes("disagree")) {
      return "💡 Pro Tip: Focus on the resolution, not the drama. Show empathy, active listening, and how you found common ground.";
    }
    if (lowerQ.includes("technical") || lowerQ.includes("system") || lowerQ.includes("design") || lowerQ.includes("architecture")) {
      return "💡 Pro Tip: Think out loud. Interviewers value your reasoning process. Start with requirements, then discuss trade-offs.";
    }
    return "💡 Pro Tip: Be specific and concise. Use examples from real experience. Numbers and outcomes make your answers memorable.";
  };

  // Handle personalization complete
  const handlePersonalizationComplete = async (data: PersonalizationData) => {
    setPersonalization(data);
    
    if (data.resumeText || data.jobDescription) {
      setIsGeneratingQuestions(true);
      toast.info("Generating personalized questions...");
      
      try {
        const { data: questionsData, error } = await supabase.functions.invoke("parse-resume", {
          body: {
            type: "generate_questions",
            resumeText: data.resumeText,
            jobDescription: data.jobDescription,
            interviewType,
            questionCount: totalQuestions,
          },
        });

        if (error || questionsData?.error) {
          console.error("Questions generation error:", error || questionsData?.error);
          toast.warning("Using default questions instead");
        } else if (questionsData?.questions?.length > 0) {
          setCustomQuestions(questionsData.questions);
          toast.success(`Generated ${questionsData.questions.length} personalized questions!`);
        }
      } catch (error) {
        console.error("Error generating questions:", error);
        toast.warning("Using default questions instead");
      } finally {
        setIsGeneratingQuestions(false);
      }
    }
    
    setPhase("setup");
  };

  const handleSkipPersonalization = () => {
    setPhase("setup");
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
      
      await updateProgress({
        communicationScore: data.communicationScore || 0,
        confidenceScore: data.confidenceScore || 0,
        technicalScore: data.technicalScore || 0,
        interviewType,
      });
      
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

  const processQuestionWithEmotion = (rawQuestion: string) => {
    const { cleanText, emotion } = parseEmotionTags(rawQuestion);
    setCurrentQuestion(rawQuestion);
    setDisplayQuestion(cleanText);
    setCurrentEmotion(emotion);
    return cleanText;
  };

  // Start interview
  const startInterview = async () => {
    if (!isCameraOn) {
      toast.error("Please turn on your camera first");
      return;
    }

    setIsLoading(true);
    setInterviewState("THINKING");
    setCurrentEmotion("thinking");
    setPhase("interview");
    setQuestionNumber(1);
    setFollowUpCount(0);

    try {
      const question = await generateQuestion();
      const cleanQuestion = processQuestionWithEmotion(question);
      previousQuestionsRef.current.push(question);

      // Add pro-tip
      setProTips(prev => [...prev, generateProTip(cleanQuestion)]);

      setInterviewState("RESPONDING");
      const videoUrl = await generateAvatarVideo(cleanQuestion);
      if (videoUrl) {
        setAvatarVideoUrl(videoUrl);
      } else {
        speak(cleanQuestion);
      }
    } catch (error) {
      console.error("Start error:", error);
      toast.error("Failed to start interview");
      setPhase("setup");
      setCurrentEmotion("neutral");
      setInterviewState("IDLE");
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
    setInterviewState("LISTENING");
    resetTranscript();
    setUserTranscript("");
    startListening();
    toast.info("Listening... Speak your answer", { duration: 2000 });
  };

  // Stop recording and process with adaptive branching
  const stopRecording = async () => {
    stopListening();
    setIsRecording(false);

    const answer = userTranscript || transcript;
    if (!answer.trim()) {
      toast.warning("No response detected. Please try again.");
      setInterviewState("LISTENING");
      return;
    }

    setIsLoading(true);
    setInterviewState("THINKING");
    setCurrentEmotion("thinking");

    try {
      // Check if answer needs a follow-up (adaptive branching)
      if (needsFollowUp(answer)) {
        setFollowUpCount(prev => prev + 1);
        
        // Generate probing follow-up
        const followUp = await generateFollowUp(currentQuestion, answer);
        const cleanFollowUp = processQuestionWithEmotion(followUp);
        
        // Add a tip about elaborating
        setProTips(prev => [...prev, "💡 Tip: Try to elaborate more. Use specific examples and quantify your impact when possible."]);

        setInterviewState("RESPONDING");
        resetTranscript();
        setUserTranscript("");

        const videoUrl = await generateAvatarVideo(cleanFollowUp);
        if (videoUrl) {
          setAvatarVideoUrl(videoUrl);
        } else {
          speak(cleanFollowUp);
        }
      } else {
        // Comprehensive answer → analyze, validate, and move on
        const feedback = await analyzeResponse(currentQuestion, answer);

        const newResponse: InterviewResponse = {
          question: currentQuestion,
          answer,
          feedback,
        };
        setResponses(prev => [...prev, newResponse]);
        setCurrentFeedback(feedback);

        if (feedback?.feedback) {
          toast.success(`Score: ${feedback.score}/100`, { duration: 3000 });
        }

        // Move to next question or finish
        if (questionNumber >= totalQuestions) {
          await generateFinalReport();
        } else {
          setQuestionNumber(prev => prev + 1);
          setFollowUpCount(0);
          setInterviewState("THINKING");
          setCurrentEmotion("thinking");
          const nextQuestion = await generateQuestion();
          const cleanQuestion = processQuestionWithEmotion(nextQuestion);
          previousQuestionsRef.current.push(nextQuestion);

          // Add pro-tip for new question
          setProTips(prev => [...prev, generateProTip(cleanQuestion)]);

          resetTranscript();
          setUserTranscript("");

          setInterviewState("RESPONDING");
          const videoUrl = await generateAvatarVideo(cleanQuestion);
          if (videoUrl) {
            setAvatarVideoUrl(videoUrl);
          } else {
            speak(cleanQuestion);
          }
        }
      }
    } catch (error) {
      console.error("Process error:", error);
      toast.error("Failed to process response");
      setCurrentEmotion("neutral");
      setInterviewState("LISTENING");
    } finally {
      setIsLoading(false);
    }
  };

  // Skip current question
  const skipQuestion = async () => {
    stopListening();
    setIsRecording(false);
    
    const newResponse: InterviewResponse = {
      question: displayQuestion,
      answer: "[Skipped]",
    };
    setResponses(prev => [...prev, newResponse]);

    if (questionNumber >= totalQuestions) {
      await generateFinalReport();
    } else {
      setIsLoading(true);
      setQuestionNumber(prev => prev + 1);
      setFollowUpCount(0);
      setInterviewState("THINKING");
      setCurrentEmotion("thinking");
      
      try {
        const nextQuestion = await generateQuestion();
        const cleanQuestion = processQuestionWithEmotion(nextQuestion);
        previousQuestionsRef.current.push(nextQuestion);
        
        setProTips(prev => [...prev, generateProTip(cleanQuestion)]);
        
        resetTranscript();
        setUserTranscript("");
        
        setInterviewState("RESPONDING");
        const videoUrl = await generateAvatarVideo(cleanQuestion);
        if (videoUrl) {
          setAvatarVideoUrl(videoUrl);
        } else {
          speak(cleanQuestion);
        }
      } catch (error) {
        console.error("Skip error:", error);
        toast.error("Failed to load next question");
        setCurrentEmotion("neutral");
        setInterviewState("IDLE");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const endInterview = () => {
    if (responses.length > 0) {
      generateFinalReport();
    } else {
      stopCamera();
      stopSpeaking();
      setPhase("setup");
      setInterviewState("IDLE");
    }
  };

  const handleAvatarVideoEnd = () => {
    setInterviewState("LISTENING");
    if (!isRecording && !isLoading && phase === "interview") {
      startRecording();
    }
  };

  const resetInterview = () => {
    setPhase("personalization");
    setResponses([]);
    setQuestionNumber(0);
    setFinalReport(null);
    setCurrentFeedback(null);
    setCurrentQuestion("");
    setDisplayQuestion("");
    setCurrentEmotion("neutral");
    setUserTranscript("");
    setAvatarVideoUrl(null);
    setCustomQuestions([]);
    setPersonalization({});
    setInterviewState("IDLE");
    setFollowUpCount(0);
    setProTips([]);
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
  if (phase === "personalization") {
    return (
      <ResumeJDSetup
        onComplete={handlePersonalizationComplete}
        onSkip={handleSkipPersonalization}
      />
    );
  }

  if (phase === "setup") {
    return (
      <InterviewSetup
        interviewType={interviewType}
        totalQuestions={totalQuestions}
        isCameraOn={isCameraOn}
        isSpeechSupported={isSpeechSupported}
        isLoading={isLoading || isGeneratingQuestions}
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
        currentQuestion={displayQuestion || currentQuestion}
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
        userStream={userStreamRef.current}
        isCameraOn={isCameraOn}
        emotion={currentEmotion}
        interviewState={interviewState}
        proTips={proTips}
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
