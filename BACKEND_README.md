# PulseChain Backend API

A clean, minimal, and scalable FastAPI-based backend for a smart supply chain management system. Supports shipment tracking, alert generation, and route optimization with in-memory storage.

## 🚀 Quick Start

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd "Design PulseChain Dashboard"
   ```

2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the Server

Start the API server with automatic reload:

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [PID]
```

**Access the API:**
- Main API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc Docs: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

---

## 📊 API Endpoints

### Shipments

#### GET /shipments
Get all shipments

**Response:**
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
  }
]
```

#### POST /shipments
Create a new shipment

**Request Body:**
```json
{
  "id": "SHP004",
  "origin": "Hong Kong",
  "destination": "Singapore",
  "current_location": "South China Sea",
  "eta": "2026-05-05 12:00",
  "carrier": "CMA CGM",
  "weight": "1500 kg"
}
```

**Response:** Created shipment (201)

#### GET /shipments/{id}
Get a specific shipment

**Response:** Shipment details (200)

#### PUT /shipments/{id}
Update a shipment

**Request Body (all fields optional):**
```json
{
  "current_location": "Strait of Malacca",
  "status": "Delayed",
  "risk_level": "High",
  "eta": "2026-05-06 12:00",
  "carrier": "CMA CGM",
  "weight": "1500 kg"
}
```

**Note:** Updating to `"Delayed"` status or `"High"` risk level automatically creates Critical alerts

**Response:** Updated shipment (200)

#### DELETE /shipments/{id}
Delete a shipment

**Response:** 204 No Content

---

### Alerts

#### GET /alerts
Get all alerts

**Response:**
```json
[
  {
    "id": "ALT001",
    "shipment_id": "SHP002",
    "message": "Shipment is at risk due to weather conditions",
    "severity": "Medium",
    "timestamp": "2026-05-01T09:18:42.957925"
  }
]
```

#### GET /alerts/{id}
Get a specific alert

**Response:** Alert details (200)

#### GET /alerts/shipment/{shipment_id}
Get all alerts for a shipment

**Response:** List of alerts (200)

#### POST /alerts
Create a new alert

**Request Body:**
```json
{
  "shipment_id": "SHP001",
  "message": "Custom alert message",
  "severity": "Critical"
}
```

**Response:** Created alert (201)

#### DELETE /alerts/{id}
Delete an alert

**Response:** 204 No Content

---

### Route Optimization

#### POST /optimize/{shipment_id}
Optimize route for a shipment

**Response:**
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

**Returns:**
- `suggested_route`: Recommended shipping route
- `time_saved`: Estimated time savings in minutes
- `risk_reduction`: Risk reduction percentage (10-75%)
- `alternative_routes`: Up to 2 alternative routes

#### GET /optimize/routes
Get available route categories

**Response:**
```json
{
  "asia_us": ["Route 1", "Route 2", "Route 3"],
  "europe_us": ["Route 1", "Route 2", "Route 3"],
  "asia_aus": ["Route 1", "Route 2", "Route 3"]
}
```

---

## 🎯 Data Models

### Shipment Status
- `"On Time"` - Shipment on schedule
- `"At Risk"` - Shipment at potential risk
- `"Delayed"` - Shipment delayed

### Risk Level
- `"Low"` - Low risk
- `"Medium"` - Medium risk
- `"High"` - High risk

### Alert Severity
- `"Low"` - Low severity
- `"Medium"` - Medium severity
- `"Critical"` - Critical severity

---

## 💡 Alert System

Alerts are **automatically generated** when:

1. **Shipment Status → Delayed**
   - Severity: Critical
   - Message: "Shipment {ID} has been delayed. Destination: {destination}"

2. **Risk Level → High**
   - Severity: Critical
   - Message: "Shipment {ID} has HIGH risk level. Current location: {location}"

You can also **manually create** alerts via `POST /alerts`.

---

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── models/
│   ├── __init__.py
│   ├── shipment.py         # Shipment Pydantic schemas
│   └── alert.py            # Alert Pydantic schemas
├── routes/
│   ├── __init__.py
│   ├── shipments.py        # Shipment API endpoints
│   ├── alerts.py           # Alert API endpoints
│   └── optimization.py     # Route optimization endpoints
└── services/
    ├── __init__.py         # Singleton service initialization
    ├── shipment_service.py # Shipment business logic
    ├── alert_service.py    # Alert business logic
    └── optimization_service.py  # Route optimization logic
```

---

## 🔧 Architecture

### Singleton Pattern
Services are initialized as singletons in `backend/services/__init__.py` to ensure data consistency across all routes:

```python
alert_service = AlertService()
shipment_service = ShipmentService(alert_service)
optimization_service = OptimizationService()
```

### In-Memory Storage
- Data is stored in-memory using Python dictionaries
- Sample data is pre-loaded on startup
- Data is cleared when the server restarts

### Dependency Injection
All routes use FastAPI's `Depends()` for clean dependency injection:

```python
def get_shipment_service():
    return shipment_service

@router.get("")
def get_shipments(service=Depends(get_shipment_service)):
    return service.get_all()
```

---

## 📝 Example Usage

### Create a Shipment
```bash
curl -X POST http://localhost:8000/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "SHP005",
    "origin": "Tokyo, Japan",
    "destination": "Sydney, Australia",
    "current_location": "Tokyo Port",
    "eta": "2026-05-10 18:00",
    "carrier": "Evergreen",
    "weight": "4000 kg"
  }'
```

### Update Shipment Status
```bash
curl -X PUT http://localhost:8000/shipments/SHP005 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Delayed",
    "risk_level": "High"
  }'
```

This will automatically create 2 Critical alerts!

### Get Optimization Suggestion
```bash
curl -X POST http://localhost:8000/optimize/SHP005
```

### View All Alerts
```bash
curl http://localhost:8000/alerts
```

---

## 🚨 Error Handling

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

### 422 Unprocessable Entity
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

## 📦 Dependencies

- **fastapi** (≥0.100.0) - Web framework
- **uvicorn** (≥0.23.0) - ASGI server
- **pydantic** (≥2.0.0) - Data validation
- **python-multipart** (≥0.0.6) - Form data handling

---

## 🔒 CORS Configuration

The API accepts requests from all origins during development:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production**, restrict to specific origins:
```python
allow_origins=["https://yourdomain.com"]
```

---

## 🧪 Testing

### Health Check
```bash
python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
```

### Test Shipments
```bash
python -c "
import json, urllib.request
resp = urllib.request.urlopen('http://localhost:8000/shipments')
print(json.dumps(json.load(resp), indent=2))
"
```

---

## 📖 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎓 Key Features

✅ **RESTful API Design** - Clear and intuitive endpoints
✅ **Data Validation** - Pydantic schemas for type safety
✅ **Automatic Alerts** - Intelligent alert generation on status/risk changes
✅ **Route Optimization** - Simulated optimization with time/risk metrics
✅ **Error Handling** - Proper HTTP status codes and error messages
✅ **Auto-reload** - Development server with hot reload
✅ **Interactive Docs** - Built-in Swagger and ReDoc documentation
✅ **Modular Architecture** - Separate models, routes, and services
✅ **CORS Enabled** - Frontend integration ready
✅ **Production Ready** - Can be deployed with Gunicorn

---

## 🚀 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 backend.main:app
```

### Using Docker
Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📞 Support

For issues or improvements:
1. Check the [API Documentation](/docs)
2. Review the project structure in `backend/`
3. Verify sample data in service initialization
4. Check server logs for detailed error messages

---

**Version:** 1.0.0
**Last Updated:** May 2026
