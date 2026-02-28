import { motion } from "framer-motion";
import { currentMetrics, generateRiskHistory } from "@/lib/mockData";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const WasteRiskMeter = () => {
  const risk = currentMetrics.riskScore;
  const riskHistory = useMemo(() => generateRiskHistory(), []);
  
  const getColor = (score: number) => {
    if (score < 30) return { color: 'hsl(160, 70%, 45%)', label: 'LOW RISK', class: 'text-accent' };
    if (score < 60) return { color: 'hsl(38, 92%, 55%)', label: 'MODERATE', class: 'text-warning' };
    return { color: 'hsl(0, 72%, 55%)', label: 'HIGH RISK', class: 'text-destructive' };
  };
  
  const { color, label, class: textClass } = getColor(risk);
  const circumference = 2 * Math.PI * 70;
  const progress = (risk / 100) * circumference * 0.75; // 270 degree arc

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card gradient-border p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-warning" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Waste Risk Index</h2>
          <p className="text-xs text-muted-foreground font-mono">AI-powered assessment</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-2">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(220, 15%, 15%)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} />
            <motion.circle 
              cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeDashoffset={circumference * 0.75 - progress}
              initial={{ strokeDashoffset: circumference * 0.75 }}
              animate={{ strokeDashoffset: circumference * 0.75 - progress }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`text-4xl font-bold font-mono ${textClass}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {risk}
            </motion.span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest mt-1">{label}</span>
          </div>
        </div>

        <div className="w-full mt-3">
          <p className="text-[10px] text-muted-foreground font-mono mb-1 tracking-wider">RISK TREND (1HR)</p>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskHistory}>
                <YAxis domain={[0, 100]} hide />
                <Line type="monotone" dataKey="risk" stroke={color} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WasteRiskMeter;
