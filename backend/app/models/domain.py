import uuid
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, 
    DateTime, ForeignKey, Enum, UUID
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# ----------------------------------------------------
# 🏗️ Core Infrastructure Domain
# ----------------------------------------------------

class Building(Base):
    __tablename__ = "buildings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    total_area_sqm = Column(Float, nullable=False)
    timezone = Column(String, default="UTC")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    zones = relationship("Zone", back_populates="building")


class Zone(Base):
    __tablename__ = "zones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    building_id = Column(UUID(as_uuid=True), ForeignKey('buildings.id'), nullable=False)
    name = Column(String, nullable=False)
    criticality_level = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    base_load_kwh = Column(Float, default=0.0)

    building = relationship("Building", back_populates="zones")
    assets = relationship("Asset", back_populates="zone")
    anomalies = relationship("AnomalyEvent", back_populates="zone")
    dna_profiles = relationship("EnergyDNAProfile", back_populates="zone")


class Asset(Base):
    __tablename__ = "assets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey('zones.id'), nullable=False)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # HVAC, LIGHTING, IT
    is_curtailable = Column(Boolean, default=True)

    zone = relationship("Zone", back_populates="assets")
    telemetry = relationship("TelemetryReading", back_populates="asset")
    simulated_actions = relationship("SimulatedAction", back_populates="target_asset")


# ----------------------------------------------------
# ⚡️ Telemetry & Time-Series Domain
# ----------------------------------------------------

class TelemetryReading(Base):
    __tablename__ = "telemetry_readings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey('assets.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    energy_kwh = Column(Float, nullable=False)
    power_kw = Column(Float, nullable=False)
    is_synthetic = Column(Boolean, default=True) # Flag for simulated vs real data

    asset = relationship("Asset", back_populates="telemetry")


# ----------------------------------------------------
# 🧠 Intelligence & Energy DNA Domain
# ----------------------------------------------------

class EnergyDNAProfile(Base):
    __tablename__ = "energy_dna_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey('zones.id'), nullable=False)
    day_of_week = Column(Integer, nullable=False) # 1-7
    hour_of_day = Column(Integer, nullable=False) # 0-23
    expected_mean_kwh = Column(Float, nullable=False)
    upper_tolerance_kwh = Column(Float, nullable=False)
    lower_tolerance_kwh = Column(Float, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    zone = relationship("Zone", back_populates="dna_profiles")


# ----------------------------------------------------
# 🚨 Governance & Risk Domain
# ----------------------------------------------------

class AnomalyEvent(Base):
    __tablename__ = "anomaly_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey('zones.id'), nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)
    deviation_percentage = Column(Float, nullable=False) 
    waste_risk_score = Column(Integer, nullable=False) # 0-100
    status = Column(String, nullable=False, default="DETECTED") # DETECTED, SIMULATING, MITIGATED
    projected_waste_kwh = Column(Float, nullable=False)

    zone = relationship("Zone", back_populates="anomalies")
    actions = relationship("SimulatedAction", back_populates="anomaly")


# ----------------------------------------------------
# 🎛️ Simulation & Digital Twin Domain
# ----------------------------------------------------

class SimulatedAction(Base):
    __tablename__ = "simulated_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    anomaly_event_id = Column(UUID(as_uuid=True), ForeignKey('anomaly_events.id'), nullable=False)
    target_asset_id = Column(UUID(as_uuid=True), ForeignKey('assets.id'), nullable=False)
    action_type = Column(String, nullable=False) # LOAD_SHIFT, CURTAILMENT
    simulated_savings_kwh = Column(Float, nullable=False)
    simulated_carbon_reduction_kg = Column(Float, nullable=False)
    was_executed = Column(Boolean, default=False)

    anomaly = relationship("AnomalyEvent", back_populates="actions")
    target_asset = relationship("Asset", back_populates="simulated_actions")
