import { motion } from "framer-motion";
import { fetchCurrentMetrics, fetchAnomalyDetection } from "@/lib/api";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { generateRiskHistory } from "@/lib/mockData";

const WasteRiskMeter = () => {
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const [mlRiskScore, setMlRiskScore] = useState<number | null>(null);
  const [mlLabel, setMlLabel] = useState<string>("");
  const riskHistory = useMemo(() => generateRiskHistory(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await fetchCurrentMetrics();
        setCurrentMetrics(metrics);

        const hour = new Date().getHours();
        const temperature = metrics?.temperature ?? 23.5;
        const electricityKwh = metrics?.currentUsage ?? 18.7;
        const waterLiters = 10.0; // This was hardcoded before, keeping it for now

        try {
          const result = await fetchAnomalyDetection(electricityKwh, waterLiters, temperature, hour);
          setMlRiskScore(result.waste_risk_score);
          setMlLabel(result.is_anomaly ? "⚠️ ANOMALY" : "NORMAL");
        } catch (anomalyError) {
          console.error("Anomaly Detection failed:", anomalyError);
          setMlRiskScore(metrics?.riskScore ?? 42);
          setMlLabel("FALLBACK");
        }
      } catch (metricsError) {
        console.error("Failed to fetch current metrics:", metricsError);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!currentMetrics || mlRiskScore === null) return null;

  const risk = mlRiskScore;

  const getColor = (score: number) => {
    if (score < 30) return { color: 'hsl(152, 55%, 48%)', label: 'LOW RISK', class: 'text-accent' };
    if (score < 60) return { color: 'hsl(34, 80%, 52%)', label: mlLabel || 'MODERATE', class: 'text-warning' };
    return { color: 'hsl(4, 65%, 52%)', label: mlLabel || 'HIGH RISK', class: 'text-destructive' };
  };

  const { color, label, class: textClass } = getColor(risk);
  const circumference = 2 * Math.PI * 70;
  const progress = (risk / 100) * circumference * 0.75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 rounded-md bg-warning/8 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        </div>
        <div>
          <h2 className="section-title">Waste Risk Index</h2>
          <p className="section-subtitle">ML-powered · Isolation Forest</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-1">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(222, 14%, 12%)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} />
            <motion.circle
              cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeDashoffset={circumference * 0.75 - progress}
              initial={{ strokeDashoffset: circumference * 0.75 }}
              animate={{ strokeDashoffset: circumference * 0.75 - progress }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-3xl font-bold font-mono ${textClass}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {risk}
            </motion.span>
            <span className="text-[9px] font-mono text-muted-foreground tracking-widest mt-0.5">{label}</span>
          </div>
        </div>

        <div className="w-full mt-2">
          <p className="text-[10px] text-muted-foreground font-mono mb-1 tracking-wider">RISK TREND (1HR)</p>
          <div className="h-10">
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
