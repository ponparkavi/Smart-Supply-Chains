# filepath: backend/services/alert_service.py
"""
Alert service - handles alert business logic and in-memory storage
"""
from typing import List, Optional
from datetime import datetime
import uuid

from backend.models.alert import Alert, AlertCreate, AlertSeverity


class AlertService:
    """Service for managing alerts in memory"""
    
    def __init__(self):
        self._alerts: dict[str, Alert] = {}
        self._initialize_sample_alerts()
    
    def _initialize_sample_alerts(self):
        """Add sample alerts for testing"""
        sample_alerts = [
            Alert(
                id="ALT001",
                shipment_id="SHP002",
                message="Shipment is at risk due to weather conditions",
                severity=AlertSeverity.MEDIUM,
                timestamp=datetime.now()
            ),
            Alert(
                id="ALT002",
                shipment_id="SHP003",
                message="Shipment delayed due to port congestion",
                severity=AlertSeverity.CRITICAL,
                timestamp=datetime.now()
            ),
        ]
        for alert in sample_alerts:
            self._alerts[alert.id] = alert
    
    def get_all(self) -> List[Alert]:
        """Get all alerts"""
        return list(self._alerts.values())
    
    def get_by_shipment_id(self, shipment_id: str) -> List[Alert]:
        """Get alerts for a specific shipment"""
        return [alert for alert in self._alerts.values() if alert.shipment_id == shipment_id]
    
    def get_by_id(self, alert_id: str) -> Optional[Alert]:
        """Get alert by ID"""
        return self._alerts.get(alert_id)
    
    def create_alert_for_shipment(self, shipment_id: str, message: str, severity: str) -> Alert:
        """Create a new alert for a shipment"""
        alert_id = f"ALT{str(uuid.uuid4())[:8].upper()}"
        
        # Map string severity to enum
        severity_enum = AlertSeverity.LOW
        if severity == "Critical":
            severity_enum = AlertSeverity.CRITICAL
        elif severity == "Medium":
            severity_enum = AlertSeverity.MEDIUM
        
        alert = Alert(
            id=alert_id,
            shipment_id=shipment_id,
            message=message,
            severity=severity_enum,
            timestamp=datetime.now()
        )
        self._alerts[alert.id] = alert
        return alert
    
    def create(self, alert_data: AlertCreate) -> Alert:
        """Create a new alert"""
        alert_id = f"ALT{str(uuid.uuid4())[:8].upper()}"
        alert = Alert(
            id=alert_id,
            shipment_id=alert_data.shipment_id,
            message=alert_data.message,
            severity=alert_data.severity,
            timestamp=datetime.now()
        )
        self._alerts[alert.id] = alert
        return alert
    
    def delete(self, alert_id: str) -> bool:
        """Delete an alert"""
        if alert_id in self._alerts:
            del self._alerts[alert_id]
            return True
        return False