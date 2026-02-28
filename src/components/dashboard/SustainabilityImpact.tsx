import { motion } from "framer-motion";
import { currentMetrics, generateWeeklyData } from "@/lib/mockData";
import { Leaf, TreePine, DollarSign, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useMemo } from "react";

const SustainabilityImpact = () => {
  const weeklyData = useMemo(() => generateWeeklyData(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass-card gradient-border p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Sustainability Impact</h2>
          <p className="text-xs text-muted-foreground font-mono">Environmental footprint analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3 h-3 text-accent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Monthly Savings</span>
          </div>
          <p className="text-xl font-bold font-mono text-accent">${currentMetrics.savingsMonth}</p>
          <p className="text-[10px] text-accent font-mono">↑ {currentMetrics.savingsPercent}%</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-3 h-3 text-warning" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">CO₂ Reduced</span>
          </div>
          <p className="text-xl font-bold font-mono text-warning">{currentMetrics.carbonMonth}</p>
          <p className="text-[10px] text-muted-foreground font-mono">kg this month</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TreePine className="w-3 h-3 text-accent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Trees Equiv.</span>
          </div>
          <p className="text-xl font-bold font-mono text-accent">{currentMetrics.treesEquivalent}</p>
          <p className="text-[10px] text-muted-foreground font-mono">trees planted equiv.</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Leaf className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Efficiency</span>
          </div>
          <p className="text-xl font-bold font-mono text-primary">{currentMetrics.efficiency}%</p>
          <p className="text-[10px] text-muted-foreground font-mono">optimization score</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono text-muted-foreground tracking-wider mb-2">WEEKLY SAVINGS (kWh)</p>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220, 18%, 10%)',
                  border: '1px solid hsl(220, 15%, 18%)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                {weeklyData.map((_, index) => (
                  <Cell key={index} fill={`hsl(160, 70%, ${40 + index * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SustainabilityImpact;
