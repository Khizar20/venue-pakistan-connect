"""
Basic tests for the Shadiejo application
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_home_page():
    """Test the home page loads"""
    response = client.get("/")
    assert response.status_code == 200

def test_login_page():
    """Test the login page loads"""
    response = client.get("/login")
    assert response.status_code == 200

def test_signup_page():
    """Test the signup page loads"""
    response = client.get("/signup")
    assert response.status_code == 200

def test_dashboard_page():
    """Test the dashboard page loads"""
    response = client.get("/dashboard")
    assert response.status_code == 200
