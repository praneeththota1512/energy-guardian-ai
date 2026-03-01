import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { simulationPresets } from "@/lib/mockData";
import { Sliders, Play, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const DigitalTwinSimulation = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(simulationPresets.map(p => [p.key, p.defaultValue]))
  );
  const [simulated, setSimulated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    energySaved: '0.0',
    costSaved: '0.00',
    carbonReduced: '0.0',
  });

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/simulation/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parameters: values }),
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setSimulated(true);
      } else {
        console.error("Failed to run simulation");
      }
    } catch (error) {
      console.error("Error connecting to simulation endpoint:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues(Object.fromEntries(simulationPresets.map(p => [p.key, p.defaultValue])));
    setSimulated(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="section-title">Digital Twin Simulation</h2>
            <p className="section-subtitle">What-if scenario modeling</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {simulationPresets.map((preset) => (
          <div key={preset.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-foreground/80">{preset.label}</span>
              <span className="text-[11px] font-mono text-primary">
                {values[preset.key]}{preset.unit}
              </span>
            </div>
            <Slider
              value={[values[preset.key]]}
              onValueChange={([v]) => {
                setValues(prev => ({ ...prev, [preset.key]: v }));
                setSimulated(false);
              }}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 text-[11px] font-mono"
          onClick={handleSimulate}
          disabled={loading}
        >
          <Play className="w-3 h-3 mr-1.5" />
          {loading ? "SIMULATING..." : "SIMULATE"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-border/40 text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>

      {simulated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/15"
        >
          <p className="text-[9px] font-mono text-accent tracking-widest mb-2">PROJECTED IMPACT</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-base font-bold font-mono text-accent">{results.energySaved}</p>
              <p className="text-[9px] text-muted-foreground font-mono">kWh saved</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold font-mono text-primary">${results.costSaved}</p>
              <p className="text-[9px] text-muted-foreground font-mono">cost saved</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold font-mono text-chart-4">{results.carbonReduced}</p>
              <p className="text-[9px] text-muted-foreground font-mono">kg CO₂</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DigitalTwinSimulation;
