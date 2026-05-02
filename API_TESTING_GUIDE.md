# PulseChain Backend - API Testing Guide

Complete guide for testing all PulseChain backend API endpoints with examples.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Shipments API](#shipments-api)
3. [Alerts API](#alerts-api)
4. [Optimization API](#optimization-api)
5. [Automation Scripts](#automation-scripts)

---

## Quick Start

### Prerequisites
- Backend running on `http://localhost:8000`
- Python 3.8+ with `requests` library (optional)
- curl or Postman (optional)

### Verify Server is Running
```bash
python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
```

Expected output:
```json
{"status":"ok","message":"PulseChain API is running"}
```

---

## Shipments API

### 1. Get All Shipments

**Endpoint:** `GET /shipments`

**Python:**
```python
import json
import urllib.request

resp = urllib.request.urlopen('http://localhost:8000/shipments')
shipments = json.load(resp)
print(json.dumps(shipments, indent=2))
```

**Expected Response:**
```json
[
  {
    "id": "SHP001",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "current_location": "Pacific Ocean",
    "eta": "2026-05-15 08:00",
    "carrier": "Maersk",
    "weight": "2500 kg",
    "status": "On Time",
    "risk_level": "Low"
  },
  ...
]
```

---

### 2. Get Specific Shipment

**Endpoint:** `GET /shipments/{id}`

**Python:**
```python
import json
import urllib.request

shipment_id = "SHP001"
resp = urllib.request.urlopen(f'http://localhost:8000/shipments/{shipment_id}')
shipment = json.load(resp)
print(json.dumps(shipment, indent=2))
```

**Expected Response:**
```json
{
  "id": "SHP001",
  "origin": "Shanghai, China",
  "destination": "Los Angeles, USA",
  "current_location": "Pacific Ocean",
  "eta": "2026-05-15 08:00",
  "carrier": "Maersk",
  "weight": "2500 kg",
  "status": "On Time",
  "risk_level": "Low"
}
```

---

### 3. Create New Shipment

**Endpoint:** `POST /shipments`

**Python:**
```python
import json
import urllib.request

payload = json.dumps({
    "id": "SHP004",
    "origin": "Hong Kong",
    "destination": "Singapore",
    "current_location": "Hong Kong Port",
    "eta": "2026-05-05 12:00",
    "carrier": "CMA CGM",
    "weight": "1500 kg"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments',
    data=payload.encode(),
    method='POST',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(json.dumps(result, indent=2))
```

**Request Body:**
```json
{
  "id": "SHP004",
  "origin": "Hong Kong",
  "destination": "Singapore",
  "current_location": "Hong Kong Port",
  "eta": "2026-05-05 12:00",
  "carrier": "CMA CGM",
  "weight": "1500 kg"
}
```

**Expected Response:** (201 Created)
```json
{
  "id": "SHP004",
  "origin": "Hong Kong",
  "destination": "Singapore",
  "current_location": "Hong Kong Port",
  "eta": "2026-05-05 12:00",
  "carrier": "CMA CGM",
  "weight": "1500 kg",
  "status": "On Time",
  "risk_level": "Low"
}
```

---

### 4. Update Shipment

**Endpoint:** `PUT /shipments/{id}`

#### 4a. Update Location Only
```python
import json
import urllib.request

payload = json.dumps({
    "current_location": "Strait of Malacca"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP004',
    data=payload.encode(),
    method='PUT',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(f"Location updated to: {result['current_location']}")
```

#### 4b. Update Status (Triggers Alert)
```python
import json
import urllib.request

payload = json.dumps({
    "status": "Delayed"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP001',
    data=payload.encode(),
    method='PUT',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(f"Status: {result['status']}")
print("✓ Alert automatically created!")
```

#### 4c. Update Risk Level (Triggers Alert)
```python
import json
import urllib.request

payload = json.dumps({
    "risk_level": "High"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP001',
    data=payload.encode(),
    method='PUT',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(f"Risk Level: {result['risk_level']}")
print("✓ Alert automatically created!")
```

#### 4d. Update Multiple Fields
```python
import json
import urllib.request

payload = json.dumps({
    "current_location": "Singapore Port",
    "status": "At Risk",
    "risk_level": "Medium",
    "eta": "2026-05-06 14:00",
    "carrier": "MSC",
    "weight": "1600 kg"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP004',
    data=payload.encode(),
    method='PUT',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(json.dumps(result, indent=2))
```

---

### 5. Delete Shipment

**Endpoint:** `DELETE /shipments/{id}`

**Python:**
```python
import urllib.request

req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP004',
    method='DELETE'
)

try:
    resp = urllib.request.urlopen(req)
    if resp.status == 204:
        print("✓ Shipment deleted successfully")
except urllib.error.HTTPError as e:
    if e.code == 404:
        print("✗ Shipment not found")
```

**Expected Response:** (204 No Content)

---

## Alerts API

### 1. Get All Alerts

**Endpoint:** `GET /alerts`

**Python:**
```python
import json
import urllib.request

resp = urllib.request.urlopen('http://localhost:8000/alerts')
alerts = json.load(resp)
print(json.dumps(alerts, indent=2))
```

**Expected Response:**
```json
[
  {
    "id": "ALT001",
    "shipment_id": "SHP002",
    "message": "Shipment is at risk due to weather conditions",
    "severity": "Medium",
    "timestamp": "2026-05-01T09:18:42.957925"
  },
  {
    "id": "ALT002",
    "shipment_id": "SHP003",
    "message": "Shipment delayed due to port congestion",
    "severity": "Critical",
    "timestamp": "2026-05-01T09:18:42.958032"
  }
]
```

---

### 2. Get Specific Alert

**Endpoint:** `GET /alerts/{id}`

**Python:**
```python
import json
import urllib.request

resp = urllib.request.urlopen('http://localhost:8000/alerts/ALT001')
alert = json.load(resp)
print(json.dumps(alert, indent=2))
```

---

### 3. Get Alerts for Shipment

**Endpoint:** `GET /alerts/shipment/{shipment_id}`

**Python:**
```python
import json
import urllib.request

resp = urllib.request.urlopen('http://localhost:8000/alerts/shipment/SHP002')
alerts = json.load(resp)
print(f"Alerts for SHP002: {len(alerts)} found")
print(json.dumps(alerts, indent=2))
```

---

### 4. Create Alert Manually

**Endpoint:** `POST /alerts`

**Python:**
```python
import json
import urllib.request

payload = json.dumps({
    "shipment_id": "SHP001",
    "message": "Customs inspection required at Singapore",
    "severity": "Medium"
})

req = urllib.request.Request(
    'http://localhost:8000/alerts',
    data=payload.encode(),
    method='POST',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(f"Alert created: {result['id']}")
print(json.dumps(result, indent=2))
```

**Request Body:**
```json
{
  "shipment_id": "SHP001",
  "message": "Custom message",
  "severity": "Low"
}
```

**Severity Options:**
- `"Low"`
- `"Medium"`
- `"Critical"`

---

### 5. Delete Alert

**Endpoint:** `DELETE /alerts/{id}`

**Python:**
```python
import urllib.request

req = urllib.request.Request(
    'http://localhost:8000/alerts/ALT001',
    method='DELETE'
)

try:
    resp = urllib.request.urlopen(req)
    if resp.status == 204:
        print("✓ Alert deleted")
except urllib.error.HTTPError as e:
    if e.code == 404:
        print("✗ Alert not found")
```

---

## Optimization API

### 1. Get Route Suggestions

**Endpoint:** `POST /optimize/{shipment_id}`

**Python:**
```python
import json
import urllib.request

shipment_id = "SHP001"
req = urllib.request.Request(
    f'http://localhost:8000/optimize/{shipment_id}',
    data=b'{}',
    method='POST',
    headers={'Content-Type': 'application/json'}
)

resp = urllib.request.urlopen(req)
result = json.load(resp)
print(json.dumps(result, indent=2))
```

**Expected Response:**
```json
{
  "shipment_id": "SHP001",
  "suggested_route": "Shanghai → Vancouver → Los Angeles (Northern Route)",
  "time_saved": 75,
  "risk_reduction": 29,
  "alternative_routes": [
    "Shanghai → Tokyo → Honolulu → Los Angeles",
    "Shanghai → Guam → Honolulu → Los Angeles"
  ]
}
```

---

### 2. Get Available Routes

**Endpoint:** `GET /optimize/routes`

**Python:**
```python
import json
import urllib.request

resp = urllib.request.urlopen('http://localhost:8000/optimize/routes')
routes = json.load(resp)
print(json.dumps(routes, indent=2))
```

---

## Automation Scripts

### Complete API Test Script

Create `test_api.py`:

```python
#!/usr/bin/env python
"""Complete PulseChain API test suite"""

import json
import urllib.request
import time

BASE_URL = "http://localhost:8000"

def test_shipments():
    print("\n" + "="*60)
    print("TESTING SHIPMENTS API")
    print("="*60)
    
    # Get all shipments
    print("\n1. GET /shipments")
    resp = urllib.request.urlopen(f'{BASE_URL}/shipments')
    shipments = json.load(resp)
    print(f"   ✓ Found {len(shipments)} shipments")
    
    # Get specific shipment
    print("\n2. GET /shipments/SHP001")
    resp = urllib.request.urlopen(f'{BASE_URL}/shipments/SHP001')
    shipment = json.load(resp)
    print(f"   ✓ {shipment['id']}: {shipment['origin']} → {shipment['destination']}")
    
    # Create new shipment
    print("\n3. POST /shipments")
    payload = json.dumps({
        "id": "TEST001",
        "origin": "Dubai",
        "destination": "Mumbai",
        "current_location": "Dubai Port",
        "eta": "2026-05-07 10:00",
        "carrier": "Hapag-Lloyd",
        "weight": "2000 kg"
    })
    req = urllib.request.Request(
        f'{BASE_URL}/shipments',
        data=payload.encode(),
        method='POST',
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req)
    result = json.load(resp)
    print(f"   ✓ Created shipment: {result['id']}")
    
    # Update shipment
    print("\n4. PUT /shipments/TEST001")
    payload = json.dumps({
        "current_location": "Arabian Sea",
        "status": "On Time"
    })
    req = urllib.request.Request(
        f'{BASE_URL}/shipments/TEST001',
        data=payload.encode(),
        method='PUT',
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req)
    result = json.load(resp)
    print(f"   ✓ Updated location to: {result['current_location']}")

def test_alerts():
    print("\n" + "="*60)
    print("TESTING ALERTS API")
    print("="*60)
    
    # Get all alerts
    print("\n1. GET /alerts")
    resp = urllib.request.urlopen(f'{BASE_URL}/alerts')
    alerts = json.load(resp)
    print(f"   ✓ Found {len(alerts)} alerts")
    
    # Get alerts for shipment
    print("\n2. GET /alerts/shipment/SHP002")
    resp = urllib.request.urlopen(f'{BASE_URL}/alerts/shipment/SHP002')
    alerts = json.load(resp)
    print(f"   ✓ Found {len(alerts)} alerts for SHP002")
    
    # Create alert
    print("\n3. POST /alerts")
    payload = json.dumps({
        "shipment_id": "TEST001",
        "message": "Test alert message",
        "severity": "Low"
    })
    req = urllib.request.Request(
        f'{BASE_URL}/alerts',
        data=payload.encode(),
        method='POST',
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req)
    result = json.load(resp)
    print(f"   ✓ Created alert: {result['id']}")

def test_optimization():
    print("\n" + "="*60)
    print("TESTING OPTIMIZATION API")
    print("="*60)
    
    # Optimize route
    print("\n1. POST /optimize/SHP001")
    req = urllib.request.Request(
        f'{BASE_URL}/optimize/SHP001',
        data=b'{}',
        method='POST',
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req)
    result = json.load(resp)
    print(f"   ✓ Suggested Route: {result['suggested_route']}")
    print(f"   ✓ Time Saved: {result['time_saved']} minutes")
    print(f"   ✓ Risk Reduction: {result['risk_reduction']}%")

def test_alert_generation():
    print("\n" + "="*60)
    print("TESTING AUTO ALERT GENERATION")
    print("="*60)
    
    # Get initial alert count
    print("\n1. GET initial alert count")
    resp = urllib.request.urlopen(f'{BASE_URL}/alerts')
    initial_alerts = len(json.load(resp))
    print(f"   Current alerts: {initial_alerts}")
    
    # Update shipment to delayed
    print("\n2. PUT /shipments/SHP003 (set to Delayed)")
    payload = json.dumps({"status": "Delayed"})
    req = urllib.request.Request(
        f'{BASE_URL}/shipments/SHP003',
        data=payload.encode(),
        method='PUT',
        headers={'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req)
    
    time.sleep(0.5)  # Brief delay for processing
    
    # Check alert count
    print("\n3. GET updated alert count")
    resp = urllib.request.urlopen(f'{BASE_URL}/alerts')
    final_alerts = len(json.load(resp))
    print(f"   New alerts: {final_alerts}")
    
    if final_alerts > initial_alerts:
        print(f"   ✓ {final_alerts - initial_alerts} new alert(s) created!")
    else:
        print("   ✗ No new alerts created")

def main():
    print("\n🚀 PulseChain Backend API Test Suite")
    print("Base URL: " + BASE_URL)
    
    try:
        # Verify server is running
        print("\nVerifying server...")
        resp = urllib.request.urlopen(f'{BASE_URL}/health')
        health = json.load(resp)
        print(f"✓ Server Status: {health['status']}")
        
        # Run tests
        test_shipments()
        test_alerts()
        test_optimization()
        test_alert_generation()
        
        print("\n" + "="*60)
        print("✓ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the backend is running on http://localhost:8000")

if __name__ == "__main__":
    main()
```

**Run the test:**
```bash
python test_api.py
```

---

## Error Handling

### 404 Not Found
```json
{
  "detail": "Shipment with ID SHP999 not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Shipment with ID SHP001 already exists"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "origin"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Performance Tips

1. **Batch Operations**: Get all shipments once and filter locally
2. **Caching**: Store shipment data locally to reduce API calls
3. **Connection Pooling**: Use `requests` library for better performance
4. **Async Testing**: Use `aiohttp` for parallel API calls

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure backend is running on port 8000 |
| JSON decode error | Check response status code and content |
| 422 Validation Error | Verify all required fields are provided |
| 404 Not Found | Check shipment/alert ID is correct |

---

Last Updated: May 2026
