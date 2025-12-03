import { AIVideoInterview } from "@/components/interview/AIVideoInterview";
import { useSearchParams } from "react-router-dom";

const VideoInterview = () => {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") || "behavioral") as "behavioral" | "technical" | "coding";
  const questions = parseInt(searchParams.get("questions") || "5", 10);

  return (
    <AIVideoInterview 
      interviewType={type} 
      totalQuestions={questions}
      onComplete={(report) => console.log("Interview complete:", report)}
    />
  );
};

export default VideoInterview;
