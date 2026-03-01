from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict

router = APIRouter(prefix="/simulation", tags=["simulation"])

class SimulationRequest(BaseModel):
    parameters: Dict[str, float]

class SimulationResponse(BaseModel):
    energySaved: str
    costSaved: str
    carbonReduced: str

PRESETS = {
    'hvac': {'maxSaving': 8.5, 'maxCarbon': 2.5},
    'lighting': {'maxSaving': 4.2, 'maxCarbon': 1.3},
    'peak': {'maxSaving': 6.1, 'maxCarbon': 1.8},
    'equipment': {'maxSaving': 5.7, 'maxCarbon': 1.7},
}

@router.post("/run", response_model=SimulationResponse)
def run_simulation(request: SimulationRequest):
    total_savings = 0.0
    total_carbon = 0.0
    for key, value in request.parameters.items():
        if key in PRESETS:
            ratio = value / 100.0
            total_savings += PRESETS[key]['maxSaving'] * ratio
            total_carbon += PRESETS[key]['maxCarbon'] * ratio
            
    return SimulationResponse(
        energySaved=f"{total_savings:.1f}",
        costSaved=f"{(total_savings * 0.15):.2f}",
        carbonReduced=f"{total_carbon:.1f}"
    )
