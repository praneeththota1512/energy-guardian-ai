// API Client for connecting to the FastAPI backend

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchCurrentMetrics = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics/current`);
    return response.json();
};

export const fetchTimeSeriesData = async (hours: number = 24) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics/timeseries?hours=${hours}`);
    return response.json();
};

export const fetchAlerts = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/alerts`);
    return response.json();
};

export const fetchZones = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/zones`);
    return response.json();
};

export const fetchWorkflow = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/workflow`);
    return response.json();
};

// ─── ML Intelligence Endpoints ───────────────────────────────────────────────

/** Predict electricity (kWh) & water (L) usage + risk classification for given hour & temperature */
export const fetchMLPrediction = async (hour: number, temperature: number) => {
    const response = await fetch(`${API_BASE_URL}/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hour, temperature }),
    });
    return response.json();
};

/** Run Isolation Forest anomaly detection on a live reading */
export const fetchAnomalyDetection = async (
    electricity_kwh: number,
    water_liters: number,
    temperature: number,
    hour: number
) => {
    const response = await fetch(`${API_BASE_URL}/ml/anomaly`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electricity_kwh, water_liters, temperature, hour }),
    });
    return response.json();
};

/** Check that all ML models are loaded on the backend */
export const fetchMLStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/ml/status`);
    return response.json();
};

// Keep the building profile and simulation presets static for now as they are configuration
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

export const simulationPresets = [
    { label: 'HVAC Reduction', key: 'hvac', defaultValue: 20, unit: '%', maxSaving: 8.5, maxCarbon: 2.5 },
    { label: 'Lighting Optimization', key: 'lighting', defaultValue: 15, unit: '%', maxSaving: 4.2, maxCarbon: 1.3 },
    { label: 'Peak Load Shift', key: 'peak', defaultValue: 30, unit: 'min', maxSaving: 6.1, maxCarbon: 1.8 },
    { label: 'Equipment Scheduling', key: 'equipment', defaultValue: 10, unit: '%', maxSaving: 5.7, maxCarbon: 1.7 },
];
