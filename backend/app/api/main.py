from fastapi import APIRouter
from app.api.routes import dashboard, simulation, ml

api_router = APIRouter()
api_router.include_router(dashboard.router)
api_router.include_router(simulation.router)
api_router.include_router(ml.router)
