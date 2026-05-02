# filepath: backend/main.py
"""
PulseChain Backend API
A smart supply chain management system

Run with: uvicorn backend.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import shipments_router, alerts_router, optimization_router

# Create FastAPI app
app = FastAPI(
    title="PulseChain API",
    description="Smart Supply Chain Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(shipments_router)
app.include_router(alerts_router)
app.include_router(optimization_router)


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PulseChain API",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Detailed health check"""
    return {
        "status": "ok",
        "message": "PulseChain API is running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)