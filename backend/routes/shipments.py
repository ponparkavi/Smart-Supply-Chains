# filepath: backend/routes/shipments.py
"""
Shipment API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List

from backend.models.shipment import Shipment, ShipmentCreate, ShipmentUpdate
from backend.services import shipment_service

router = APIRouter(prefix="/shipments", tags=["Shipments"])


def get_shipment_service():
    """Dependency to get shared shipment service"""
    return shipment_service


@router.get("", response_model=List[Shipment])
def get_shipments(service=Depends(get_shipment_service)):
    """
    Get all shipments
    
    Returns:
        List of all shipments in the system
    """
    return service.get_all()


@router.post("", response_model=Shipment, status_code=201)
def create_shipment(
    shipment_data: ShipmentCreate,
    service=Depends(get_shipment_service)
):
    """
    Create a new shipment
    
    Args:
        shipment_data: Shipment creation data
        
    Returns:
        Created shipment
    """
    # Check if shipment already exists
    existing = service.get_by_id(shipment_data.id)
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Shipment with ID {shipment_data.id} already exists"
        )
    
    return service.create(shipment_data)


@router.get("/{shipment_id}", response_model=Shipment)
def get_shipment(
    shipment_id: str,
    service=Depends(get_shipment_service)
):
    """
    Get a single shipment by ID
    
    Args:
        shipment_id: ID of the shipment to retrieve
        
    Returns:
        Shipment details
        
    Raises:
        HTTPException: 404 if shipment not found
    """
    shipment = service.get_by_id(shipment_id)
    if not shipment:
        raise HTTPException(
            status_code=404,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    return shipment


@router.put("/{shipment_id}", response_model=Shipment)
def update_shipment(
    shipment_id: str,
    update_data: ShipmentUpdate,
    service=Depends(get_shipment_service)
):
    """
    Update a shipment
    
    Args:
        shipment_id: ID of the shipment to update
        update_data: Fields to update
        
    Returns:
        Updated shipment
        
    Raises:
        HTTPException: 404 if shipment not found
    """
    shipment = service.update(shipment_id, update_data)
    if not shipment:
        raise HTTPException(
            status_code=404,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    return shipment


@router.delete("/{shipment_id}", status_code=204)
def delete_shipment(
    shipment_id: str,
    service=Depends(get_shipment_service)
):
    """
    Delete a shipment
    
    Args:
        shipment_id: ID of the shipment to delete
        
    Returns:
        204 No Content on success
        
    Raises:
        HTTPException: 404 if shipment not found
    """
    success = service.delete(shipment_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    return None