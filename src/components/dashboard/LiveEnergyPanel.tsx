import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTimeSeriesData, fetchCurrentMetrics } from "@/lib/api";
import { Zap, TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const LiveEnergyPanel = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  useEffect(() => {
    fetchTimeSeriesData(24).then(setData).catch(console.error);
    fetchCurrentMetrics().then(setCurrentMetrics).catch(console.error);
  }, []);

  if (!data.length || !currentMetrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-5 col-span-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="section-title">Live Energy Consumption</h2>
            <p className="section-subtitle">Real-time • 24h window</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono text-primary text-glow-primary">{currentMetrics.currentUsage}</p>
          <p className="stat-label">kWh NOW</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Today</span>
          </div>
          <p className="text-base font-bold font-mono text-foreground">{currentMetrics.dailyTotal} <span className="text-[10px] text-muted-foreground">kWh</span></p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <TrendingUp className="w-3 h-3 text-warning" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Peak</span>
          </div>
          <p className="text-base font-bold font-mono text-foreground">{currentMetrics.peakDemand} <span className="text-[10px] text-muted-foreground">kW</span></p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Efficiency</span>
          </div>
          <p className="text-base font-bold font-mono text-accent">{currentMetrics.efficiency}<span className="text-[10px]">%</span></p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 65%, 52%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(200, 65%, 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 14%, 12%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 45%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 12%, 45%)' }} tickLine={false} axisLine={false} unit=" kWh" />
            <Tooltip
              contentStyle={{
                background: 'hsl(222, 20%, 8%)',
                border: '1px solid hsl(222, 14%, 14%)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
              labelStyle={{ color: 'hsl(210, 15%, 88%)' }}
            />
            <Area type="monotone" dataKey="expected" stroke="hsl(215, 12%, 30%)" strokeDasharray="5 5" strokeWidth={1.5} fill="none" name="Expected" />
            <Area type="monotone" dataKey="actual" stroke="hsl(200, 65%, 52%)" strokeWidth={2} fill="url(#actualGradient)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LiveEnergyPanel;
