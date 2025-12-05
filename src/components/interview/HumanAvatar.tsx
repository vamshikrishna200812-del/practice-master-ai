import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface HumanAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

export const HumanAvatar = ({ isSpeaking, isLoading }: HumanAvatarProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(220_20%_12%)] via-[hsl(220_25%_10%)] to-[hsl(220_30%_8%)]">
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          background: isSpeaking 
            ? [
                "radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
                "radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.12) 0%, transparent 60%)",
                "radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
              ]
            : "radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.05) 0%, transparent 60%)"
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Main Avatar Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Human Face Avatar */}
        <motion.div
          className="relative"
          animate={isSpeaking ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-6 rounded-full opacity-50"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: isSpeaking ? [1, 1.15, 1] : 1,
              opacity: isSpeaking ? [0.3, 0.5, 0.3] : 0.2,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Avatar Container */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
            {/* Face background with realistic gradient */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(180deg, hsl(25 50% 55%) 0%, hsl(20 45% 45%) 50%, hsl(15 40% 40%) 100%)",
              }}
            />
            
            {/* Face shape overlay */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-[hsl(220_25%_15%)]">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {/* Hair */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[45%]"
                    style={{
                      background: "linear-gradient(180deg, hsl(220 15% 12%) 0%, hsl(220 15% 15%) 70%, transparent 100%)",
                      borderRadius: "50% 50% 40% 40%",
                    }}
                  />
                  
                  {/* Forehead */}
                  <div 
                    className="absolute top-[30%] left-[15%] right-[15%] h-[20%]"
                    style={{
                      background: "linear-gradient(180deg, hsl(25 40% 58%) 0%, hsl(25 45% 55%) 100%)",
                    }}
                  />

                  {/* Eyes Container */}
                  <div className="absolute top-[42%] left-1/2 -translate-x-1/2 flex gap-10">
                    {/* Left Eye */}
                    <motion.div
                      className="relative"
                      animate={isSpeaking ? { scaleY: [1, 0.9, 1] } : {}}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                    >
                      {/* Eye socket shadow */}
                      <div className="absolute -inset-1 rounded-full bg-[hsl(20_30%_35%)] blur-sm" />
                      
                      {/* Eye white */}
                      <div className="relative w-8 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {/* Iris */}
                        <motion.div
                          className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(200_50%_35%)] to-[hsl(200_60%_25%)] flex items-center justify-center"
                          animate={{
                            x: isSpeaking ? [0, 1, -1, 0] : 0,
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {/* Pupil */}
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-[hsl(220_20%_10%)]"
                            animate={{
                              scale: isSpeaking ? [1, 0.9, 1] : 1,
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        </motion.div>
                        {/* Eye shine */}
                        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-white/90" />
                      </div>
                      
                      {/* Eyelid line */}
                      <div className="absolute -top-0.5 left-0 right-0 h-0.5 rounded-full bg-[hsl(20_25%_40%)]" />
                    </motion.div>

                    {/* Right Eye */}
                    <motion.div
                      className="relative"
                      animate={isSpeaking ? { scaleY: [1, 0.9, 1] } : {}}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <div className="absolute -inset-1 rounded-full bg-[hsl(20_30%_35%)] blur-sm" />
                      <div className="relative w-8 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <motion.div
                          className="w-4 h-4 rounded-full bg-gradient-to-br from-[hsl(200_50%_35%)] to-[hsl(200_60%_25%)] flex items-center justify-center"
                          animate={{
                            x: isSpeaking ? [0, 1, -1, 0] : 0,
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-[hsl(220_20%_10%)]"
                            animate={{
                              scale: isSpeaking ? [1, 0.9, 1] : 1,
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        </motion.div>
                        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-white/90" />
                      </div>
                      <div className="absolute -top-0.5 left-0 right-0 h-0.5 rounded-full bg-[hsl(20_25%_40%)]" />
                    </motion.div>
                  </div>

                  {/* Eyebrows */}
                  <div className="absolute top-[36%] left-1/2 -translate-x-1/2 flex gap-12">
                    <motion.div 
                      className="w-8 h-1.5 rounded-full bg-[hsl(220_15%_18%)]"
                      style={{ transform: "rotate(-5deg)" }}
                      animate={isSpeaking ? { y: [0, -1, 0] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-8 h-1.5 rounded-full bg-[hsl(220_15%_18%)]"
                      style={{ transform: "rotate(5deg)" }}
                      animate={isSpeaking ? { y: [0, -1, 0] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </div>

                  {/* Nose */}
                  <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-4 h-8">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: "linear-gradient(90deg, transparent 20%, hsl(20 35% 48%) 50%, transparent 80%)",
                      }}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-full bg-[hsl(20_30%_42%)]" />
                  </div>

                  {/* Mouth */}
                  <motion.div
                    className="absolute top-[72%] left-1/2 -translate-x-1/2"
                    animate={{
                      scaleY: isSpeaking ? [1, 1.3, 0.8, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Lips */}
                    <motion.div 
                      className="relative overflow-hidden rounded-full"
                      style={{
                        background: "linear-gradient(180deg, hsl(0 35% 55%) 0%, hsl(0 40% 45%) 100%)",
                      }}
                      animate={{
                        width: isSpeaking ? ["28px", "36px", "24px", "32px", "28px"] : "28px",
                        height: isSpeaking ? ["8px", "16px", "6px", "14px", "8px"] : "8px",
                      }}
                      transition={{
                        duration: 0.25,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Inner mouth / teeth glimpse */}
                      <motion.div
                        className="absolute inset-x-1 bottom-0 bg-[hsl(0_20%_20%)] rounded-b-full"
                        animate={{
                          height: isSpeaking ? ["20%", "50%", "15%", "40%", "20%"] : "20%",
                        }}
                        transition={{
                          duration: 0.25,
                          repeat: Infinity,
                        }}
                      >
                        {/* Teeth */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-white/90" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Cheeks with subtle blush */}
                  <div className="absolute top-[55%] left-[12%] w-6 h-3 rounded-full bg-[hsl(0_50%_70%)] opacity-20 blur-sm" />
                  <div className="absolute top-[55%] right-[12%] w-6 h-3 rounded-full bg-[hsl(0_50%_70%)] opacity-20 blur-sm" />

                  {/* Chin shadow */}
                  <div 
                    className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-16 h-6 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, transparent 0%, hsl(20 30% 38%) 100%)",
                    }}
                  />

                  {/* Ears */}
                  <div className="absolute top-[45%] left-[2%] w-3 h-6 rounded-full bg-[hsl(25_45%_50%)]" />
                  <div className="absolute top-[45%] right-[2%] w-3 h-6 rounded-full bg-[hsl(25_45%_50%)]" />
                </>
              )}
            </div>

            {/* Neck hint */}
            <div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8"
              style={{
                background: "linear-gradient(180deg, hsl(25 45% 48%) 0%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Name and Status */}
        <motion.div
          className="mt-8 text-center"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h3 className="text-xl font-semibold text-foreground">AI Interviewer</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Thinking..." : isSpeaking ? "Speaking..." : "Listening..."}
          </p>
        </motion.div>

        {/* Voice Waveform */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-1 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-primary/60 to-primary"
              animate={{
                height: isSpeaking
                  ? [
                      `${8 + Math.sin(i * 0.7) * 4}px`,
                      `${20 + Math.sin(i * 0.7 + 1) * 12}px`,
                      `${12 + Math.sin(i * 0.7 + 2) * 8}px`,
                      `${24 + Math.sin(i * 0.7 + 3) * 8}px`,
                      `${8 + Math.sin(i * 0.7) * 4}px`,
                    ]
                  : "4px",
                opacity: isSpeaking ? 1 : 0.4,
              }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                delay: i * 0.04,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
