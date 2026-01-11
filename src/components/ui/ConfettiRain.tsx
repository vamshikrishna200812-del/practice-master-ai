import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiRainProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

export const ConfettiRain = ({
  isActive,
  duration = 2000,
  particleCount = 20,
  onComplete,
}: ConfettiRainProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    size: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = [
        "hsl(var(--primary))",
        "hsl(var(--secondary))",
        "#FFD700",
        "#FF6B6B",
        "#4ECDC4",
        "#A855F7",
        "#F97316",
        "#10B981",
      ];

      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.3,
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount, duration, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: "-20px",
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                y: window.innerHeight + 50,
                opacity: [1, 1, 0.8, 0],
                rotate: Math.random() * 720 - 360,
                x: Math.random() * 100 - 50,
                scale: [1, 1.2, 0.8],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: particle.delay,
                ease: "easeIn",
              }}
            />
          ))}
          {/* Add some star-shaped particles */}
          {particles.slice(0, Math.floor(particleCount / 3)).map((particle) => (
            <motion.div
              key={`star-${particle.id}`}
              className="absolute text-lg"
              style={{
                left: `${(particle.x + 50) % 100}%`,
                top: "-20px",
              }}
              initial={{ y: -20, opacity: 1, rotate: 0, scale: 0.8 }}
              animate={{
                y: window.innerHeight + 50,
                opacity: [1, 1, 0.5, 0],
                rotate: 360,
                x: Math.random() * 80 - 40,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: particle.delay + 0.2,
                ease: "easeIn",
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiRain;
