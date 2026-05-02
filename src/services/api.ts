// filepath: src/services/api.ts
const API_BASE_URL = 'http://localhost:8000';

// Types matching backend models
export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  current_location: string;
  status: 'On Time' | 'At Risk' | 'Delayed';
  risk_level: 'Low' | 'Medium' | 'High';
  eta: string;
}

export interface ShipmentCreate {
  id: string;
  origin: string;
  destination: string;
  current_location: string;
  eta: string;
}

export interface ShipmentUpdate {
  current_location?: string;
  status?: 'On Time' | 'At Risk' | 'Delayed';
  risk_level?: 'Low' | 'Medium' | 'High';
  eta?: string;
}

export interface Alert {
  id: string;
  shipment_id: string;
  message: string;
  severity: 'Low' | 'Medium' | 'Critical';
  timestamp: string;
}

export interface OptimizationResult {
  shipment_id: string;
  suggested_route: string;
  time_saved: number;
  risk_reduction: number;
  alternative_routes: string[];
}

// API Functions
export const api = {
  // Shipments
  async getShipments(): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE_URL}/shipments`);
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return response.json();
  },

  async getShipment(id: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch shipment');
    return response.json();
  },

  async createShipment(shipment: ShipmentCreate): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment),
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    return response.json();
  },

  async updateShipment(id: string, update: ShipmentUpdate): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!response.ok) throw new Error('Failed to update shipment');
    return response.json();
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async deleteAlert(alertId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete alert');
  },

  async getAlertsByShipment(shipmentId: string): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts/shipment/${shipmentId}`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  // Optimization
  async optimizeRoute(shipmentId: string): Promise<OptimizationResult> {
    const response = await fetch(`${API_BASE_URL}/optimize/${shipmentId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to optimize route');
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

export default api;