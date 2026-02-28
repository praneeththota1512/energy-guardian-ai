import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateTimeSeriesData, currentMetrics } from "@/lib/mockData";
import { Zap, TrendingUp, Clock } from "lucide-react";
import { useMemo } from "react";

const LiveEnergyPanel = () => {
  const data = useMemo(() => generateTimeSeriesData(24), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card gradient-border p-5 col-span-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Live Energy Consumption</h2>
            <p className="text-xs text-muted-foreground font-mono">Real-time monitoring • 24h window</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="stat-value text-primary text-glow-primary text-2xl">{currentMetrics.currentUsage}</p>
            <p className="stat-label">kWh NOW</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="stat-label">Today</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{currentMetrics.dailyTotal} <span className="text-xs text-muted-foreground">kWh</span></p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-warning" />
            <span className="stat-label">Peak</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{currentMetrics.peakDemand} <span className="text-xs text-muted-foreground">kW</span></p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-accent" />
            <span className="stat-label">Efficiency</span>
          </div>
          <p className="text-lg font-bold font-mono text-accent">{currentMetrics.efficiency}<span className="text-xs">%</span></p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} tickLine={false} axisLine={false} unit=" kWh" />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(220, 18%, 10%)', 
                border: '1px solid hsl(220, 15%, 18%)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }} 
              labelStyle={{ color: 'hsl(210, 20%, 90%)' }}
            />
            <Area type="monotone" dataKey="expected" stroke="hsl(215, 15%, 35%)" strokeDasharray="5 5" strokeWidth={1.5} fill="none" name="Expected" />
            <Area type="monotone" dataKey="actual" stroke="hsl(185, 80%, 50%)" strokeWidth={2} fill="url(#actualGradient)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LiveEnergyPanel;
