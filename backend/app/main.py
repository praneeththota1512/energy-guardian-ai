from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AAEDT Intelligence Core",
    description="Adaptive Autonomous Energy Digital Twin - Simulation API",
    version="1.0.0"
)

# Allow CORS for development (React Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.main import api_router
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "system": "AAEDT Engine Core",
        "status": "online",
        "modules": [
            "Energy DNA Engine",
            "Anomaly Detection",
            "Waste Risk Calculator",
            "Digital Twin Simulation"
        ]
    }


@app.get("/api/health")
def check_health():
    return {"status": "ok", "message": "Telemetry simulation engine standing by."}

# Run via: uvicorn app.main:app --reload
