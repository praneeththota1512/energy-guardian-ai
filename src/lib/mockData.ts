// Simulated energy data for the AAEDT dashboard
// Building Profile: Commercial Office Complex — 4 floors, ~12,000 sqft

export const buildingProfile = {
  name: "Nexus Tower — Block A",
  type: "Commercial Office Complex",
  floors: 4,
  area: "12,400 sqft",
  occupants: 186,
  systems: ["HVAC Central", "Smart Lighting", "Water Heating", "EV Charging"],
  location: "Downtown Business District",
  buildYear: 2019,
};

export const generateTimeSeriesData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    const baseLoad = 8;
    const timeMultiplier = hour >= 8 && hour <= 18 ? 2.5 : hour >= 6 && hour <= 20 ? 1.5 : 1;
    const noise = (Math.random() - 0.5) * 3;
    const actual = baseLoad * timeMultiplier + noise;
    const expected = baseLoad * timeMultiplier;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hour: `${hour}:00`,
      actual: Math.max(0, parseFloat(actual.toFixed(1))),
      expected: parseFloat(expected.toFixed(1)),
      timestamp: time.toISOString(),
    });
  }
  return data;
};

export const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    consumption: parseFloat((150 + Math.random() * 80).toFixed(1)),
    savings: parseFloat((10 + Math.random() * 25).toFixed(1)),
    carbon: parseFloat((45 + Math.random() * 30).toFixed(1)),
  }));
};

export const generateRiskHistory = () => {
  const data = [];
  for (let i = 12; i >= 0; i--) {
    const time = new Date(Date.now() - i * 5 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      risk: Math.min(100, Math.max(0, 30 + Math.sin(i * 0.5) * 25 + (Math.random() - 0.5) * 15)),
    });
  }
  return data;
};

export const currentMetrics = {
  currentUsage: 18.7,
  dailyTotal: 187.4,
  monthlyTotal: 4235,
  peakDemand: 34.2,
  riskScore: 42,
  temperature: 23.5,
  humidity: 65,
  occupancy: 78,
  efficiency: 87,
  costToday: 28.40,
  costMonth: 634.50,
  carbonToday: 56.2,
  carbonMonth: 1270,
  treesEquivalent: 14,
  savingsMonth: 156.30,
  savingsPercent: 19.7,
};

export const alerts = [
  { id: 1, type: 'warning' as const, message: 'HVAC Zone B exceeding baseline by 23%', time: '2 min ago', severity: 'medium' },
  { id: 2, type: 'info' as const, message: 'Peak demand window approaching (14:00–16:00)', time: '15 min ago', severity: 'low' },
  { id: 3, type: 'success' as const, message: 'Lighting optimization saved 4.2 kWh on Floor 2', time: '1 hr ago', severity: 'low' },
  { id: 4, type: 'danger' as const, message: 'Water heater anomaly detected — Floor 3 Panel C', time: '3 hr ago', severity: 'high' },
];

export const simulationPresets = [
  { label: 'HVAC Reduction', key: 'hvac', defaultValue: 20, unit: '%', maxSaving: 8.5, maxCarbon: 2.5 },
  { label: 'Lighting Optimization', key: 'lighting', defaultValue: 15, unit: '%', maxSaving: 4.2, maxCarbon: 1.3 },
  { label: 'Peak Load Shift', key: 'peak', defaultValue: 30, unit: 'min', maxSaving: 6.1, maxCarbon: 1.8 },
  { label: 'Equipment Scheduling', key: 'equipment', defaultValue: 10, unit: '%', maxSaving: 5.7, maxCarbon: 1.7 },
];

// Zone data adapted to building environment
export const zoneData = [
  { zone: 'Floor 1 — Lobby & Reception', usage: 42, capacity: 60, status: 'normal' as const, system: 'Lighting + HVAC', occupancy: 34 },
  { zone: 'Floor 2 — Open Office', usage: 38, capacity: 55, status: 'normal' as const, system: 'Lighting + HVAC + Equipment', occupancy: 72 },
  { zone: 'Floor 3 — Executive Suites', usage: 67, capacity: 50, status: 'warning' as const, system: 'HVAC + Water Heater', occupancy: 45 },
  { zone: 'Floor 4 — Data Center', usage: 31, capacity: 85, status: 'normal' as const, system: 'Cooling + UPS', occupancy: 8 },
  { zone: 'HVAC Central — Rooftop', usage: 89, capacity: 100, status: 'critical' as const, system: 'Chiller + AHU', occupancy: 0 },
  { zone: 'HVAC — East Wing', usage: 55, capacity: 70, status: 'warning' as const, system: 'Split AC Units', occupancy: 52 },
  { zone: 'Parking — EV Charging', usage: 22, capacity: 40, status: 'optimal' as const, system: 'EV Chargers', occupancy: 15 },
  { zone: 'Basement — Water Systems', usage: 45, capacity: 60, status: 'normal' as const, system: 'Boiler + Pumps', occupancy: 0 },
];

// Workflow step statuses (maps to the 9-step flow)
export const workflowSteps = [
  { step: 1, label: 'Data Collection', status: 'active' as const, detail: 'Receiving meter readings' },
  { step: 2, label: 'Data Processing', status: 'active' as const, detail: 'Feature extraction running' },
  { step: 3, label: 'Energy DNA Modeling', status: 'active' as const, detail: 'Baseline learned' },
  { step: 4, label: 'Real-Time Monitoring', status: 'active' as const, detail: 'Comparing against baseline' },
  { step: 5, label: 'Waste Risk Index', status: 'active' as const, detail: 'Score: 42 — Moderate' },
  { step: 6, label: 'Digital Twin Simulation', status: 'ready' as const, detail: 'Awaiting user input' },
  { step: 7, label: 'Optimization Decision', status: 'ready' as const, detail: 'Governance logic loaded' },
  { step: 8, label: 'Impact Measurement', status: 'active' as const, detail: 'Tracking savings' },
  { step: 9, label: 'Continuous Learning', status: 'active' as const, detail: 'Model updating' },
];
