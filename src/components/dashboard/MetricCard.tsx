import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'danger';
  delay?: number;
}

const variantStyles = {
  default: 'border-border/50',
  primary: 'border-primary/30 glow-primary',
  accent: 'border-accent/30 glow-accent',
  warning: 'border-warning/30 glow-warning',
  danger: 'border-destructive/30 glow-danger',
};

const iconVariantStyles = {
  default: 'text-muted-foreground bg-muted',
  primary: 'text-primary bg-primary/10',
  accent: 'text-accent bg-accent/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-destructive bg-destructive/10',
};

const MetricCard = ({ label, value, unit, icon: Icon, trend, variant = 'default', delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass-card gradient-border p-4 flex flex-col gap-3", variantStyles[variant])}
    >
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconVariantStyles[variant])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="stat-value text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
      </div>
      
      {trend && (
        <div className={cn(
          "text-xs font-mono flex items-center gap-1",
          trend.positive ? "text-accent" : "text-destructive"
        )}>
          <span>{trend.positive ? '▲' : '▼'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
