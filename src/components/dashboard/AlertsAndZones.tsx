import { motion } from "framer-motion";
import { alerts, zoneData } from "@/lib/mockData";
import { Bell, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const alertColors = {
  warning: 'border-l-warning text-warning',
  info: 'border-l-primary text-primary',
  success: 'border-l-accent text-accent',
  danger: 'border-l-destructive text-destructive',
};

const zoneStatusColors = {
  normal: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
  critical: 'bg-destructive/20 text-destructive',
  optimal: 'bg-primary/20 text-primary',
};

const zoneBarColors = {
  normal: 'bg-accent',
  warning: 'bg-warning',
  critical: 'bg-destructive',
  optimal: 'bg-primary',
};

const AlertsAndZones = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 col-span-full">
      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="glass-card gradient-border p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">System Alerts</h2>
            <p className="text-xs text-muted-foreground font-mono">AI-generated notifications</p>
          </div>
          <div className="ml-auto bg-warning/10 text-warning text-[10px] font-mono px-2 py-0.5 rounded-full">
            {alerts.length} ACTIVE
          </div>
        </div>
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={cn(
                "p-3 rounded-lg bg-muted/30 border-l-2 flex items-start justify-between gap-3",
                alertColors[alert.type]
              )}
            >
              <p className="text-xs text-foreground/80">{alert.message}</p>
              <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{alert.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Zone Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card gradient-border p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Zone Monitoring</h2>
            <p className="text-xs text-muted-foreground font-mono">Per-zone usage breakdown</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {zoneData.map((zone, i) => (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-mono text-muted-foreground w-16 truncate">{zone.zone}</span>
              <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.usage}%` }}
                  transition={{ duration: 1, delay: 1 + i * 0.05 }}
                  className={cn("h-full rounded-full", zoneBarColors[zone.status])}
                />
              </div>
              <span className="text-xs font-mono text-foreground w-8 text-right">{zone.usage}%</span>
              <span className={cn(
                "text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                zoneStatusColors[zone.status]
              )}>
                {zone.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AlertsAndZones;
