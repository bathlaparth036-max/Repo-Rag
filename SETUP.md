# Setup Guide — RepoRAG Autonomous Repair Agent

## Prerequisites

- **Python 3.11+** 
- **Node.js 18+** (for frontend development)
- **Git** (for repository cloning)
- **Gemini API Key** (optional, for LLM-powered features)

### Optional
- **ruff** (`pip install ruff`) — enables Python static analysis in bug detection
- **Docker** — enables container-isolated test execution

---

## Quick Start

### 1. Clone the repository
```bash
git clone <repo-url>
cd repo-rag-bios
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Optional: install static analysis tools
pip install ruff

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 4. Run the Application
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000** in your browser.

### 5. Development Mode (with hot reload)
```bash
# Terminal 1: Backend with hot reload
cd backend && source venv/bin/activate
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend dev server
cd frontend
npm run dev
# Access at http://localhost:5173 (auto-proxies /api to backend)
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required for LLM features (bug detection, hypothesis generation, solution generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000
LLM_PROVIDER=gemini
DEFAULT_MODEL=gemini-2.0-flash
```

---

## Using the Autonomous Repair Feature

1. Navigate to **http://localhost:8000**
2. Load any repository (demo or paste a GitHub URL)
3. Click the **Auto Repair** tab
4. Enter a GitHub repository URL (e.g., `https://github.com/owner/repo`)
5. Click **Start Repair**
6. Monitor real-time progress through the 10 pipeline stages
7. View the repair report with:
   - Detected bugs with severity and evidence
   - Root-cause hypotheses with confidence levels
   - Candidate solutions with side-by-side diffs
   - Test results (before/after comparison)
   - Verification status (VERIFIED / PARTIALLY_VERIFIED / FAILED)
8. Download the report as Markdown

### Testing with the Demo Buggy Repository

A sample repository with intentional bugs is included at `demo-buggy-repo/`:
- `main.py` — division by zero, bare except, mutable default argument
- `utils.py` — overly simplistic email validation
- `tests/test_main.py` — pytest test suite

To test locally, push this to a GitHub repo and use its URL in the repair tool, or point the repair engine at any public GitHub repository.

---

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Project Structure

```
repo-rag-bios/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint
│   │   ├── core/                      # Config, logging
│   │   ├── api/                       # API route handlers
│   │   │   ├── router.py             # Central router
│   │   │   ├── repositories.py       # Repository CRUD
│   │   │   ├── ingestion.py          # Analysis jobs
│   │   │   ├── chat.py               # RAG chat
│   │   │   ├── search.py             # Hybrid search
│   │   │   ├── health.py             # Health & impact
│   │   │   ├── security.py           # Security scan
│   │   │   ├── voice.py              # Voice assistant
│   │   │   └── repair.py             # ★ Repair API
│   │   ├── repair/                    # ★ Repair engine
│   │   │   ├── models.py             # Pydantic models
│   │   │   ├── bug_detector.py       # Bug detection
│   │   │   ├── hypothesis_engine.py  # Hypothesis generation
│   │   │   ├── solution_generator.py # Solution generation
│   │   │   ├── patch_engine.py       # Patch management
│   │   │   ├── test_runner.py        # Test execution
│   │   │   ├── solution_evaluator.py # Solution scoring
│   │   │   └── regression_test_generator.py
│   │   ├── agents/                    # ★ Pipeline orchestration
│   │   │   ├── state.py              # Shared state
│   │   │   └── repair_graph.py       # 10-stage orchestrator
│   │   ├── rag/                       # RAG pipeline
│   │   ├── ingestion/                 # GitHub/Git ingestion
│   │   ├── parsing/                   # Language/symbol parsing
│   │   ├── architecture/              # Architecture analysis
│   │   ├── services/                  # Business services
│   │   └── models/                    # Data models
│   ├── tests/
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Main app with tabs
│   │   ├── components/
│   │   │   ├── RepairTab.tsx          # ★ Auto Repair UI
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── RAGChatTab.tsx
│   │   │   └── ... (14 total)
│   │   ├── services/api.ts            # API client
│   │   └── types.ts                   # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── demo-buggy-repo/                   # ★ Demo with intentional bugs
├── docs/
├── REQUIREMENTS_AUDIT.md              # ★ Full requirements audit
└── README.md
```

Items marked with ★ are new additions for the autonomous repair feature.
