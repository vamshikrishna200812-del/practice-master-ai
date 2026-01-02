import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * BentoGrid - Professional "Bento Box" layout for data display
 * Implements clean, modern grid layouts with consistent spacing
 */

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => (
  <div
    className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      className
    )}
  >
    {children}
  </div>
);

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  index?: number;
  onClick?: () => void;
}

export const BentoCard = ({
  title,
  description,
  icon,
  className,
  children,
  index = 0,
  onClick,
}: BentoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.3, 
      delay: index * 0.08,
      ease: [0.4, 0, 0.2, 1]
    }}
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "group relative rounded-xl border-2 border-border/50 bg-card p-6",
      "transition-all duration-200 ease-in-out",
      "hover:border-primary/50 hover:shadow-lg hover:bg-card/80",
      onClick && "cursor-pointer",
      className
    )}
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none" />
    
    <div className="relative z-10">
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 ease-in-out">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-200 ease-in-out">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  </motion.div>
);

// Large feature card spanning 2 columns
export const BentoFeature = ({
  title,
  description,
  icon,
  className,
  children,
  index = 0,
}: BentoCardProps) => (
  <BentoCard
    title={title}
    description={description}
    icon={icon}
    index={index}
    className={cn("lg:col-span-2 lg:row-span-1", className)}
  >
    {children}
  </BentoCard>
);

// Tall card spanning 2 rows
export const BentoTall = ({
  title,
  description,
  icon,
  className,
  children,
  index = 0,
}: BentoCardProps) => (
  <BentoCard
    title={title}
    description={description}
    icon={icon}
    index={index}
    className={cn("lg:row-span-2", className)}
  >
    {children}
  </BentoCard>
);

export default BentoGrid;
