import { motion } from "framer-motion";
import { fetchAlerts, fetchZones, buildingProfile } from "@/lib/api";
import { Bell, Building2, Users, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const alertColors: Record<string, string> = {
  warning: 'border-l-warning',
  info: 'border-l-primary',
  success: 'border-l-accent',
  danger: 'border-l-destructive',
};

const alertDotColors: Record<string, string> = {
  warning: 'bg-warning',
  info: 'bg-primary',
  success: 'bg-accent',
  danger: 'bg-destructive',
};

const zoneStatusColors: Record<string, string> = {
  normal: 'bg-accent/10 text-accent',
  warning: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
  optimal: 'bg-primary/10 text-primary',
};

const zoneBarColors: Record<string, string> = {
  normal: 'bg-accent',
  warning: 'bg-warning',
  critical: 'bg-destructive',
  optimal: 'bg-primary',
};

const AlertsAndZones = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [zoneData, setZoneData] = useState<any[]>([]);

  useEffect(() => {
    fetchAlerts().then(setAlerts).catch(console.error);
    fetchZones().then(setZoneData).catch(console.error);
  }, []);

  if (!alerts.length || !zoneData.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 col-span-full">
      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-warning/8 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-warning" />
            </div>
            <div>
              <h2 className="section-title">System Alerts</h2>
              <p className="section-subtitle">AI-generated notifications</p>
            </div>
          </div>
          <span className="bg-warning/8 text-warning text-[10px] font-mono px-2 py-0.5 rounded-full">
            {alerts.length} ACTIVE
          </span>
        </div>
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.08 }}
              className={cn(
                "p-3 rounded-lg bg-muted/30 border-l-2 flex items-start gap-3",
                alertColors[alert.type]
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", alertDotColors[alert.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground/80 leading-relaxed">{alert.message}</p>
                <span className="text-[10px] font-mono text-muted-foreground">{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Zone Monitoring — Building Adapted */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <h2 className="section-title">Zone Monitoring</h2>
              <p className="section-subtitle">{buildingProfile.name} — {buildingProfile.floors} floors</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 mt-2 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {buildingProfile.occupants} occupants</span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {buildingProfile.systems.length} systems</span>
          <span className="text-border">•</span>
          <span>{buildingProfile.area}</span>
        </div>

        <div className="space-y-2">
          {zoneData.map((zone, i) => (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 + i * 0.04 }}
              className="group"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-medium text-foreground/80 truncate flex-1">{zone.zone}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{zone.system}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.usage}%` }}
                    transition={{ duration: 0.8, delay: 0.9 + i * 0.04 }}
                    className={cn("h-full rounded-full", zoneBarColors[zone.status])}
                  />
                </div>
                <span className="text-[10px] font-mono text-foreground/70 w-8 text-right">{zone.usage}%</span>
                <span className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider",
                  zoneStatusColors[zone.status]
                )}>
                  {zone.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AlertsAndZones;
