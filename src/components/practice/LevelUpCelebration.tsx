import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LevelTier } from "@/utils/levelTiers";
import { ConfettiRain } from "@/components/ui/ConfettiRain";
import { useCelebrationSound } from "@/hooks/useCelebrationSound";

interface LevelUpCelebrationProps {
  isVisible: boolean;
  oldTier: LevelTier;
  newTier: LevelTier;
  onClose: () => void;
}

const LevelUpCelebration = ({ isVisible, oldTier, newTier, onClose }: LevelUpCelebrationProps) => {
  const { playSound } = useCelebrationSound();

  useEffect(() => {
    if (isVisible) {
      playSound("achievement");
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <ConfettiRain isActive={isVisible} duration={4000} particleCount={60} />
          <motion.div
            initial={{ scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-card border rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-muted-foreground mb-3">🎉 LEVEL UP!</p>

            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Old tier */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 0.7, opacity: 0.4 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <oldTier.icon className={`w-10 h-10 ${oldTier.textClass}`} />
                <span className={`text-xs mt-1 ${oldTier.textClass}`}>{oldTier.name}</span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl"
              >
                →
              </motion.span>

              {/* New tier */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <newTier.icon className={`w-14 h-14 ${newTier.textClass} drop-shadow-lg`} />
                <span className={`text-sm font-bold mt-1 ${newTier.textClass}`}>{newTier.name}</span>
              </motion.div>
            </div>

            <p className="text-lg font-bold mb-1">
              You've reached <span className={newTier.textClass}>{newTier.name}</span>!
            </p>
            <p className="text-sm text-muted-foreground">Keep solving to climb higher.</p>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpCelebration;
