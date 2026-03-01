from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# ==========================================
# Placeholder Data matching Frontend mockData.ts
# ==========================================

current_metrics = {
    "currentUsage": 18.7,
    "dailyTotal": 187.4,
    "monthlyTotal": 4235,
    "peakDemand": 34.2,
    "riskScore": 42,
    "temperature": 23.5,
    "humidity": 65,
    "occupancy": 78,
    "efficiency": 87,
    "costToday": 28.40,
    "costMonth": 634.50,
    "carbonToday": 56.2,
    "carbonMonth": 1270,
    "treesEquivalent": 14,
    "savingsMonth": 156.30,
    "savingsPercent": 19.7,
}

alerts_data = [
    { "id": 1, "type": "warning", "message": "HVAC Zone B exceeding baseline by 23%", "time": "2 min ago", "severity": "medium" },
    { "id": 2, "type": "info", "message": "Peak demand window approaching (14:00–16:00)", "time": "15 min ago", "severity": "low" },
    { "id": 3, "type": "success", "message": "Lighting optimization saved 4.2 kWh on Floor 2", "time": "1 hr ago", "severity": "low" },
    { "id": 4, "type": "danger", "message": "Water heater anomaly detected — Floor 3 Panel C", "time": "3 hr ago", "severity": "high" },
]

zone_data = [
    { "zone": "Floor 1 — Lobby & Reception", "usage": 42, "capacity": 60, "status": "normal", "system": "Lighting + HVAC", "occupancy": 34 },
    { "zone": "Floor 2 — Open Office", "usage": 38, "capacity": 55, "status": "normal", "system": "Lighting + HVAC + Equipment", "occupancy": 72 },
    { "zone": "Floor 3 — Executive Suites", "usage": 67, "capacity": 50, "status": "warning", "system": "HVAC + Water Heater", "occupancy": 45 },
    { "zone": "Floor 4 — Data Center", "usage": 31, "capacity": 85, "status": "normal", "system": "Cooling + UPS", "occupancy": 8 },
    { "zone": "HVAC Central — Rooftop", "usage": 89, "capacity": 100, "status": "critical", "system": "Chiller + AHU", "occupancy": 0 },
    { "zone": "HVAC — East Wing", "usage": 55, "capacity": 70, "status": "warning", "system": "Split AC Units", "occupancy": 52 },
    { "zone": "Parking — EV Charging", "usage": 22, "capacity": 40, "status": "optimal", "system": "EV Chargers", "occupancy": 15 },
    { "zone": "Basement — Water Systems", "usage": 45, "capacity": 60, "status": "normal", "system": "Boiler + Pumps", "occupancy": 0 },
]

workflow_steps = [
  { "step": 1, "label": "Data Collection", "status": "active", "detail": "Receiving meter readings" },
  { "step": 2, "label": "Data Processing", "status": "active", "detail": "Feature extraction running" },
  { "step": 3, "label": "Energy DNA Modeling", "status": "active", "detail": "Baseline learned" },
  { "step": 4, "label": "Real-Time Monitoring", "status": "active", "detail": "Comparing against baseline" },
  { "step": 5, "label": "Waste Risk Index", "status": "active", "detail": "Score: 42 — Moderate" },
  { "step": 6, "label": "Digital Twin Simulation", "status": "ready", "detail": "Awaiting user input" },
  { "step": 7, "label": "Optimization Decision", "status": "ready", "detail": "Governance logic loaded" },
  { "step": 8, "label": "Impact Measurement", "status": "active", "detail": "Tracking savings" },
  { "step": 9, "label": "Continuous Learning", "status": "active", "detail": "Model updating" },
]

# Helper for Time Series
def generate_time_series_data(hours: int = 24):
    import datetime
    import random
    data = []
    now = datetime.datetime.now()
    for i in range(hours, -1, -1):
        time_val = now - datetime.timedelta(hours=i)
        hour = time_val.hour
        baseLoad = 8
        timeMultiplier = 2.5 if 8 <= hour <= 18 else (1.5 if 6 <= hour <= 20 else 1)
        noise = (random.random() - 0.5) * 3
        actual = baseLoad * timeMultiplier + noise
        expected = baseLoad * timeMultiplier
        
        data.append({
            "time": time_val.strftime("%I:%M %p"),
            "hour": f"{hour}:00",
            "actual": max(0, round(actual, 1)),
            "expected": round(expected, 1),
            "timestamp": time_val.isoformat() + "Z"
        })
    return data


# ==========================================
# API Routes
# ==========================================

@router.get("/metrics/current")
def get_current_metrics():
    return current_metrics

@router.get("/metrics/timeseries")
def get_timeseries_data(hours: int = 24):
    return generate_time_series_data(hours)

@router.get("/alerts")
def get_alerts():
    return alerts_data

@router.get("/zones")
def get_zones():
    return zone_data

@router.get("/workflow")
def get_workflow():
    return workflow_steps
