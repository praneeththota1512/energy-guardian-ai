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
  default: '',
  primary: 'glow-primary',
  accent: 'glow-accent',
  warning: 'glow-warning',
  danger: 'glow-danger',
};

const iconVariantStyles = {
  default: 'text-muted-foreground bg-muted/60',
  primary: 'text-primary bg-primary/8',
  accent: 'text-accent bg-accent/8',
  warning: 'text-warning bg-warning/8',
  danger: 'text-destructive bg-destructive/8',
};

const valueVariantStyles = {
  default: 'text-foreground',
  primary: 'text-primary',
  accent: 'text-accent',
  warning: 'text-warning',
  danger: 'text-destructive',
};

const MetricCard = ({ label, value, unit, icon: Icon, trend, variant = 'default', delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("glass-card p-4 flex flex-col gap-2.5", variantStyles[variant])}
    >
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", iconVariantStyles[variant])}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn("stat-value", valueVariantStyles[variant])}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
      
      {trend && (
        <div className={cn(
          "text-[11px] font-mono flex items-center gap-1",
          trend.positive ? "text-accent" : "text-destructive"
        )}>
          <span>{trend.positive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground">vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
