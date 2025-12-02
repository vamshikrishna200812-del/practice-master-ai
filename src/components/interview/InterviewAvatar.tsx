import { useRef, useEffect, useState } from "react";
import { Loader2, User, AlertCircle } from "lucide-react";

interface InterviewAvatarProps {
  videoUrl: string | null;
  isLoading: boolean;
  isSpeaking: boolean;
  error: string | null;
  onVideoEnd?: () => void;
}

export const InterviewAvatar = ({
  videoUrl,
  isLoading,
  isSpeaking,
  error,
  onVideoEnd,
}: InterviewAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      setIsVideoReady(false);
      videoRef.current.load();
    }
  }, [videoUrl]);

  const handleCanPlay = () => {
    setIsVideoReady(true);
    videoRef.current?.play().catch(console.error);
  };

  const handleEnded = () => {
    onVideoEnd?.();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-primary/60" />
            </div>
            <Loader2 className="w-8 h-8 absolute -bottom-2 -right-2 text-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Preparing AI interviewer...</p>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-center space-y-4 p-6">
          <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center mx-auto animate-pulse">
            <User className="w-12 h-12 text-primary" />
          </div>
          {isSpeaking && (
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {isSpeaking ? "AI Interviewer Speaking..." : "AI Interviewer"}
          </p>
        </div>
      </div>
    );
  }

  // Video avatar
  if (videoUrl) {
    return (
      <div className="w-full h-full relative">
        <video
          ref={videoRef}
          src={videoUrl}
          onCanPlay={handleCanPlay}
          onEnded={handleEnded}
          className="w-full h-full object-cover"
          playsInline
        />
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // Default state (with browser TTS visualization)
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="text-center space-y-4">
        <div className={`w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center mx-auto ${isSpeaking ? "animate-pulse" : ""}`}>
          <User className="w-12 h-12 text-primary" />
        </div>
        {isSpeaking && (
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animation: "pulse 0.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          {isSpeaking ? "AI Interviewer Speaking..." : "AI Interviewer Ready"}
        </p>
      </div>
    </div>
  );
};
