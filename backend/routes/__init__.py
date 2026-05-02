# filepath: backend/routes/__init__.py
from .shipments import router as shipments_router
from .alerts import router as alerts_router
from .optimization import router as optimization_router

__all__ = [
    "shipments_router",
    "alerts_router", 
    "optimization_router",
]