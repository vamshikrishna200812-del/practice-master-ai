import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import femaleInterviewerAlex from "@/assets/female-interviewer-alex.png";

// Emotion/behavior types that can be triggered by metadata tags
export type AvatarEmotion = 
  | "neutral" 
  | "warm_smile" 
  | "slight_nod" 
  | "thoughtful_pause" 
  | "thinking" 
  | "encouraging_nod" 
  | "lean_forward" 
  | "raised_eyebrow";

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
  emotion?: AvatarEmotion;
  statusText?: string;
}

// Parse metadata tags from AI response and return clean text + emotion
export const parseEmotionTags = (text: string): { cleanText: string; emotion: AvatarEmotion } => {
  const emotionMap: Record<string, AvatarEmotion> = {
    "[warm smile]": "warm_smile",
    "[slight nod]": "slight_nod",
    "[thoughtful pause]": "thoughtful_pause",
    "[thinking]": "thinking",
    "[encouraging nod]": "encouraging_nod",
    "[lean forward]": "lean_forward",
    "[raised eyebrow]": "raised_eyebrow",
  };

  let detectedEmotion: AvatarEmotion = "neutral";
  let cleanText = text;

  // Find and extract emotion tags
  for (const [tag, emotion] of Object.entries(emotionMap)) {
    if (text.toLowerCase().includes(tag.toLowerCase())) {
      detectedEmotion = emotion;
      cleanText = cleanText.replace(new RegExp(tag.replace(/[[\]]/g, "\\$&"), "gi"), "").trim();
    }
  }

  return { cleanText, emotion: detectedEmotion };
};

export const AnimatedAvatar = ({ 
  isSpeaking, 
  isLoading, 
  emotion = "neutral",
  statusText 
}: AnimatedAvatarProps) => {
  // Determine animation states based on emotion
  const emotionAnimations = useMemo(() => {
    switch (emotion) {
      case "warm_smile":
        return { 
          headTilt: 5, 
          eyeScale: 1.05, 
          mouthCurve: "smile",
          bodyLean: 0 
        };
      case "slight_nod":
        return { 
          headTilt: 0, 
          eyeScale: 1, 
          mouthCurve: "neutral",
          bodyLean: 0,
          nodding: true 
        };
      case "thoughtful_pause":
        return { 
          headTilt: -8, 
          eyeScale: 0.95, 
          mouthCurve: "thoughtful",
          bodyLean: 0 
        };
      case "thinking":
        return { 
          headTilt: -5, 
          eyeScale: 0.9, 
          mouthCurve: "neutral",
          bodyLean: 0,
          lookAway: true 
        };
      case "encouraging_nod":
        return { 
          headTilt: 3, 
          eyeScale: 1.1, 
          mouthCurve: "smile",
          bodyLean: 2,
          nodding: true 
        };
      case "lean_forward":
        return { 
          headTilt: 0, 
          eyeScale: 1.1, 
          mouthCurve: "neutral",
          bodyLean: 8 
        };
      case "raised_eyebrow":
        return { 
          headTilt: 2, 
          eyeScale: 1.15, 
          mouthCurve: "curious",
          bodyLean: 0,
          eyebrowRaise: true 
        };
      default:
        return { 
          headTilt: 0, 
          eyeScale: 1, 
          mouthCurve: "neutral",
          bodyLean: 0 
        };
    }
  }, [emotion]);

  const getStatusText = () => {
    if (statusText) return statusText;
    if (isLoading) {
      return emotion === "thinking" ? "Hmm, let me think..." : "Processing...";
    }
    if (isSpeaking) return "Speaking...";
    return "Listening...";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: isSpeaking ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Avatar Container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        animate={{
          y: emotionAnimations.bodyLean ? -emotionAnimations.bodyLean : 0,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Avatar with Photo */}
        <motion.div
          className="relative"
          animate={{
            rotate: emotionAnimations.headTilt,
            y: emotionAnimations.nodding ? [0, -8, 0, -5, 0] : (isSpeaking ? [0, -3, 0] : 0),
            x: emotionAnimations.lookAway ? [0, 10, 10, 0] : 0,
          }}
          transition={{ 
            duration: emotionAnimations.nodding ? 0.8 : 0.5, 
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Outer Ring - Pulsing based on state */}
          <motion.div
            className={cn(
              "absolute -inset-4 rounded-full",
              emotion === "warm_smile" || emotion === "encouraging_nod"
                ? "bg-gradient-to-br from-green-400/30 via-primary/20 to-green-400/30"
                : "bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30"
            )}
            animate={{
              scale: isSpeaking ? [1, 1.1, 1] : (emotion === "lean_forward" ? 1.05 : 1),
              opacity: isSpeaking ? [0.5, 0.8, 0.5] : 0.3,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Inner Ring */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 to-accent/40"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Avatar Photo Container */}
          <div className="relative w-44 h-44 rounded-full border-4 border-primary/50 flex items-center justify-center overflow-hidden shadow-2xl">
            {isLoading ? (
              <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-primary" />
                </motion.div>
                {emotion === "thinking" && (
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-2xl">🤔</span>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                {/* Professional interviewer photo */}
                <motion.img
                  src={femaleInterviewerAlex}
                  alt="Alex Chen - Interviewer"
                  className="w-full h-full object-cover"
                  animate={{
                    scale: emotionAnimations.eyeScale,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Speaking overlay effect */}
                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>

                {/* Emotion indicator overlay */}
                <AnimatePresence>
                  {emotion !== "neutral" && (
                    <motion.div
                      className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {emotion === "warm_smile" && "😊"}
                      {emotion === "slight_nod" && "👍"}
                      {emotion === "thoughtful_pause" && "🤔"}
                      {emotion === "thinking" && "💭"}
                      {emotion === "encouraging_nod" && "✨"}
                      {emotion === "lean_forward" && "👀"}
                      {emotion === "raised_eyebrow" && "🧐"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>

        {/* Name and Status */}
        <motion.div
          className="mt-6 text-center"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h3 className="text-xl font-semibold text-foreground">Alex Chen</h3>
          <p className="text-sm text-muted-foreground">Senior Hiring Lead</p>
          <motion.p 
            className="text-xs text-primary mt-1"
            animate={{ opacity: isLoading ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 0.8, repeat: isLoading ? Infinity : 0 }}
          >
            {getStatusText()}
          </motion.p>
        </motion.div>

        {/* Audio Waveform Visualization */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-1 h-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-1.5 rounded-full",
                emotion === "warm_smile" || emotion === "encouraging_nod"
                  ? "bg-gradient-to-t from-green-500 to-primary"
                  : "bg-gradient-to-t from-primary to-accent"
              )}
              animate={{
                height: isSpeaking
                  ? [
                      `${12 + Math.sin(i * 0.8) * 8}px`,
                      `${28 + Math.sin(i * 0.8 + 1) * 12}px`,
                      `${16 + Math.sin(i * 0.8 + 2) * 10}px`,
                      `${32 + Math.sin(i * 0.8 + 3) * 8}px`,
                      `${12 + Math.sin(i * 0.8) * 8}px`,
                    ]
                  : isLoading && emotion === "thinking"
                  ? [`${8 + i}px`, `${12 + i}px`, `${8 + i}px`]
                  : "6px",
                opacity: isSpeaking ? 1 : isLoading ? 0.6 : 0.3,
              }}
              transition={{
                duration: isSpeaking ? 0.4 : 1,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating particles when speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/40"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, -100 - Math.random() * 100],
                  opacity: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "40%",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};