# filepath: backend/routes/alerts.py
"""
Alert API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List

from backend.models.alert import Alert, AlertCreate
from backend.services import alert_service
from backend.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts"])


def get_alert_service():
    """Dependency to get shared alert service"""
    return alert_service


@router.get("", response_model=List[Alert])
def get_alerts(service=Depends(get_alert_service)):
    """
    Get all alerts
    
    Returns:
        List of all alerts in the system
    """
    return service.get_all()


@router.get("/{alert_id}", response_model=Alert)
def get_alert(
    alert_id: str,
    service=Depends(get_alert_service)
):
    """
    Get a single alert by ID
    
    Args:
        alert_id: ID of the alert to retrieve
        
    Returns:
        Alert details
        
    Raises:
        HTTPException: 404 if alert not found
    """
    alert = service.get_by_id(alert_id)
    if not alert:
        raise HTTPException(
            status_code=404,
            detail=f"Alert with ID {alert_id} not found"
        )
    return alert


@router.get("/shipment/{shipment_id}", response_model=List[Alert])
def get_alerts_by_shipment(
    shipment_id: str,
    service=Depends(get_alert_service)
):
    """
    Get all alerts for a specific shipment
    
    Args:
        shipment_id: ID of the shipment
        
    Returns:
        List of alerts for the shipment
    """
    return service.get_by_shipment_id(shipment_id)


@router.post("", response_model=Alert, status_code=201)
def create_alert(
    alert_data: AlertCreate,
    service=Depends(get_alert_service)
):
    """
    Create a new alert
    
    Args:
        alert_data: Alert creation data
        
    Returns:
        Created alert
    """
    return service.create(alert_data)


@router.delete("/{alert_id}", status_code=204)
def delete_alert(
    alert_id: str,
    service=Depends(get_alert_service)
):
    """
    Delete an alert
    
    Args:
        alert_id: ID of the alert to delete
        
    Returns:
        204 No Content on success
        
    Raises:
        HTTPException: 404 if alert not found
    """
    success = service.delete(alert_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Alert with ID {alert_id} not found"
        )
    return None