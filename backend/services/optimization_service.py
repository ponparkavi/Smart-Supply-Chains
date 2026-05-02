# filepath: backend/services/optimization_service.py
"""
Route optimization service - provides simulated route optimization
"""
import random
from typing import Dict, Any

from backend.models.shipment import Shipment


class OptimizationService:
    """Service for route optimization (simulated)"""
    
    # Sample routes for different shipment scenarios
    ROUTES = {
        "asia_us": [
            "Shanghai → Tokyo → Honolulu → Los Angeles",
            "Shanghai → Guam → Honolulu → Los Angeles",
            "Shanghai → Vancouver → Los Angeles (Northern Route)",
        ],
        "europe_us": [
            "Rotterdam → Iceland → Halifax → New York",
            "Rotterdam → Azores → Miami → New York",
            "Rotterdam → Canary Islands → Caribbean → New York",
        ],
        "asia_aus": [
            "Singapore → Jakarta → Darwin → Sydney",
            "Singapore → Bali → Melbourne → Sydney",
            "Singapore → Manila → Auckland → Sydney",
        ],
    }
    
    def optimize(self, shipment: Shipment) -> Dict[str, Any]:
        """
        Optimize route for a shipment (simulated logic)
        
        Returns:
            Dictionary with suggested_route, time_saved, and risk_reduction
        """
        # Determine route category based on origin/destination
        route_category = self._get_route_category(shipment.origin, shipment.destination)
        
        # Get available routes
        available_routes = self.ROUTES.get(route_category, ["Direct Route"])
        
        # Select a route (in real app, this would use actual optimization algorithms)
        suggested_route = random.choice(available_routes)
        
        # Calculate mock improvements based on risk level
        # Handle both enum and string values (due to use_enum_values=True in model)
        risk_value = shipment.risk_level.value if hasattr(shipment.risk_level, 'value') else shipment.risk_level
        status_value = shipment.status.value if hasattr(shipment.status, 'value') else shipment.status
        
        base_time_saved = random.randint(15, 90)  # 15-90 minutes
        base_risk_reduction = random.randint(10, 35)  # 10-35%
        
        # Adjust based on current risk level
        if risk_value == "High":
            base_risk_reduction += 20  # Higher reduction for high risk
        elif risk_value == "Medium":
            base_risk_reduction += 10
        
        # Adjust based on current status
        if status_value == "Delayed":
            base_time_saved += 30  # More time saved for delayed shipments
        
        return {
            "shipment_id": shipment.id,
            "suggested_route": suggested_route,
            "time_saved": base_time_saved,  # minutes
            "risk_reduction": min(base_risk_reduction, 75),  # cap at 75%
            "alternative_routes": [
                r for r in available_routes if r != suggested_route
            ][:2]  # Include up to 2 alternatives
        }
    
    def _get_route_category(self, origin: str, destination: str) -> str:
        """Determine route category based on origin and destination"""
        origin_lower = origin.lower()
        dest_lower = destination.lower()
        
        # Asia to US
        if ("china" in origin_lower or "japan" in origin_lower or "korea" in origin_lower or 
            "singapore" in origin_lower or "hong kong" in origin_lower) and \
           ("usa" in dest_lower or "us" in dest_lower or "los angeles" in dest_lower or 
            "new york" in dest_lower or "america" in dest_lower):
            return "asia_us"
        
        # Europe to US
        if ("rotterdam" in origin_lower or "amsterdam" in origin_lower or "hamburg" in origin_lower or
            "london" in origin_lower or "paris" in origin_lower) and \
           ("usa" in dest_lower or "us" in dest_lower or "new york" in dest_lower or 
            "america" in dest_lower):
            return "europe_us"
        
        # Asia to Australia
        if ("singapore" in origin_lower or "hong kong" in origin_lower or "china" in origin_lower) and \
           ("australia" in dest_lower or "sydney" in dest_lower or "melbourne" in dest_lower):
            return "asia_aus"
        
        # Default fallback
        return "asia_us"  # Default to Asia-US route