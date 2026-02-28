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

  const results = useMemo(() => {
    const totalSavings = simulationPresets.reduce((sum, preset) => {
      const ratio = values[preset.key] / 100;
      return sum + preset.maxSaving * ratio;
    }, 0);
    const totalCarbon = simulationPresets.reduce((sum, preset) => {
      const ratio = values[preset.key] / 100;
      return sum + preset.maxCarbon * ratio;
    }, 0);
    return {
      energySaved: totalSavings.toFixed(1),
      costSaved: (totalSavings * 0.15).toFixed(2),
      carbonReduced: totalCarbon.toFixed(1),
    };
  }, [values]);

  const handleReset = () => {
    setValues(Object.fromEntries(simulationPresets.map(p => [p.key, p.defaultValue])));
    setSimulated(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card gradient-border p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Digital Twin Simulation</h2>
            <p className="text-xs text-muted-foreground font-mono">What-if scenario modeling</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {simulationPresets.map((preset) => (
          <div key={preset.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">{preset.label}</span>
              <span className="text-xs font-mono text-primary">
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

      <div className="flex gap-2 mt-5">
        <Button 
          className="flex-1 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs font-mono"
          onClick={() => setSimulated(true)}
        >
          <Play className="w-3 h-3 mr-1.5" />
          SIMULATE
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="border-border/50 text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {simulated && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20"
        >
          <p className="text-[10px] font-mono text-accent tracking-wider mb-2">PROJECTED IMPACT</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-accent">{results.energySaved}</p>
              <p className="text-[10px] text-muted-foreground">kWh saved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-primary">${results.costSaved}</p>
              <p className="text-[10px] text-muted-foreground">cost saved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-mono text-chart-4">{results.carbonReduced}</p>
              <p className="text-[10px] text-muted-foreground">kg CO₂</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DigitalTwinSimulation;
