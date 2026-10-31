"""Tests for Autonomous Software Repair API endpoints."""
import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_repair_dashboard_endpoint():
    res = client.get("/api/repair/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "total_repositories_analyzed" in data
    assert "total_bugs_detected" in data
    assert "total_repairs_attempted" in data
    assert "verified_repairs" in data
    assert "recent_activities" in data


def test_repair_jobs_endpoint():
    res = client.get("/api/repair/jobs")
    assert res.status_code == 200
    data = res.json()
    assert "jobs" in data
    assert isinstance(data["jobs"], list)


def test_repair_start_and_status():
    res = client.post("/api/repair/start", json={"url": "demo"})
    assert res.status_code == 200
    data = res.json()
    assert "job_id" in data
    job_id = data["job_id"]
    assert job_id.startswith("repair-")

    # Fetch status
    status_res = client.get(f"/api/repair/status/{job_id}")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["job_id"] == job_id
    assert "stage" in status_data
    assert "progress" in status_data
