#!/usr/bin/env python
"""
PulseChain Backend - Startup Script
Quick start script for running the FastAPI backend
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """Start the PulseChain backend"""
    
    # Get project root
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    print("🚀 PulseChain Backend - Starting...\n")
    
    # Check if requirements are installed
    print("✓ Checking dependencies...")
    try:
        import fastapi
        import uvicorn
        import pydantic
        print("✓ All dependencies found\n")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], check=True)
        print("✓ Dependencies installed\n")
    
    # Show startup info
    print("=" * 60)
    print("  PulseChain Backend API")
    print("=" * 60)
    print("\n📍 Server Information:")
    print("   URL: http://localhost:8000")
    print("   Swagger Docs: http://localhost:8000/docs")
    print("   ReDoc: http://localhost:8000/redoc")
    print("\n🔧 Features:")
    print("   • Hot reload enabled (auto-restart on file changes)")
    print("   • CORS enabled (accepts all origins)")
    print("   • Sample data pre-loaded")
    print("   • Automatic alert generation")
    print("\n💡 Tips:")
    print("   • Press CTRL+C to stop the server")
    print("   • Check http://localhost:8000/docs for API documentation")
    print("   • Sample shipments: SHP001, SHP002, SHP003")
    print("\n" + "=" * 60 + "\n")
    
    # Start server
    cmd = [
        sys.executable, "-m", "uvicorn",
        "backend.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
    ]
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
