# filepath: backend/models/shipment.py
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ShipmentStatus(str, Enum):
    """Shipment status options"""
    ON_TIME = "On Time"
    AT_RISK = "At Risk"
    DELAYED = "Delayed"


class RiskLevel(str, Enum):
    """Risk level options"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class ShipmentBase(BaseModel):
    """Base shipment fields"""
    origin: str = Field(..., description="Origin location")
    destination: str = Field(..., description="Destination location")
    current_location: str = Field(..., description="Current location of shipment")
    eta: str = Field(..., description="Estimated time of arrival")
    carrier: Optional[str] = Field(default="Unknown", description="Carrier name")
    weight: Optional[str] = Field(default="N/A", description="Shipment weight")


class ShipmentCreate(BaseModel):
    """Schema for creating a new shipment"""
    id: str = Field(..., description="Unique shipment ID")
    origin: str = Field(..., description="Origin location")
    destination: str = Field(..., description="Destination location")
    current_location: str = Field(..., description="Current location of shipment")
    eta: str = Field(..., description="Estimated time of arrival")
    carrier: Optional[str] = Field(default="Unknown", description="Carrier name")
    weight: Optional[str] = Field(default="N/A", description="Shipment weight")


class ShipmentUpdate(BaseModel):
    """Schema for updating a shipment"""
    current_location: Optional[str] = None
    status: Optional[ShipmentStatus] = None
    risk_level: Optional[RiskLevel] = None
    eta: Optional[str] = None
    carrier: Optional[str] = None
    weight: Optional[str] = None


class Shipment(ShipmentBase):
    """Full shipment schema"""
    id: str
    status: ShipmentStatus = ShipmentStatus.ON_TIME
    risk_level: RiskLevel = RiskLevel.LOW
    
    class Config:
        use_enum_values = True