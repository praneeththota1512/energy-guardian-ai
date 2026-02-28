import { Zap, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { buildingProfile } from "@/lib/mockData";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-5 lg:px-8 py-3.5 border-b border-border/30 bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <Zap className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            AAEDT
            <span className="text-muted-foreground font-normal text-xs hidden md:inline">
              Energy Digital Twin
            </span>
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
            <Building2 className="w-3 h-3" />
            <span>{buildingProfile.name}</span>
            <span className="text-border">•</span>
            <span>{buildingProfile.type}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
          <span>ONLINE</span>
        </div>
        
        <motion.div 
          className="px-2.5 py-1 rounded-md bg-primary/8 border border-primary/15 text-primary text-[10px] font-mono font-medium tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          LIVE
        </motion.div>
      </div>
    </header>
  );
};

export default DashboardHeader;
