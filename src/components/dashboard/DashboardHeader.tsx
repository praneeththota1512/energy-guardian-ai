import { Activity, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 glass-card rounded-none border-x-0 border-t-0">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 glow-primary">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            <span className="text-primary text-glow-primary">AAEDT</span>
            <span className="ml-2 text-muted-foreground font-normal text-sm hidden sm:inline">
              Adaptive Autonomous Energy Digital Twin
            </span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent pulse-dot" />
          <span>SYSTEM ONLINE</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>24/7 MONITORING</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span>AI GOVERNANCE</span>
          </div>
        </div>
        
        <motion.div 
          className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-mono"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          LIVE
        </motion.div>
      </div>
    </header>
  );
};

export default DashboardHeader;
