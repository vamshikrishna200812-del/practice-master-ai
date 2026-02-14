import { AIVideoInterview } from "@/components/interview/AIVideoInterview";
import { useSearchParams } from "react-router-dom";

const VideoInterview = () => {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") || "behavioral") as "behavioral" | "technical" | "coding";
  const questions = parseInt(searchParams.get("questions") || "5", 10);
  const recruiterMode = searchParams.get("recruiterMode") === "true";
  const company = searchParams.get("company") || undefined;
  const personality = searchParams.get("personality") || undefined;

  return (
    <AIVideoInterview 
      interviewType={type} 
      totalQuestions={questions}
      recruiterMode={recruiterMode}
      company={company}
      personality={personality}
      onComplete={(report) => console.log("Interview complete:", report)}
    />
  );
};

export default VideoInterview;
