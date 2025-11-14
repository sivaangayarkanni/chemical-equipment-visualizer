#!/usr/bin/env python3
"""Test script to verify all features work"""

import os
import sys
import subprocess
import requests
import pandas as pd
from pathlib import Path

def test_django_backend():
    """Test Django backend functionality"""
    print("Testing Django backend...")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Test Django check
    result = subprocess.run([sys.executable, "manage.py", "check"], 
                          capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAIL: Django check failed: {result.stderr}")
        return False
    
    print("PASS: Django configuration valid")
    
    # Test migrations
    result = subprocess.run([sys.executable, "manage.py", "migrate"], 
                          capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAIL: Migrations failed: {result.stderr}")
        return False
    
    print("PASS: Database migrations successful")
    return True

def test_csv_processing():
    """Test CSV processing functionality"""
    print("Testing CSV processing...")
    
    # Test sample CSV
    csv_path = Path(__file__).parent / "sample_equipment_data.csv"
    if not csv_path.exists():
        print("FAIL: Sample CSV file not found")
        return False
    
    try:
        df = pd.read_csv(csv_path)
        required_columns = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']
        
        if not all(col in df.columns for col in required_columns):
            print("FAIL: CSV missing required columns")
            return False
        
        print(f"PASS: CSV valid with {len(df)} records")
        return True
    except Exception as e:
        print(f"FAIL: CSV processing failed: {e}")
        return False

def test_react_build():
    """Test React frontend build"""
    print("Testing React frontend...")
    
    frontend_dir = Path(__file__).parent / "frontend_web"
    
    # Check if node_modules exists
    if not (frontend_dir / "node_modules").exists():
        print("FAIL: Node modules not installed")
        return False
    
    # Check if package.json exists
    if not (frontend_dir / "package.json").exists():
        print("FAIL: package.json not found")
        return False
    
    print("PASS: React frontend files ready")
    return True

def test_api_endpoints():
    """Test API endpoints (requires server running)"""
    print("Testing API endpoints...")
    
    base_url = "http://localhost:8000/api"
    
    try:
        # Test datasets endpoint
        response = requests.get(f"{base_url}/datasets/", timeout=5)
        if response.status_code == 200:
            print("PASS: API endpoints accessible")
            return True
        else:
            print(f"FAIL: API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("WARN: API server not running (start with: python manage.py runserver)")
        return False
    except Exception as e:
        print(f"FAIL: API test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Chemical Equipment Visualizer Features\n")
    
    tests = [
        ("Django Backend", test_django_backend),
        ("CSV Processing", test_csv_processing),
        ("React Frontend", test_react_build),
        ("API Endpoints", test_api_endpoints),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"FAIL: {test_name} test crashed: {e}")
            results.append((test_name, False))
        print()
    
    # Summary
    print("Test Summary:")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {test_name}: {status}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("All features working correctly!")
    else:
        print("Some features need attention")

if __name__ == "__main__":
    main()