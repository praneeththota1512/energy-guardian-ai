import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTimeSeriesData } from "@/lib/api";
import { Dna } from "lucide-react";
import { useState, useEffect } from "react";

const EnergyDNAChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      fetchTimeSeriesData(24).then(setData).catch(console.error);
    };

    loadData();
    const interval = setInterval(loadData, 15000); // 15s polling

    return () => clearInterval(interval);
  }, []);

  if (!data.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card p-5 col-span-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-chart-4/10 flex items-center justify-center">
            <Dna className="w-3.5 h-3.5 text-chart-4" />
          </div>
          <div>
            <h2 className="section-title">Energy DNA — Behavioral Fingerprint</h2>
            <p className="section-subtitle">Learned baseline vs actual consumption</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-px bg-muted-foreground" style={{ borderTop: '1.5px dashed hsl(215, 12%, 30%)' }} />
            <span className="text-muted-foreground">DNA Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-primary" />
            <span className="text-primary">Actual</span>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dnaExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 50%, 55%)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(262, 50%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dnaActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 65%, 52%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(200, 65%, 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 14%, 10%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 45%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 12%, 45%)' }} tickLine={false} axisLine={false} />
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
            <Area type="monotone" dataKey="expected" stroke="hsl(262, 50%, 55%)" strokeWidth={1.5} strokeDasharray="6 3" fill="url(#dnaExpected)" name="DNA Baseline" />
            <Area type="monotone" dataKey="actual" stroke="hsl(200, 65%, 52%)" strokeWidth={2} fill="url(#dnaActual)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
        <span className="text-warning">⚡</span>
        <span>Deviation zones indicate potential waste — AI continuously refining baseline model</span>
      </div>
    </motion.div>
  );
};

export default EnergyDNAChart;
