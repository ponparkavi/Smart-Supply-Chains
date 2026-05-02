# filepath: backend/models/alert.py
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime


class AlertSeverity(str, Enum):
    """Alert severity levels"""
    LOW = "Low"
    MEDIUM = "Medium"
    CRITICAL = "Critical"


class AlertBase(BaseModel):
    """Base alert fields"""
    shipment_id: str = Field(..., description="ID of the related shipment")
    message: str = Field(..., description="Alert message")
    severity: AlertSeverity = Field(..., description="Alert severity level")


class AlertCreate(AlertBase):
    """Schema for creating a new alert"""
    pass


class Alert(BaseModel):
    """Full alert schema"""
    id: str
    shipment_id: str
    message: str
    severity: AlertSeverity
    timestamp: datetime
    
    class Config:
        use_enum_values = True