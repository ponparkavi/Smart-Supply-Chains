# filepath: backend/routes/optimization.py
"""
Route optimization API routes
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from backend.services import shipment_service, optimization_service

router = APIRouter(prefix="/optimize", tags=["Optimization"])


@router.post("/{shipment_id}", response_model=Dict[str, Any])
def optimize_route(shipment_id: str):
    """
    Optimize route for a shipment
    
    Args:
        shipment_id: ID of the shipment to optimize
        
    Returns:
        Optimization results with suggested route, time saved, and risk reduction
        
    Raises:
        HTTPException: 404 if shipment not found
    """
    # Get shipment
    shipment = shipment_service.get_by_id(shipment_id)
    if not shipment:
        raise HTTPException(
            status_code=404,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    
    # Run optimization
    result = optimization_service.optimize(shipment)
    return result


@router.get("/routes", response_model=dict)
def get_available_routes():
    """
    Get all available route options
    
    Returns:
        Dictionary of route categories and their options
    """
    from backend.services.optimization_service import OptimizationService
    return {
        "asia_us": OptimizationService.ROUTES["asia_us"],
        "europe_us": OptimizationService.ROUTES["europe_us"],
        "asia_aus": OptimizationService.ROUTES["asia_aus"],
    }