# Security & Privacy Guidelines

## 1. Grounding & Zero-Hallucination
RepoRAG adheres to strict evidence constraints. If code evidence cannot be verified in the indexed repository, the system explicitly reports:
`"I couldn't find sufficient evidence in the indexed repository."`

## 2. Security Scan Guardrails
All findings produced by the security pattern auditor are explicitly labeled as **Potential issues**, not confirmed CVEs or vulnerabilities.

## 3. Privacy & Compliance
- Data purge endpoint `DELETE /api/repositories/{id}` permanently evicts stored intelligence, AST cache, and vector embeddings from the server.
- No repository tokens or passwords are required for public repository ingestion or demo exploration.

## 4. Repair Sandbox Security
The autonomous repair engine operates under strict isolation:

### Workspace Isolation
- All patches are applied to **isolated working copies** — the original cloned repository is never modified
- Working copies are created in `data/repair_workspaces/` with automatic cleanup after completion
- Each repair job gets a unique workspace directory

### Test Execution Safety
- **Subprocess isolation**: Tests run in separate processes with configurable timeouts (default: 120 seconds)
- **Docker isolation** (when available): Tests execute in containers with:
  - `--network=none` — No network access
  - `--memory=512m` — Memory limit
  - `--cpus=1` — CPU limit
  - `--user 1000:1000` — Non-root execution
  - `--read-only` — Read-only filesystem (writable `/tmp` only)
  - Repository mounted read-only (`-v repo:/workspace:ro`)

### Patch Validation
- All patches undergo **syntax validation** (Python AST parsing, JSON validation) before test execution
- **Unrelated modification detection** flags patches that change too many files or have suspicious change ratios
- Git-based rollback available if patches need to be reverted

### LLM Security
- Gemini API calls use the application's API key — no user credentials are sent to the LLM
- Code sent to the LLM is limited to relevant snippets, not entire repositories
- LLM responses are parsed structurally — no arbitrary code execution from LLM output
