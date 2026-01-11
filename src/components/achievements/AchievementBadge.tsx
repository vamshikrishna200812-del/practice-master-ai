import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Trophy,
  Crown,
  Star,
  Medal,
  BookOpen,
  GraduationCap,
  Flame,
  Zap,
  Calendar,
  User,
  MessageCircle,
  Lock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  isEarned: boolean;
  earnedAt?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  animate?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  rocket: Rocket,
  trophy: Trophy,
  crown: Crown,
  star: Star,
  medal: Medal,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  flame: Flame,
  fire: Flame,
  zap: Zap,
  calendar: Calendar,
  user: User,
  "message-circle": MessageCircle,
};

const categoryColors: Record<string, { bg: string; border: string; glow: string }> = {
  interviews: {
    bg: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/50",
    glow: "shadow-blue-500/30",
  },
  courses: {
    bg: "from-green-500/20 to-green-600/20",
    border: "border-green-500/50",
    glow: "shadow-green-500/30",
  },
  streaks: {
    bg: "from-orange-500/20 to-orange-600/20",
    border: "border-orange-500/50",
    glow: "shadow-orange-500/30",
  },
  scheduling: {
    bg: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/50",
    glow: "shadow-purple-500/30",
  },
  skills: {
    bg: "from-pink-500/20 to-pink-600/20",
    border: "border-pink-500/50",
    glow: "shadow-pink-500/30",
  },
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

export const AchievementBadge = ({
  name,
  description,
  icon,
  category,
  points,
  isEarned,
  earnedAt,
  size = "md",
  showTooltip = true,
  animate = true,
}: AchievementBadgeProps) => {
  const IconComponent = iconMap[icon] || Star;
  const colors = categoryColors[category] || categoryColors.interviews;

  const badge = (
    <motion.div
      initial={animate ? { scale: 0 } : false}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
      className={cn(
        "relative rounded-full flex items-center justify-center border-2 transition-all duration-300",
        sizeClasses[size],
        isEarned
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : "bg-muted/50 border-muted-foreground/20 grayscale opacity-50"
      )}
    >
      {isEarned ? (
        <IconComponent
          className={cn(
            iconSizeClasses[size],
            "text-foreground drop-shadow-md"
          )}
        />
      ) : (
        <Lock
          className={cn(
            iconSizeClasses[size],
            "text-muted-foreground"
          )}
        />
      )}

      {/* Points badge */}
      {isEarned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-md"
        >
          +{points}
        </motion.div>
      )}

      {/* Shine effect for earned badges */}
      {isEarned && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        </div>
      )}
    </motion.div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            {isEarned && earnedAt && (
              <p className="text-xs text-primary">
                Earned on {new Date(earnedAt).toLocaleDateString()}
              </p>
            )}
            {!isEarned && (
              <p className="text-xs text-muted-foreground italic">
                Not yet earned
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
