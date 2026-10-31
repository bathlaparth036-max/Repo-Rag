# RepoRAG — Autonomous Software Repair Agent & AI-Powered Repository Intelligence

<p align="center">
  <code style="font-size: 24px; font-weight: bold; color: #00f2fe;">&lt; ◉ &gt; RepoRAG</code><br>
  <b>"Understand Any Repository. Detect Bugs. Fix Them Autonomously."</b><br>
  <i>Your Codebase. Indexed. Analyzed. Repaired.</i>
</p>

---

## 🌟 Overview

RepoRAG is an **Autonomous Software Repair Agent** that combines deep repository intelligence with automated bug detection, root-cause analysis, code patching, testing, and verification. Built on top of a full-featured RAG intelligence platform, it can analyze any public GitHub repository, detect bugs using multi-strategy analysis (AST, static analysis, LLM reasoning), generate and test multiple candidate fixes, and select the best verified solution — all autonomously.

**Core Capabilities:**
1. **Repository Intelligence** — Clone, scan, parse, and index entire codebases with multi-language AST parsing
2. **Autonomous Bug Detection** — 5-strategy pipeline: Python AST syntax validation, import verification, pattern matching, ruff static analysis, Gemini LLM reasoning
3. **Root-Cause Hypothesis Generation** — 2-3 hypotheses per bug with evidence and confidence levels
4. **AI Solution Generation** — LLM-generated code patches with unified diffs
5. **Isolated Patch Testing** — Apply patches to working copies, run tests (pytest/npm), compare before/after
6. **Evidence-Based Selection** — Score and rank solutions, select the best verified fix
7. **Regression Test Generation** — Create tests that prove the fix works
8. **Comprehensive Reporting** — Downloadable JSON/Markdown reports with full audit trail

---

## 🚀 Key Features

| Capability | Description |
| :--- | :--- |
| **🔧 Autonomous Repair** | 10-stage pipeline: clone → analyze → detect bugs → hypothesize → generate solutions → apply patches → run tests → evaluate → select best → generate report |
| **🐛 Multi-Strategy Bug Detection** | AST syntax validation, import checking, pattern matching (division by zero, bare except, mutable defaults), ruff static analysis, and Gemini LLM code reasoning |
| **🧪 Isolated Test Execution** | Tests run in subprocess or Docker containers with timeout protection, resource limits, and no network access |
| **📊 Repair Dashboard** | Real-time progress tracking, live metrics, diff viewer with syntax highlighting, test comparison (before/after) |
| **Grounded AI RAG** | Natural-language questions answered strictly from retrieved code chunks with verifiable file citations and confidence scores |
| **Archify Engine** | Instant visual software architecture generation across 7 views with zoom, pan, and SVG export |
| **Interactive Source Tree** | Virtualized folder tree, language indicators, file complexity, and AI centrality metrics |
| **Knowledge Graph** | 2D node-edge relationship visualizer connecting files, classes, functions, APIs, and commits |
| **Git GUI & Churn Timeline** | Commit timeline, author statistics, branch viewer, and changed file inspection |
| **Change Impact Engine** | Calculate blast radius, affected APIs, and regression risk before touching code |
| **Security Pattern Scan** | Static heuristic analysis identifying hardcoded secrets, unsafe eval, and SQL patterns |
| **New Developer Mode** | AI-generated onboarding guides detailing spin-up steps, main logic, and common pitfalls |

---

## 🏗️ Platform Architecture

```
                              ┌──────────────────────────────────────────────┐
                              │            RepoRAG Chrome Extension          │
                              │  - Manifest V3 Sidepanel & GitHub Injected   │
                              └──────────────────────┬───────────────────────┘
                                                     │ (REST / SSE / WS)
                                                     ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               RepoRAG Web Dashboard (Vite + React + TS)                │
│ ┌───────────────┬──────────────────┬──────────────┬───────────────┬──────────────────┐ │
│ │  Hero Input   │ Source Tree & AST│ Knowledge    │ Archify       │ Git Map & GUI    │ │
│ │  & Ingestion  │ Inspector        │ Graph (2D/3D)│ (Mermaid/SVG) │ & Churn Timeline │ │
│ └───────────────┴──────────────────┴──────────────┴───────────────┴──────────────────┘ │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │ HTTP / SSE / Streaming
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FastAPI Backend Engine (Python 3.14)                      │
│                                                                                        │
│  ┌───────────────────┐    ┌─────────────────────┐    ┌───────────────────────────────┐ │
│  │ Ingestion Engine  │───▶│ Code Understanding  │───▶│ Knowledge Graph Builder       │ │
│  │ - GitHub API      │    │ - AST Parsing       │    │ - Nodes: Files, Classes, Funcs│ │
│  │ - Git Shallow     │    │ - Multi-Lang Parser │    │ - Edges: IMPORTS, CALLS, DEPS │ │
│  │ - Ignore Rules    │    │ - Symbol Extractor  │    └───────────────┬───────────────┘ │
│  └───────────────────┘    └─────────────────────┘                    │                 │
│                                      │                               ▼                 │
│                                      ▼                     ┌─────────────────────────┐ │
│  ┌───────────────────┐    ┌─────────────────────┐          │ Architecture & Health   │ │
│  │ LLM Providers     │◀───│ Hybrid RAG Engine   │◀─────────│ - Archify Engine        │ │
│  │ - Gemini Provider │    │ - Semantic Chunks   │          │ - Security Pattern Scan │ │
│  │ - Local / Mock    │    │ - Vector Store      │          │ - Complexity Scoring    │ │
│  │ - Grounded Synth  │    │ - BM25 + Vector + KG│          │ - Onboarding Synthesis  │ │
│  └───────────────────┘    └─────────────────────┘          └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Quickstart & Local Development

### 1. Prerequisites
- **Node.js** v20+ and npm
- **Python** 3.11+ (Python 3.14 supported)

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend runs locally at: `http://127.0.0.1:8000` (API documentation at `/docs`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs locally at: `http://127.0.0.1:5173`.

### 4. Chrome Extension Installation (Manifest V3)
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the `/extension` directory.
4. Visit any GitHub repository (e.g. `https://github.com/facebook/react`) to see the floating `< ◉ > Analyze with RepoRAG` action!

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
```bash
cd backend
export PYTHONPATH=.
venv/bin/pytest tests -v
```
All 7 test suites verify:
- Health check & API root
- URL validation
- Demo repository pre-loading
- Source tree generation
- Knowledge graph & Archify diagram generation
- Hybrid search & Grounded RAG Chat
- Codebase health telemetry & change impact calculation

---

## 📄 Documentation Links
- [Setup Guide](SETUP.md)
- [Architecture Blueprint](docs/architecture.md)
- [Requirements Audit](REQUIREMENTS_AUDIT.md)
- [RAG Retrieval & Grounding](docs/rag.md)
- [Repository Ingestion Engine](docs/ingestion.md)
- [API Specification](docs/api.md)
- [Security & Privacy](docs/security.md)
