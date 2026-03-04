import React, { useMemo } from 'react';
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, XCircle, MinusCircle, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'default';

interface StatusConfig {
  icon: React.ElementType;
  classNames: string;
  role: 'status' | 'alert' | 'none';
}

const STATUS_MAP: Record<StatusType, StatusConfig> = {
  success: {
    icon: CheckCircle,
    classNames: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    role: 'status',
  },
  error: {
    icon: XCircle,
    classNames: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    role: 'alert',
  },
  warning: {
    icon: AlertCircle,
    classNames: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    role: 'alert',
  },
  info: {
    icon: Info,
    classNames: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    role: 'status',
  },
  pending: {
    icon: Clock,
    classNames: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30",
    role: 'status',
  },
  default: {
    icon: MinusCircle,
    classNames: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    role: 'none',
  },
};

export interface StatusBadgeProps {
  children: React.ReactNode;
  status: StatusType;
  className?: string;
  hideIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  status,
  className,
  hideIcon = false,
}) => {
  const config = useMemo(() => STATUS_MAP[status] || STATUS_MAP['default'], [status]);
  const IconComponent = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.classNames, className)}
      role={config.role === 'none' ? undefined : config.role}
    >
      {!hideIcon && (
        <IconComponent className="w-3.5 h-3.5" />
      )}
      {children}
    </Badge>
  );
};

export { StatusBadge };
export default StatusBadge;
