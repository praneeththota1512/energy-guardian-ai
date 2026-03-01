import { motion } from "framer-motion";
import { fetchCurrentMetrics } from "@/lib/api";
import { generateWeeklyData } from "@/lib/mockData"; // Keeping the history generation local for now, logic can move to backend later if needed
import { Leaf, TreePine, DollarSign, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useState, useEffect, useMemo } from "react";

const SustainabilityImpact = () => {
  const weeklyData = useMemo(() => generateWeeklyData(), []);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  useEffect(() => {
    fetchCurrentMetrics().then(setCurrentMetrics).catch(console.error);
  }, []);

  if (!currentMetrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-md bg-accent/8 flex items-center justify-center">
          <Leaf className="w-3.5 h-3.5 text-accent" />
        </div>
        <div>
          <h2 className="section-title">Sustainability Impact</h2>
          <p className="section-subtitle">Environmental footprint analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Monthly Savings</span>
          </div>
          <p className="text-lg font-bold font-mono text-accent">${currentMetrics.savingsMonth}</p>
          <p className="text-[10px] text-accent font-mono">↑ {currentMetrics.savingsPercent}%</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <Flame className="w-3 h-3 text-warning" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">CO₂ Reduced</span>
          </div>
          <p className="text-lg font-bold font-mono text-warning">{currentMetrics.carbonMonth}</p>
          <p className="text-[10px] text-muted-foreground font-mono">kg this month</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <TreePine className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Trees Equiv.</span>
          </div>
          <p className="text-lg font-bold font-mono text-accent">{currentMetrics.treesEquivalent}</p>
          <p className="text-[10px] text-muted-foreground font-mono">trees planted equiv.</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <Leaf className="w-3 h-3 text-primary" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Efficiency</span>
          </div>
          <p className="text-lg font-bold font-mono text-primary">{currentMetrics.efficiency}%</p>
          <p className="text-[10px] text-muted-foreground font-mono">optimization score</p>
        </div>
      </div>

      <div>
        <p className="text-[9px] font-mono text-muted-foreground tracking-wider mb-1.5">WEEKLY SAVINGS (kWh)</p>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215, 12%, 45%)' }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222, 20%, 8%)',
                  border: '1px solid hsl(222, 14%, 14%)',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Bar dataKey="savings" radius={[3, 3, 0, 0]}>
                {weeklyData.map((_, index) => (
                  <Cell key={index} fill={`hsl(152, 55%, ${42 + index * 2}%)`} />
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
