import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { AvatarEmotion } from "./AnimatedAvatar";
import femaleInterviewerAlex from "@/assets/female-interviewer-alex.png";

interface HumanAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
  emotion?: AvatarEmotion;
  statusText?: string;
}

export const HumanAvatar = ({ isSpeaking, isLoading, emotion = "neutral" }: HumanAvatarProps) => {
  const [breathScale, setBreathScale] = useState(1);

  // Subtle idle breathing
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathScale((prev) => (prev === 1 ? 1.015 : 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
      {/* Office background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a3040] via-[#1e2530] to-[#151a22]" />

      {/* Subtle warm lighting from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,180,140,0.12)_0%,transparent_60%)]" />

      {/* Avatar image - full frame, centered */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center"
        animate={{
          scale: breathScale,
          y: isSpeaking ? [0, -2, 0] : 0,
          rotate: emotion === "slight_nod" || emotion === "encouraging_nod" ? [0, -2, 0, -1, 0] : 0,
        }}
        transition={{
          scale: { duration: 2.5, ease: "easeInOut" },
          y: { duration: 0.6, repeat: isSpeaking ? Infinity : 0, ease: "easeInOut" },
          rotate: { duration: 0.8 },
        }}
      >
        <img
          src={femaleInterviewerAlex}
          alt="Alex Chen - AI Interviewer"
          className="w-auto h-[85%] max-w-none object-contain object-bottom select-none pointer-events-none"
          draggable={false}
        />
      </motion.div>

      {/* Speaking glow overlay */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <span className="text-sm text-white/70 font-medium">
                {emotion === "thinking" ? "Thinking..." : "Processing..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nameplate */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full",
          isSpeaking ? "bg-green-400 animate-pulse" : "bg-green-400"
        )} />
        <div>
          <p className="text-white text-sm font-medium leading-tight">Alex Chen</p>
          <p className="text-white/50 text-[10px]">Senior Hiring Lead</p>
        </div>
      </div>

      {/* Emotion indicator */}
      <AnimatePresence>
        {emotion !== "neutral" && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm"
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
    </div>
  );
};
