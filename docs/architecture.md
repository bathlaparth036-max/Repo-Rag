# RepoRAG Architecture Documentation

## Overview
RepoRAG is an **Autonomous Software Repair Agent** built around modular, decoupled subsystems that process unstructured GitHub code repositories into structured knowledge graphs, verifiable vector indices, and automated bug detection, patching, and verification pipelines.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)               │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Overview  │ │ RAG Chat │ │ Source   │ │  Auto Repair Tab  │  │
│  │ Tab       │ │ Tab      │ │ Tree Tab │ │  - Bug Analysis   │  │
│  │           │ │          │ │          │ │  - Diff Viewer     │  │
│  │           │ │          │ │          │ │  - Test Results    │  │
│  │           │ │          │ │          │ │  - Dashboard       │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│  + Archify, Knowledge Graph, Git Map, Dependencies, Health,     │
│    Onboarding, Voice Assistant, Command Palette                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼───────────────────────────────────────┐
│                     FastAPI Backend (Python)                      │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                        API Layer                             │  │
│  │  /api/repositories  /api/chat  /api/search  /api/ingestion  │  │
│  │  /api/health  /api/security  /api/voice  /api/repair/*      │  │
│  └────────────┬─────────────────────────────┬──────────────────┘  │
│               │                             │                      │
│  ┌────────────▼────────────┐   ┌────────────▼────────────────┐   │
│  │   Repository Services   │   │   Repair Engine (NEW)       │   │
│  │                         │   │                              │   │
│  │  • RepositoryService    │   │  • BugDetector              │   │
│  │  • AnalysisService      │   │  • HypothesisEngine         │   │
│  │  • ChatService          │   │  • SolutionGenerator        │   │
│  │                         │   │  • PatchEngine              │   │
│  └────────────┬────────────┘   │  • TestRunner               │   │
│               │                │  • SolutionEvaluator         │   │
│  ┌────────────▼────────────┐   │  • RegressionTestGenerator  │   │
│  │   RAG Pipeline          │   │  • RepairOrchestrator        │   │
│  │                         │   └──────────────────────────────┘   │
│  │  • SemanticChunker      │                                      │
│  │  • VectorStore          │   ┌──────────────────────────────┐   │
│  │  • HybridRetriever      │   │   Parsing & Ingestion        │   │
│  │  • AnswerGenerator      │   │                              │   │
│  │  • EmbeddingProvider    │   │  • GitHubClient              │   │
│  └─────────────────────────┘   │  • RepositoryCloner          │   │
│                                │  • FileScanner               │   │
│  ┌─────────────────────────┐   │  • SymbolExtractor           │   │
│  │   Architecture Engine   │   │  • DependencyAnalyzer        │   │
│  │                         │   │  • LanguageDetector           │   │
│  │  • ArchitectureAnalyzer │   └──────────────────────────────┘   │
│  │  • KnowledgeGraphBuilder│                                      │
│  │  • DiagramGenerator     │                                      │
│  └─────────────────────────┘                                      │
└───────────────────────────────────────────────────────────────────┘
```

---

## Subsystems

### 1. Ingestion & Scanner (`app.ingestion`)
Handles GitHub REST API tree retrieval, Git shallow clone (`--depth 1`), branch detection, and filtering out build artifacts and binary assets.

### 2. Parsing & AST Analysis (`app.parsing`)
Multi-language symbol identification extracting classes, functions, routes, database queries, and imports. Supports Python (real AST), JavaScript/TypeScript, Java, Go, Rust, C/C++ (regex-based).

### 3. Knowledge Graph Engine (`app.architecture.graph_builder`)
Connects semantic code entities with directed relation edges (`CONTAINS`, `IMPORTS`, `CALLS`, `DEPENDS_ON`, `EXPOSES`, `CHANGED_BY`).

### 4. Archify Engine (`app.architecture.diagram_generator`)
Generates Mermaid.js architecture diagrams across 7 perspectives (system, class, sequence, data flow, auth flow, deployment, ER).

### 5. Hybrid RAG Retriever (`app.rag`)
Combines 4-way retrieval: vector cosine similarity, BM25 token overlap, AST symbol matching, and path heuristics. Produces grounded answers with evidence citations.

### 6. Autonomous Repair Engine (`app.repair`) — **NEW**
Complete 10-stage pipeline for autonomous software repair:

| Stage | Module | Description |
|:---|:---|:---|
| 1 | `RepositoryCloner` | Clone target repository |
| 2 | `FileScanner` + `LanguageDetector` | Analyze files and detect languages |
| 3 | `TestRunner.discover_tests` | Find existing test files |
| 4 | `BugDetector` | Detect bugs (AST + static analysis + LLM) |
| 5 | `HypothesisEngine` | Generate 2-3 root-cause hypotheses |
| 6 | `SolutionGenerator` | Create candidate code patches via LLM |
| 7 | `PatchEngine` | Apply patches to isolated working copies |
| 8 | `TestRunner` | Run tests before and after patching |
| 9 | `SolutionEvaluator` | Score and select the best solution |
| 10 | `RepairReport` | Generate comprehensive repair report |

#### Bug Detection Strategies
1. **Python AST Syntax Validation** — catches SyntaxError with exact line numbers
2. **Import Verification** — checks imports against repo files and known packages
3. **Pattern Detection** — division by zero, bare except, mutable defaults, loose equality
4. **Static Analysis** — runs `ruff` via subprocess with JSON output parsing
5. **LLM Code Reasoning** — sends code to Gemini for deep analysis

#### Solution Evaluation Criteria
- Syntax validity (+20 points)
- Focused changes, no unrelated modifications (+10 points)
- Test pass rate maintained or improved (+30-40 points)
- Regression test passes (+20 points)
- Risk level assessment (+10 points for low risk)

Solutions scoring ≥70 with passing tests → **VERIFIED**

---

## API Routes

### Existing Routes
| Method | Path | Purpose |
|:---|:---|:---|
| `GET` | `/api/info` | API metadata |
| `GET` | `/health` | Health check |
| `POST` | `/api/repositories/validate` | Validate GitHub URL |
| `GET` | `/api/repositories/demo` | Load demo repository |
| `GET` | `/api/repositories/{id}` | Get repository intelligence |
| `GET` | `/api/repositories/{id}/tree` | Source tree |
| `GET` | `/api/repositories/{id}/graph` | Knowledge graph |
| `GET` | `/api/repositories/{id}/diagrams` | Mermaid diagrams |
| `POST` | `/api/ingestion/analyze` | Start analysis job |
| `POST` | `/api/chat/ask` | RAG grounded chat |
| `POST` | `/api/search/hybrid` | Hybrid search |
| `GET` | `/api/health/{id}` | Health metrics |
| `GET` | `/api/security/{id}/scan` | Security scan |

### New Repair Routes
| Method | Path | Purpose |
|:---|:---|:---|
| `POST` | `/api/repair/start` | Start autonomous repair job |
| `GET` | `/api/repair/status/{job_id}` | Real-time progress tracking |
| `GET` | `/api/repair/report/{job_id}` | Full JSON repair report |
| `GET` | `/api/repair/report/{job_id}/markdown` | Downloadable markdown report |
| `GET` | `/api/repair/jobs` | List all repair jobs |
| `GET` | `/api/repair/dashboard` | Dashboard metrics |

---

## Technology Stack

| Layer | Technology |
|:---|:---|
| Backend | FastAPI, Pydantic, httpx, numpy |
| Frontend | React 19, TypeScript, Vite, TailwindCSS |
| LLM | Google Gemini API |
| Embeddings | Local hash-based + Gemini |
| Voice | edge-tts (Microsoft Neural TTS) |
| Diagrams | Mermaid.js |
| Testing | pytest, subprocess isolation |
| Static Analysis | ruff (optional) |
| Icons | Lucide React |
