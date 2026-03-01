from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import datetime
import random
from app.ml.ml_engine import predict_usage, detect_anomaly, classify_risk

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# ==========================================
# Dynamic Data Logic
# ==========================================

def get_dynamic_metrics():
    now = datetime.datetime.now()
    hour = now.hour
    
    # Simulate a realistic temperature based on time of day
    temp_base = 22.0
    temp_variation = 5.0 * (1.0 - abs(hour - 14) / 12) # Peak at 2pm
    temperature = round(temp_base + temp_variation + random.uniform(-0.5, 0.5), 1)
    
    # Get ML predictions for current state
    predictions = predict_usage(hour, temperature)
    expected_kwh = predictions["predicted_electricity_kwh"]
    
    # Add some "live" noise to simulate real-time sensor jitter
    noise = random.uniform(-0.8, 1.2)
    current_usage = round(max(0, expected_kwh + noise), 1)
    
    # Run anomaly detection
    # We'll use a fixed water value for now as we don't have a sensor for it
    water_liters = predictions["predicted_water_liters"]
    anomaly_result = detect_anomaly(current_usage, water_liters, temperature, hour)
    
    # Calculate derived stats
    daily_total = round(expected_kwh * (hour + 1) * 0.9, 1) # Approximation
    cost_today = round(daily_total * 0.15, 2)
    carbon_today = round(daily_total * 0.3, 1)
    
    return {
        "currentUsage": current_usage,
        "dailyTotal": daily_total,
        "monthlyTotal": 4235,
        "peakDemand": round(current_usage * 1.4, 1),
        "riskScore": anomaly_result["waste_risk_score"],
        "temperature": temperature,
        "humidity": 65,
        "occupancy": 78 if 8 <= hour <= 18 else 10,
        "efficiency": 100 - anomaly_result["waste_risk_score"] // 5,
        "costToday": cost_today,
        "costMonth": 634.50,
        "carbonToday": carbon_today,
        "carbonMonth": 1270,
        "treesEquivalent": int(carbon_today / 4),
        "savingsMonth": 156.30,
        "savingsPercent": 19.7,
    }

def generate_dynamic_time_series(hours: int = 24):
    data = []
    now = datetime.datetime.now()
    
    for i in range(hours, -1, -1):
        time_val = now - datetime.timedelta(hours=i)
        h = time_val.hour
        
        # Consistent temp for the historical hour
        t_base = 22.0
        t_var = 5.0 * (1.0 - abs(h - 14) / 12)
        temp = t_base + t_var
        
        # Call ML for "Expected" (The learned DNA)
        pred = predict_usage(h, temp)
        expected = pred["predicted_electricity_kwh"]
        
        # Actual load = ML + random noise
        # Occasionally inject an anomaly (e.g., 5% chance)
        is_anomaly_window = random.random() < 0.05
        noise_mult = 2.5 if is_anomaly_window else 1.0
        noise = (random.random() - 0.3) * 2 * noise_mult
        actual = max(0, round(expected + noise, 1))
        
        data.append({
            "time": time_val.strftime("%I:%M %p"),
            "hour": f"{h}:00",
            "actual": actual,
            "expected": round(expected, 1),
            "timestamp": time_val.isoformat() + "Z"
        })
    return data

def get_dynamic_alerts():
    now = datetime.datetime.now()
    hour = now.hour
    
    # Static but could be dynamic based on the actual vs expected diffs
    return [
        { "id": 1, "type": "info", "message": f"System checking baseline at {hour}:00", "time": "Just now", "severity": "low" },
        { "id": 2, "type": "warning", "message": "HVAC Load slightly elevated in Zone B", "time": "5 min ago", "severity": "medium" },
    ]

# ==========================================
# API Routes
# ==========================================

@router.get("/metrics/current")
def get_current_metrics():
    return get_dynamic_metrics()

@router.get("/metrics/timeseries")
def get_timeseries_data(hours: int = 24):
    return generate_dynamic_time_series(hours)

@router.get("/alerts")
def get_alerts():
    return get_dynamic_alerts()

@router.get("/zones")
def get_zones():
    # Use static zones but could be derived from architecture
    return [
        { "zone": "Floor 1 — Lobby", "usage": 42, "capacity": 60, "status": "normal", "system": "Lighting", "occupancy": 34 },
        { "zone": "Floor 2 — Office", "usage": 38, "capacity": 55, "status": "normal", "system": "HVAC", "occupancy": 72 },
    ]

@router.get("/workflow")
def get_workflow():
    return [
        { "step": 1, "label": "Data Collection", "status": "active", "detail": "Live" },
        { "step": 2, "label": "ML Inference", "status": "active", "detail": "Running" },
        { "step": 3, "label": "Anomaly Check", "status": "active", "detail": "Isolation Forest Active" },
        { "step": 4, "label": "DNA Matching", "status": "active", "detail": "Normal" },
    ]
