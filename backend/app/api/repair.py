"""Repair API endpoints — autonomous software repair pipeline."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import Optional
from app.agents.repair_graph import repair_orchestrator

router = APIRouter(prefix="/repair", tags=["Autonomous Repair"])


class RepairRequest(BaseModel):
    url: str
    token: Optional[str] = None
    branch: Optional[str] = None


class RepairResponse(BaseModel):
    job_id: str
    repository_url: str
    message: str


@router.post("/start", response_model=RepairResponse)
async def start_repair(req: RepairRequest):
    """Start an autonomous repair job for a GitHub repository."""
    try:
        job_id = await repair_orchestrator.start_repair(req.url, req.token, req.branch)
        return RepairResponse(
            job_id=job_id,
            repository_url=req.url,
            message="Repair pipeline started. Track progress via /api/repair/status/{job_id}"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/status/{job_id}")
async def get_repair_status(job_id: str):
    """Get the current status of a repair job."""
    job = repair_orchestrator.jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Repair job '{job_id}' not found.")
    return {
        "job_id": job.job_id,
        "repository_id": job.repository_id,
        "repository_url": job.repository_url,
        "stage": job.stage.value,
        "progress": job.progress,
        "message": job.message,
        "error": job.error,
        "bugs_found": job.bugs_found,
        "solutions_generated": job.solutions_generated,
        "solutions_verified": job.solutions_verified,
    }


@router.get("/report/{job_id}")
async def get_repair_report(job_id: str):
    """Get the full repair report for a completed job."""
    report = repair_orchestrator.reports.get(job_id)
    if not report:
        job = repair_orchestrator.jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Repair job not found.")
        if job.stage.value not in ["COMPLETE", "FAILED"]:
            raise HTTPException(status_code=202, detail=f"Job still in progress: {job.stage.value} ({job.progress}%)")
        raise HTTPException(status_code=404, detail="Report not yet generated.")
    return report


@router.get("/report/{job_id}/markdown", response_class=PlainTextResponse)
async def get_repair_report_markdown(job_id: str):
    """Get the repair report as downloadable markdown."""
    report = repair_orchestrator.reports.get(job_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return report.to_markdown()


@router.get("/jobs")
async def list_repair_jobs():
    """List all repair jobs."""
    return {
        "jobs": [
            {
                "job_id": j.job_id,
                "repository_url": j.repository_url,
                "stage": j.stage.value,
                "progress": j.progress,
                "bugs_found": j.bugs_found,
                "solutions_verified": j.solutions_verified,
            }
            for j in repair_orchestrator.jobs.values()
        ],
        "total": len(repair_orchestrator.jobs)
    }


@router.get("/dashboard")
async def get_repair_dashboard():
    """Get aggregate dashboard metrics from all repair jobs."""
    jobs = list(repair_orchestrator.jobs.values())
    total_repos = len(jobs)
    total_bugs = sum(j.bugs_found for j in jobs)
    total_repairs = sum(j.solutions_generated for j in jobs)
    verified_repairs = sum(j.solutions_verified for j in jobs)
    failed_repairs = sum(
        1 for j in jobs
        if j.stage.value == "FAILED" or (j.solutions_generated > 0 and j.solutions_verified == 0)
    )
    recent = sorted(jobs, key=lambda j: j.job_id, reverse=True)[:10]

    return {
        "total_repositories_analyzed": total_repos,
        "total_bugs_detected": total_bugs,
        "total_repairs_attempted": total_repairs,
        "verified_repairs": verified_repairs,
        "failed_repairs": failed_repairs,
        "recent_activities": [
            {
                "job_id": j.job_id,
                "repository_url": j.repository_url,
                "stage": j.stage.value,
                "bugs_found": j.bugs_found,
                "solutions_verified": j.solutions_verified,
            }
            for j in recent
        ]
    }
