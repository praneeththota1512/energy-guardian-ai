"""
ML Engine — Loads and serves the 5 trained pkl models.

Models trained on hourly energy/water data with features:
  - Temperature (°C)
  - Hour of day (0-23)

Models:
  reg_elec.pkl   → Predicts electricity usage (kWh)
  reg_water.pkl  → Predicts water usage (Liters)
  clf_elec.pkl   → Classifies electricity risk: Low/Medium/High
  clf_water.pkl  → Classifies water risk: Low/Medium/High
  iso_forest.pkl → Isolation Forest anomaly detector
"""

import os
import joblib
import numpy as np

# ─────────────────────────────────────────────
# Model file paths
# ─────────────────────────────────────────────
_ML_DIR = os.path.dirname(__file__)

def _load(filename: str):
    path = os.path.join(_ML_DIR, filename)
    return joblib.load(path)

# Load all models once at startup
reg_elec   = _load("reg_elec.pkl")
reg_water  = _load("reg_water.pkl")
clf_elec   = _load("clf_elec.pkl")
clf_water  = _load("clf_water.pkl")
iso_forest = _load("iso_forest.pkl")

# ─────────────────────────────────────────────
# Feature builder
# ─────────────────────────────────────────────
def _features(hour: int, temperature: float) -> np.ndarray:
    """Build the feature vector the models expect: [hour, temperature]"""
    return np.array([[hour, temperature]])

# ─────────────────────────────────────────────
# Public prediction functions
# ─────────────────────────────────────────────

def predict_usage(hour: int, temperature: float) -> dict:
    """Predict electricity (kWh) and water (Liters) usage."""
    X = _features(hour, temperature)
    elec  = float(reg_elec.predict(X)[0])
    water = float(reg_water.predict(X)[0])
    return {
        "predicted_electricity_kwh": round(max(0, elec), 2),
        "predicted_water_liters":    round(max(0, water), 2),
    }


def classify_risk(hour: int, temperature: float) -> dict:
    """Classify electricity and water risk levels."""
    X = _features(hour, temperature)
    elec_risk_raw  = clf_elec.predict(X)[0]
    water_risk_raw = clf_water.predict(X)[0]

    # Map numeric labels (0, 1, 2) to string labels and scores
    # Mapping based on common pattern: 0=Low, 1=Medium, 2=High
    label_map = {0: "Low", 1: "Medium", 2: "High"}
    score_map = {0: 20, 1: 55, 2: 85}
    
    # Try to handle string inputs too just in case
    def get_info(raw):
        # Convert string to int if it's a numeric string
        val = raw
        if isinstance(raw, str) and raw.isdigit():
            val = int(raw)
        
        label = label_map.get(val, str(raw))
        score = score_map.get(val, 50)
        return label, score

    elec_label, elec_score = get_info(elec_risk_raw)
    water_label, water_score = get_info(water_risk_raw)
    combined_risk_score = int((elec_score + water_score) / 2)

    return {
        "electricity_risk_label": elec_label,
        "water_risk_label":       water_label,
        "electricity_risk_score": elec_score,
        "water_risk_score":       water_score,
        "combined_risk_score":    combined_risk_score,
    }


def detect_anomaly(electricity_kwh: float, water_liters: float,
                   temperature: float, hour: int) -> dict:
    """
    Use Isolation Forest to detect if the current reading is an anomaly.
    Returns is_anomaly (bool) + anomaly_score (float, lower = more anomalous).
    """
    # Fix: User's IsolationForest was likely trained on just [hour, temperature] 
    # based on the error "X has 4 features, but IsolationForest is expecting 2"
    X = _features(hour, temperature)
    pred  = iso_forest.predict(X)      # -1 = anomaly, 1 = normal
    score = iso_forest.decision_function(X)   # higher = more normal

    is_anomaly = bool(pred[0] == -1)
    # Convert score to a 0-100 waste risk score (inverted: anomalous = high)
    waste_risk = int(min(100, max(0, (1 - float(score[0])) * 50)))

    return {
        "is_anomaly":   is_anomaly,
        "anomaly_score": round(float(score[0]), 4),
        "waste_risk_score": waste_risk,
    }

