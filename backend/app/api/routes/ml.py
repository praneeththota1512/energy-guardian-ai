"""
ML API Routes — exposes the trained models via REST endpoints.

POST /api/ml/predict   → usage prediction (kWh + Liters)
POST /api/ml/anomaly   → anomaly detection + waste risk score
GET  /api/ml/status    → confirms all models are loaded
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.ml.ml_engine import predict_usage, classify_risk, detect_anomaly

router = APIRouter(prefix="/ml", tags=["ML Intelligence"])


# ─────────────────────────────────────────────
# Request / Response Schemas
# ─────────────────────────────────────────────

class PredictRequest(BaseModel):
    hour:        int   = Field(..., ge=0, le=23,  description="Hour of day (0–23)")
    temperature: float = Field(..., ge=-10, le=55, description="Temperature in °C")

class PredictResponse(BaseModel):
    hour:                     int
    temperature:              float
    predicted_electricity_kwh: float
    predicted_water_liters:   float
    electricity_risk_label:   str
    water_risk_label:         str
    electricity_risk_score:   int
    water_risk_score:         int
    combined_risk_score:      int


class AnomalyRequest(BaseModel):
    electricity_kwh: float = Field(..., ge=0,  description="Current electricity reading (kWh)")
    water_liters:    float = Field(..., ge=0,  description="Current water reading (Liters)")
    temperature:     float = Field(..., ge=-10, le=55, description="Temperature in °C")
    hour:            int   = Field(..., ge=0,  le=23,  description="Hour of day (0–23)")

class AnomalyResponse(BaseModel):
    is_anomaly:       bool
    anomaly_score:    float
    waste_risk_score: int
    message:          str


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@router.get("/status")
def get_ml_status():
    """Health check — confirms all 5 models are loaded and ready."""
    return {
        "status": "ready",
        "models_loaded": [
            "reg_elec", "reg_water",
            "clf_elec", "clf_water",
            "iso_forest"
        ],
        "message": "All ML models operational."
    }


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """
    Predict electricity usage (kWh) and water usage (Liters)
    for a given hour and temperature.
    Also returns risk classification for both.
    """
    try:
        usage = predict_usage(request.hour, request.temperature)
        risk  = classify_risk(request.hour, request.temperature)
        return PredictResponse(
            hour=request.hour,
            temperature=request.temperature,
            **usage,
            **risk,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/anomaly", response_model=AnomalyResponse)
def anomaly(request: AnomalyRequest):
    """
    Detect if the current electricity + water reading is anomalous.
    Returns a waste risk score (0–100) and a human-readable message.
    """
    try:
        result = detect_anomaly(
            request.electricity_kwh,
            request.water_liters,
            request.temperature,
            request.hour
        )
        if result["is_anomaly"]:
            msg = (f"⚠️ Anomaly detected! Electricity: {request.electricity_kwh} kWh, "
                   f"Water: {request.water_liters} L — deviates from expected pattern.")
        else:
            msg = "✅ Readings are within normal range. No anomaly detected."

        return AnomalyResponse(
            is_anomaly=result["is_anomaly"],
            anomaly_score=result["anomaly_score"],
            waste_risk_score=result["waste_risk_score"],
            message=msg,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")
