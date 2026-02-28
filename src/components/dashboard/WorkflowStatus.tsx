import { motion } from "framer-motion";
import { workflowSteps } from "@/lib/mockData";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  active: 'bg-accent text-accent-foreground',
  ready: 'bg-primary/15 text-primary',
  idle: 'bg-muted text-muted-foreground',
};

const WorkflowStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.85 }}
      className="glass-card p-5 col-span-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-md bg-chart-4/10 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-chart-4" />
        </div>
        <div>
          <h2 className="section-title">System Workflow Pipeline</h2>
          <p className="section-subtitle">9-step autonomous governance loop</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {workflowSteps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.05 }}
            className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2 min-w-0"
          >
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0",
              statusColors[step.status]
            )}>
              {step.step}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">{step.label}</p>
              <p className="text-[9px] font-mono text-muted-foreground truncate">{step.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkflowStatus;
