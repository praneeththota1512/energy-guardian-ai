import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import LiveEnergyPanel from "@/components/dashboard/LiveEnergyPanel";
import WasteRiskMeter from "@/components/dashboard/WasteRiskMeter";
import EnergyDNAChart from "@/components/dashboard/EnergyDNAChart";
import DigitalTwinSimulation from "@/components/dashboard/DigitalTwinSimulation";
import SustainabilityImpact from "@/components/dashboard/SustainabilityImpact";
import AlertsAndZones from "@/components/dashboard/AlertsAndZones";
import WorkflowStatus from "@/components/dashboard/WorkflowStatus";
import { useState, useEffect } from "react";
import { fetchCurrentMetrics } from "@/lib/api";
import { Zap, DollarSign, Thermometer, Users } from "lucide-react";

const Index = () => {
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      fetchCurrentMetrics().then(setCurrentMetrics).catch(console.error);
    };

    loadData();
    const interval = setInterval(loadData, 15000); // 15s polling

    return () => clearInterval(interval);
  }, []);

  if (!currentMetrics) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <DashboardHeader />

      <main className="p-4 lg:p-6 max-w-[1480px] mx-auto space-y-4">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Current Load"
            value={currentMetrics.currentUsage}
            unit="kWh"
            icon={Zap}
            variant="primary"
            trend={{ value: 5.2, positive: false }}
            delay={0}
          />
          <MetricCard
            label="Cost Today"
            value={`$${currentMetrics.costToday}`}
            icon={DollarSign}
            variant="accent"
            trend={{ value: 12.3, positive: true }}
            delay={0.05}
          />
          <MetricCard
            label="Temperature"
            value={currentMetrics.temperature}
            unit="°C"
            icon={Thermometer}
            variant="warning"
            delay={0.1}
          />
          <MetricCard
            label="Occupancy"
            value={currentMetrics.occupancy}
            unit="%"
            icon={Users}
            variant="default"
            trend={{ value: 3.1, positive: true }}
            delay={0.15}
          />
        </div>

        {/* Live Energy + Risk Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LiveEnergyPanel />
          <WasteRiskMeter />
        </div>

        {/* Energy DNA */}
        <EnergyDNAChart />

        {/* Simulation + Sustainability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DigitalTwinSimulation />
          <SustainabilityImpact />
        </div>

        {/* Alerts + Zones */}
        <AlertsAndZones />

        {/* Workflow Pipeline */}
        <WorkflowStatus />
      </main>
    </div>
  );
};

export default Index;
