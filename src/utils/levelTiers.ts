import { Shield, Award, Trophy, Crown } from "lucide-react";

export interface LevelTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: typeof Shield;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
}

export const TIERS: LevelTier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    maxPoints: 100,
    icon: Shield,
    color: "#CD7F32",
    bgClass: "bg-orange-700/20",
    borderClass: "border-orange-600/40",
    textClass: "text-orange-400",
    glowClass: "shadow-orange-500/20",
  },
  {
    name: "Silver",
    minPoints: 101,
    maxPoints: 300,
    icon: Award,
    color: "#C0C0C0",
    bgClass: "bg-slate-400/20",
    borderClass: "border-slate-400/40",
    textClass: "text-slate-300",
    glowClass: "shadow-slate-400/20",
  },
  {
    name: "Gold",
    minPoints: 301,
    maxPoints: 600,
    icon: Trophy,
    color: "#FFD700",
    bgClass: "bg-amber-500/20",
    borderClass: "border-amber-500/40",
    textClass: "text-amber-400",
    glowClass: "shadow-amber-500/20",
  },
  {
    name: "Platinum",
    minPoints: 601,
    maxPoints: Infinity,
    icon: Crown,
    color: "#E5E4E2",
    bgClass: "bg-cyan-400/20",
    borderClass: "border-cyan-400/40",
    textClass: "text-cyan-300",
    glowClass: "shadow-cyan-400/20",
  },
];

export const getTier = (points: number): LevelTier => {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
};

export const getNextTier = (points: number): LevelTier | null => {
  const current = getTier(points);
  const idx = TIERS.indexOf(current);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
};

export const getTierProgress = (points: number): number => {
  const tier = getTier(points);
  const next = getNextTier(points);
  if (!next) return 100;
  const range = next.minPoints - tier.minPoints;
  const progress = points - tier.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
};
