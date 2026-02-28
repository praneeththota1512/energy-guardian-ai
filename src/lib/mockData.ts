// Simulated energy data for the AAEDT dashboard

export const generateTimeSeriesData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate realistic building energy pattern
    const baseLoad = 8; // kWh base
    const timeMultiplier = hour >= 8 && hour <= 18 ? 2.5 : hour >= 6 && hour <= 20 ? 1.5 : 1;
    const noise = (Math.random() - 0.5) * 3;
    const actual = baseLoad * timeMultiplier + noise;
    
    // Expected is smoother
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
  { id: 1, type: 'warning' as const, message: 'HVAC Zone B exceeding baseline by 23%', time: '2 min ago' },
  { id: 2, type: 'info' as const, message: 'Peak demand window approaching (14:00-16:00)', time: '15 min ago' },
  { id: 3, type: 'success' as const, message: 'Lighting optimization saved 4.2 kWh', time: '1 hr ago' },
  { id: 4, type: 'danger' as const, message: 'Water heater anomaly detected — Floor 3', time: '3 hr ago' },
];

export const simulationPresets = [
  { label: 'HVAC Reduction', key: 'hvac', defaultValue: 20, unit: '%', maxSaving: 8.5, maxCarbon: 2.5 },
  { label: 'Lighting Optimization', key: 'lighting', defaultValue: 15, unit: '%', maxSaving: 4.2, maxCarbon: 1.3 },
  { label: 'Peak Load Shift', key: 'peak', defaultValue: 30, unit: 'min', maxSaving: 6.1, maxCarbon: 1.8 },
  { label: 'Equipment Scheduling', key: 'equipment', defaultValue: 10, unit: '%', maxSaving: 5.7, maxCarbon: 1.7 },
];

export const zoneData = [
  { zone: 'Floor 1', usage: 42, status: 'normal' as const },
  { zone: 'Floor 2', usage: 38, status: 'normal' as const },
  { zone: 'Floor 3', usage: 67, status: 'warning' as const },
  { zone: 'Floor 4', usage: 31, status: 'normal' as const },
  { zone: 'HVAC-A', usage: 89, status: 'critical' as const },
  { zone: 'HVAC-B', usage: 55, status: 'warning' as const },
  { zone: 'Lighting', usage: 22, status: 'optimal' as const },
  { zone: 'Water', usage: 45, status: 'normal' as const },
];
