import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { generateTimeSeriesData } from "@/lib/mockData";
import { Dna } from "lucide-react";
import { useMemo } from "react";

const EnergyDNAChart = () => {
  const data = useMemo(() => generateTimeSeriesData(24), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card gradient-border p-5 col-span-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-chart-4/20 flex items-center justify-center">
            <Dna className="w-4 h-4 text-chart-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Energy DNA — Behavioral Fingerprint</h2>
            <p className="text-xs text-muted-foreground font-mono">Learned baseline vs actual consumption pattern</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-muted-foreground rounded" style={{ borderTop: '2px dashed hsl(215, 15%, 35%)' }} />
            <span className="text-muted-foreground">Expected DNA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-primary" />
            <span className="text-primary">Actual Pattern</span>
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dnaExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dnaActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 13%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} tickLine={false} axisLine={false} />
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
            <Area type="monotone" dataKey="expected" stroke="hsl(280, 65%, 60%)" strokeWidth={2} strokeDasharray="6 3" fill="url(#dnaExpected)" name="DNA Baseline" />
            <Area type="monotone" dataKey="actual" stroke="hsl(185, 80%, 50%)" strokeWidth={2} fill="url(#dnaActual)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <span className="text-warning">⚡</span>
        <span>Deviation zones indicate potential waste or anomalous behavior — AI is learning</span>
      </div>
    </motion.div>
  );
};

export default EnergyDNAChart;
