# filepath: backend/services/shipment_service.py
"""
Shipment service - handles shipment business logic and in-memory storage
"""
from typing import List, Optional
from datetime import datetime
import uuid

from backend.models.shipment import Shipment, ShipmentCreate, ShipmentUpdate, ShipmentStatus, RiskLevel
from backend.services.alert_service import AlertService


class ShipmentService:
    """Service for managing shipments in memory"""

    def __init__(self, alert_service: AlertService):
        self._shipments: dict[str, Shipment] = {}
        self._alert_service = alert_service
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Add sample shipments for testing"""
        sample_shipments = [
            Shipment(
                id="SHP001",
                origin="Shanghai, China",
                destination="Los Angeles, USA",
                current_location="Pacific Ocean",
                status=ShipmentStatus.ON_TIME,
                risk_level=RiskLevel.LOW,
                eta="2026-05-15 08:00",
                carrier="Maersk",
                weight="2500 kg"
            ),
            Shipment(
                id="SHP002",
                origin="Rotterdam, Netherlands",
                destination="New York, USA",
                current_location="Atlantic Ocean",
                status=ShipmentStatus.AT_RISK,
                risk_level=RiskLevel.MEDIUM,
                eta="2026-05-10 14:00",
                carrier="MSC",
                weight="1800 kg"
            ),
            Shipment(
                id="SHP003",
                origin="Singapore",
                destination="Sydney, Australia",
                current_location="Jakarta, Indonesia",
                status=ShipmentStatus.DELAYED,
                risk_level=RiskLevel.HIGH,
                eta="2026-05-08 10:00",
                carrier="COSCO",
                weight="3200 kg"
            ),
        ]
        for shipment in sample_shipments:
            self._shipments[shipment.id] = shipment

    def get_all(self) -> List[Shipment]:
        """Get all shipments"""
        return list(self._shipments.values())

    def get_by_id(self, shipment_id: str) -> Optional[Shipment]:
        """Get shipment by ID"""
        return self._shipments.get(shipment_id)

    def create(self, shipment_data: ShipmentCreate) -> Shipment:
        """Create a new shipment"""
        shipment = Shipment(
            id=shipment_data.id,
            origin=shipment_data.origin,
            destination=shipment_data.destination,
            current_location=shipment_data.current_location,
            eta=shipment_data.eta,
            carrier=shipment_data.carrier,
            weight=shipment_data.weight,
            status=ShipmentStatus.ON_TIME,
            risk_level=RiskLevel.LOW
        )
        self._shipments[shipment.id] = shipment
        return shipment

    def update(self, shipment_id: str, update_data: ShipmentUpdate) -> Optional[Shipment]:
        """Update an existing shipment"""
        shipment = self._shipments.get(shipment_id)
        if not shipment:
            return None

        # Update fields if provided
        if update_data.current_location:
            shipment.current_location = update_data.current_location
        if update_data.carrier:
            shipment.carrier = update_data.carrier
        if update_data.weight:
            shipment.weight = update_data.weight
        if update_data.status:
            old_status = shipment.status
            shipment.status = update_data.status
            # Check if we need to create an alert for status change
            self._check_and_create_alert(shipment, old_status)
        if update_data.risk_level:
            old_risk = shipment.risk_level
            shipment.risk_level = update_data.risk_level
            # Check if we need to create an alert for risk change
            self._check_and_create_alert_risk(shipment, old_risk)
        if update_data.eta:
            shipment.eta = update_data.eta

        return shipment

    def _check_and_create_alert(self, shipment: Shipment, old_status: str):
        """Create alert if shipment is delayed"""
        if shipment.status == ShipmentStatus.DELAYED and old_status != ShipmentStatus.DELAYED:
            self._alert_service.create_alert_for_shipment(
                shipment_id=shipment.id,
                message=f"Shipment {shipment.id} has been delayed. Destination: {shipment.destination}",
                severity="Critical"
            )

    def _check_and_create_alert_risk(self, shipment: Shipment, old_risk: str):
        """Create alert if shipment risk is high"""
        if shipment.risk_level == RiskLevel.HIGH and old_risk != RiskLevel.HIGH:
            self._alert_service.create_alert_for_shipment(
                shipment_id=shipment.id,
                message=f"Shipment {shipment.id} has HIGH risk level. Current location: {shipment.current_location}",
                severity="Critical"
            )

    def delete(self, shipment_id: str) -> bool:
        """Delete a shipment"""
        if shipment_id in self._shipments:
            del self._shipments[shipment_id]
            return True
        return False
