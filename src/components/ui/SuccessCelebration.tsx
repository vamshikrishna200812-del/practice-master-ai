import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import celebrationVideo from "@/assets/celebration-trophy.mp4";
import { useCelebrationSound } from "@/hooks/useCelebrationSound";

interface SuccessCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoCloseDelay?: number;
  playSound?: boolean;
}

export const SuccessCelebration = ({
  isOpen,
  onClose,
  title,
  message,
  actionLabel,
  onAction,
  autoCloseDelay = 8000,
  playSound: shouldPlaySound = true,
}: SuccessCelebrationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { playSound } = useCelebrationSound();

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Play celebration sound
      if (shouldPlaySound) {
        playSound("celebration");
      }
      
      // Auto-close after delay if no action required
      if (!actionLabel) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, autoCloseDelay, onClose, actionLabel, shouldPlaySound, playSound]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Confetti particles */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-20px",
                    backgroundColor: [
                      "hsl(var(--primary))",
                      "hsl(var(--secondary))",
                      "#FFD700",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#A855F7",
                    ][Math.floor(Math.random() * 6)],
                  }}
                  initial={{ y: -20, opacity: 1, rotate: 0 }}
                  animate={{
                    y: window.innerHeight + 50,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 720 - 360,
                    x: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 0.5,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          )}

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-primary/20"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Trophy animation */}
            <div className="relative w-full h-48 bg-gradient-to-b from-primary/10 to-transparent flex items-center justify-center overflow-hidden">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, damping: 15 }}
                className="w-40 h-40 rounded-2xl overflow-hidden"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={celebrationVideo} type="video/mp4" />
                </video>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                {message}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 justify-center"
              >
                {actionLabel && onAction && (
                  <Button onClick={onAction} size="lg" className="px-8">
                    {actionLabel}
                  </Button>
                )}
                <Button onClick={onClose} variant="outline" size="lg">
                  Close
                </Button>
              </motion.div>
            </div>

            {/* Decorative gradient border animation */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(45deg, transparent, hsl(var(--primary) / 0.1), transparent)",
                }}
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, hsl(var(--primary) / 0.2), transparent)",
                    "linear-gradient(225deg, transparent, hsl(var(--secondary) / 0.2), transparent)",
                    "linear-gradient(45deg, transparent, hsl(var(--primary) / 0.2), transparent)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessCelebration;
