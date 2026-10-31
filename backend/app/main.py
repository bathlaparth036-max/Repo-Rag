"""RepoRAG FastAPI Application Entrypoint."""
import time
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.logging import logger
from app.api.router import api_router

app = FastAPI(
    title="RepoRAG API",
    version=settings.VERSION,
    description="AI-Powered GitHub Repository Intelligence Platform Backend",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Chrome extension, localhost, and dev dashboards
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({round(duration * 1000, 1)}ms)")
    return response


@app.get("/api/info")
def api_info():
    return {
        "name": "RepoRAG Engine",
        "version": settings.VERSION,
        "tagline": "Understand Any Repository. Ask Anything.",
        "status": "operational",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "llm_provider": settings.LLM_PROVIDER,
        "vector_db": settings.VECTOR_DB_TYPE
    }


# Include central API
app.include_router(api_router)

# Mount frontend production build — use a custom class to avoid catching /api/* paths
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    from starlette.responses import FileResponse

    class SPAStaticFiles(StaticFiles):
        """Serves static files and falls back to index.html for SPA routing,
        but ONLY for non-API paths to avoid intercepting backend routes."""
        async def get_response(self, path: str, scope):
            try:
                response = await super().get_response(path, scope)
                if response.status_code != 404:
                    return response
            except Exception:
                pass
            # Fallback: serve index.html for SPA client-side routing
            return FileResponse(str(frontend_dist / "index.html"))

    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="static-assets")
    app.mount("/", SPAStaticFiles(directory=str(frontend_dist), html=False), name="frontend")
else:
    @app.get("/")
    def fallback_root():
        return {
            "name": "RepoRAG Engine",
            "version": settings.VERSION,
            "status": "operational",
            "docs": "/docs"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

