# PulseChain Backend - Quick Start Guide

## 🎯 Start Here

### 1️⃣ Install Dependencies (First Time Only)
```bash
cd "Design PulseChain Dashboard"
pip install -r backend/requirements.txt
```

### 2️⃣ Start the Server

**Option A: Simple (Recommended)**
```bash
python run_backend.py
```

**Option B: Manual**
```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3️⃣ Access the API

- **Main URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [BACKEND_README.md](./BACKEND_README.md) | Complete API reference & architecture |
| [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) | Testing examples & automation scripts |
| `run_backend.py` | Helper script for starting the server |

---

## ⚡ Quick Test

### Check Server Health
```bash
python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
```

### Get All Shipments
```bash
python -c "import json, urllib.request; resp = urllib.request.urlopen('http://localhost:8000/shipments'); print(json.dumps(json.load(resp), indent=2))"
```

### Get All Alerts
```bash
python -c "import json, urllib.request; resp = urllib.request.urlopen('http://localhost:8000/alerts'); print(json.dumps(json.load(resp), indent=2))"
```

---

## 📌 Sample Shipments

Three sample shipments are pre-loaded:

| ID | Origin | Destination | Status | Risk |
|---|---|---|---|---|
| SHP001 | Shanghai, China | Los Angeles, USA | On Time | Low |
| SHP002 | Rotterdam, Netherlands | New York, USA | At Risk | Medium |
| SHP003 | Singapore | Sydney, Australia | Delayed | High |

---

## 🎮 Common Tasks

### Create a Shipment
```python
import json, urllib.request

payload = json.dumps({
    "id": "SHP005",
    "origin": "Dubai",
    "destination": "Singapore",
    "current_location": "Dubai Port",
    "eta": "2026-05-08 15:00",
    "carrier": "Hapag-Lloyd",
    "weight": "2200 kg"
})

req = urllib.request.Request(
    'http://localhost:8000/shipments',
    data=payload.encode(),
    method='POST',
    headers={'Content-Type': 'application/json'}
)
resp = urllib.request.urlopen(req)
print(json.dumps(json.load(resp), indent=2))
```

### Update Shipment Status (Creates Alert)
```python
import json, urllib.request

payload = json.dumps({"status": "Delayed"})
req = urllib.request.Request(
    'http://localhost:8000/shipments/SHP001',
    data=payload.encode(),
    method='PUT',
    headers={'Content-Type': 'application/json'}
)
urllib.request.urlopen(req)
print("✓ Shipment delayed - Alert automatically created!")
```

### Get Route Optimization
```python
import json, urllib.request

req = urllib.request.Request(
    'http://localhost:8000/optimize/SHP001',
    data=b'{}',
    method='POST',
    headers={'Content-Type': 'application/json'}
)
resp = urllib.request.urlopen(req)
result = json.load(resp)
print(f"Suggested Route: {result['suggested_route']}")
print(f"Time Saved: {result['time_saved']} min")
print(f"Risk Reduction: {result['risk_reduction']}%")
```

---

## 🔍 API Endpoints Overview

### Shipments
- `GET /shipments` - List all shipments
- `POST /shipments` - Create shipment
- `GET /shipments/{id}` - Get shipment details
- `PUT /shipments/{id}` - Update shipment
- `DELETE /shipments/{id}` - Delete shipment

### Alerts
- `GET /alerts` - List all alerts
- `POST /alerts` - Create alert
- `GET /alerts/{id}` - Get alert details
- `GET /alerts/shipment/{shipment_id}` - Get shipment alerts
- `DELETE /alerts/{id}` - Delete alert

### Optimization
- `POST /optimize/{shipment_id}` - Get route suggestions
- `GET /optimize/routes` - List available routes

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Import Error
```bash
# Reinstall dependencies
pip install -r backend/requirements.txt --force-reinstall
```

### Server Won't Start
1. Check Python version: `python --version` (needs 3.8+)
2. Verify FastAPI installed: `pip list | grep fastapi`
3. Check port 8000 is available
4. Check all files in `backend/` folder exist

---

## 🚀 Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Run Tests**: See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
3. **Review Code**: Check `backend/` folder structure
4. **Read Docs**: See [BACKEND_README.md](./BACKEND_README.md)
5. **Connect Frontend**: Update frontend API calls to use http://localhost:8000

---

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| Is the server running? | Check http://localhost:8000/health |
| Where's the API docs? | http://localhost:8000/docs |
| How do I stop the server? | Press CTRL+C in terminal |
| How do I restart it? | Stop and run the command again |
| Can I use it with frontend? | Yes! CORS is enabled |
| Is data persistent? | No, it resets on server restart |

---

## 📖 For Full Details

- **Architecture & Models**: [BACKEND_README.md](./BACKEND_README.md)
- **Testing & Examples**: [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
- **Project Structure**: See `backend/` folder

---

**Version**: 1.0.0 | **Status**: ✅ Production Ready
