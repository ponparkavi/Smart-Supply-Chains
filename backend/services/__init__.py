"""
PulseChain Services Module
Centralized service initialization to ensure singleton pattern and data consistency
"""

from .alert_service import AlertService
from .shipment_service import ShipmentService
from .optimization_service import OptimizationService

# Initialize singleton services
# Alert service must be initialized first (ShipmentService depends on it)
alert_service = AlertService()

# Shipment service depends on alert service
shipment_service = ShipmentService(alert_service)

# Optimization service is independent
optimization_service = OptimizationService()

__all__ = [
    "alert_service",
    "shipment_service",
    "optimization_service",
    "ShipmentService",
    "AlertService",
    "OptimizationService",
]