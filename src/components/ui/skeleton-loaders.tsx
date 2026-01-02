import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * Skeleton Loaders - Animated placeholder components for async content
 * Implements Professional Architect micro-interaction standards
 */

interface SkeletonProps {
  className?: string;
}

// Base skeleton with shimmer animation
export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-muted/60",
      className
    )}
  />
);

// Card skeleton for feature cards and content blocks
export const CardSkeleton = ({ className }: SkeletonProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className={cn(
      "rounded-lg border bg-card p-6 shadow-sm",
      className
    )}
  >
    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3" />
  </motion.div>
);

// Bento box skeleton for grid layouts
export const BentoSkeleton = ({ className }: SkeletonProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className={cn(
      "rounded-xl border-2 border-border/50 bg-card p-8",
      className
    )}
  >
    <div className="flex items-start gap-4">
      <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  </motion.div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="py-20 px-4">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col items-center text-center space-y-6">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-14 w-40 rounded-lg" />
          <Skeleton className="h-14 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Stats/metric skeleton
export const StatSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("text-center p-4", className)}>
    <Skeleton className="h-10 w-20 mx-auto mb-2" />
    <Skeleton className="h-4 w-24 mx-auto" />
  </div>
);

// Feature grid skeleton
export const FeatureGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Bento grid skeleton
export const BentoGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <BentoSkeleton className="lg:col-span-2" />
    <BentoSkeleton />
    <BentoSkeleton />
    <BentoSkeleton className="lg:col-span-2" />
  </div>
);

export default Skeleton;
