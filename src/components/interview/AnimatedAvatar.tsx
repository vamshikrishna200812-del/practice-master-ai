import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

export const AnimatedAvatar = ({ isSpeaking, isLoading }: AnimatedAvatarProps) => {
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
      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar Head */}
        <motion.div
          className="relative"
          animate={isSpeaking ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {/* Outer Ring - Pulsing when speaking */}
          <motion.div
            className={cn(
              "absolute -inset-4 rounded-full",
              "bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30"
            )}
            animate={{
              scale: isSpeaking ? [1, 1.1, 1] : 1,
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

          {/* Avatar Face Container */}
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[hsl(220_25%_15%)] to-[hsl(220_25%_20%)] border-4 border-primary/50 flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : (
              <>
                {/* Eyes */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-8">
                  {/* Left Eye */}
                  <motion.div
                    className="relative"
                    animate={isSpeaking ? { scaleY: [1, 0.8, 1] } : {}}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-[hsl(220_25%_25%)] flex items-center justify-center">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-primary"
                        animate={{
                          y: isSpeaking ? [0, 1, 0] : 0,
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    </div>
                    {/* Eye shine */}
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white/60" />
                  </motion.div>

                  {/* Right Eye */}
                  <motion.div
                    className="relative"
                    animate={isSpeaking ? { scaleY: [1, 0.8, 1] } : {}}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-[hsl(220_25%_25%)] flex items-center justify-center">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-primary"
                        animate={{
                          y: isSpeaking ? [0, 1, 0] : 0,
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    </div>
                    {/* Eye shine */}
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white/60" />
                  </motion.div>
                </div>

                {/* Mouth - Animated when speaking */}
                <motion.div
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[hsl(220_25%_25%)] rounded-full overflow-hidden"
                  animate={{
                    width: isSpeaking ? ["24px", "32px", "20px", "28px", "24px"] : "24px",
                    height: isSpeaking ? ["8px", "16px", "6px", "14px", "8px"] : "8px",
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Inner mouth */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-primary/30"
                    animate={{
                      height: isSpeaking ? ["30%", "60%", "20%", "50%", "30%"] : "30%",
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Blush marks */}
                <div className="absolute top-20 left-8 w-4 h-2 rounded-full bg-pink-400/20" />
                <div className="absolute top-20 right-8 w-4 h-2 rounded-full bg-pink-400/20" />
              </>
            )}
          </div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          className="mt-6 text-center"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h3 className="text-xl font-semibold text-foreground">AI Interviewer</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Thinking..." : isSpeaking ? "Speaking..." : "Listening..."}
          </p>
        </motion.div>

        {/* Audio Waveform Visualization */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-1 h-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent"
              animate={{
                height: isSpeaking
                  ? [
                      `${12 + Math.sin(i * 0.8) * 8}px`,
                      `${28 + Math.sin(i * 0.8 + 1) * 12}px`,
                      `${16 + Math.sin(i * 0.8 + 2) * 10}px`,
                      `${32 + Math.sin(i * 0.8 + 3) * 8}px`,
                      `${12 + Math.sin(i * 0.8) * 8}px`,
                    ]
                  : "8px",
                opacity: isSpeaking ? 1 : 0.4,
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating particles when speaking */}
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
    </div>
  );
};