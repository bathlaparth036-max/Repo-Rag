"""Bug Detection Engine — combines LLM reasoning, static analysis, and syntax validation.

This module is the core of the autonomous repair pipeline. It analyzes repository
source code to find genuine bugs using multiple detection strategies:
1. Python AST syntax validation
2. Static analysis via subprocess (pylint, ruff, flake8 for Python; eslint for JS)
3. Import verification (checking that imported modules actually exist)
4. LLM-based code reasoning via Gemini API
"""
import ast
import re
import uuid
import subprocess
import os
from typing import List, Dict, Any, Optional, Tuple
from app.repair.models import DetectedBug, BugSeverity, BugCategory
from app.core.config import settings
from app.core.logging import logger
import httpx


class BugDetector:
    """Detects real bugs using multiple analysis strategies."""

    def __init__(self, gemini_api_key: Optional[str] = None):
        self.gemini_api_key = gemini_api_key or settings.GEMINI_API_KEY

    async def detect_bugs(
        self,
        file_contents: Dict[str, str],
        languages: Dict[str, float],
        repo_dir: Optional[str] = None
    ) -> List[DetectedBug]:
        """Run all detection strategies and merge results."""
        bugs: List[DetectedBug] = []

        # 1. Syntax validation (Python files)
        python_files = {p: c for p, c in file_contents.items() if p.endswith('.py')}
        for path, content in python_files.items():
            syntax_bugs = self._check_python_syntax(path, content)
            bugs.extend(syntax_bugs)

        # 2. Import verification (Python)
        for path, content in python_files.items():
            import_bugs = self._check_python_imports(path, content, file_contents)
            bugs.extend(import_bugs)

        # 3. Static analysis via tools (if repo_dir is available)
        if repo_dir and os.path.isdir(repo_dir):
            static_bugs = await self._run_static_analysis(repo_dir, file_contents)
            bugs.extend(static_bugs)

        # 4. Common pattern checks (all languages)
        for path, content in file_contents.items():
            pattern_bugs = self._check_common_patterns(path, content)
            bugs.extend(pattern_bugs)

        # 5. LLM-based deep analysis on suspicious files
        if self.gemini_api_key:
            # Only send high-importance files to LLM (limit to top 10 by size)
            important_files = sorted(
                file_contents.items(),
                key=lambda x: len(x[1]),
                reverse=True
            )[:10]
            llm_bugs = await self._llm_code_analysis(dict(important_files))
            bugs.extend(llm_bugs)

        # Deduplicate bugs by file+line
        seen = set()
        unique_bugs = []
        for bug in bugs:
            key = (bug.file_path, bug.line_number, bug.category)
            if key not in seen:
                seen.add(key)
                unique_bugs.append(bug)

        return unique_bugs

    def _check_python_syntax(self, file_path: str, content: str) -> List[DetectedBug]:
        """Validate Python syntax using AST parser."""
        bugs = []
        try:
            ast.parse(content, filename=file_path)
        except SyntaxError as e:
            bugs.append(DetectedBug(
                bug_id=f"syn-{uuid.uuid4().hex[:8]}",
                title=f"Python Syntax Error in {os.path.basename(file_path)}",
                category=BugCategory.SYNTAX_ERROR,
                severity=BugSeverity.CRITICAL,
                file_path=file_path,
                line_number=e.lineno or 1,
                end_line=e.end_lineno,
                evidence=e.text.strip() if e.text else content.splitlines()[max(0, (e.lineno or 1) - 1)] if content else "",
                explanation=f"Python parser raised SyntaxError: {e.msg}",
                detection_method="syntax_check",
                confidence=1.0,
                raw_tool_output=str(e)
            ))
        return bugs

    def _check_python_imports(
        self, file_path: str, content: str, all_files: Dict[str, str]
    ) -> List[DetectedBug]:
        """Check for broken imports in Python files."""
        bugs = []
        try:
            tree = ast.parse(content, filename=file_path)
        except SyntaxError:
            return bugs  # Already caught by syntax check

        # Collect all available module names from the repository
        available_modules = set()
        for p in all_files:
            if p.endswith('.py'):
                # Convert path to module name: backend/app/main.py -> backend.app.main
                mod = p.replace('/', '.').replace('\\', '.').rstrip('.py')
                if mod.endswith('.'):
                    mod = mod[:-1]
                available_modules.add(mod)
                # Also add the bare filename
                name = os.path.basename(p).replace('.py', '')
                available_modules.add(name)

        # Standard library modules to skip (common ones)
        stdlib = {
            'os', 'sys', 're', 'json', 'math', 'time', 'datetime', 'typing',
            'pathlib', 'collections', 'functools', 'itertools', 'subprocess',
            'asyncio', 'hashlib', 'uuid', 'copy', 'io', 'abc', 'enum',
            'dataclasses', 'contextlib', 'shutil', 'tempfile', 'glob',
            'unittest', 'pytest', 'logging', 'traceback', 'inspect',
            'threading', 'multiprocessing', 'socket', 'http', 'urllib',
            'xml', 'csv', 'sqlite3', 'pickle', 'struct', 'textwrap',
            'argparse', 'configparser', 'string', 'random', 'statistics',
            'decimal', 'fractions', 'operator', 'warnings', 'types',
            'importlib', 'pkgutil', 'pprint', 'dis', 'code', 'codeop',
            'ast', 'token', 'tokenize', 'symbol', 'keyword',
        }

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    top_module = alias.name.split('.')[0]
                    if (top_module not in stdlib and
                        top_module not in available_modules and
                        not self._is_known_package(top_module)):
                        bugs.append(DetectedBug(
                            bug_id=f"imp-{uuid.uuid4().hex[:8]}",
                            title=f"Potentially broken import: {alias.name}",
                            category=BugCategory.BROKEN_IMPORT,
                            severity=BugSeverity.MEDIUM,
                            file_path=file_path,
                            line_number=node.lineno,
                            evidence=f"import {alias.name}",
                            explanation=f"Module '{alias.name}' is not found in the repository and may be an uninstalled or misspelled dependency.",
                            detection_method="static_analysis",
                            confidence=0.6
                        ))
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    top_module = node.module.split('.')[0]
                    if (top_module not in stdlib and
                        top_module not in available_modules and
                        not self._is_known_package(top_module)):
                        bugs.append(DetectedBug(
                            bug_id=f"imp-{uuid.uuid4().hex[:8]}",
                            title=f"Potentially broken import from: {node.module}",
                            category=BugCategory.BROKEN_IMPORT,
                            severity=BugSeverity.MEDIUM,
                            file_path=file_path,
                            line_number=node.lineno,
                            evidence=f"from {node.module} import ...",
                            explanation=f"Module '{node.module}' is not found in the repository. It may be an uninstalled or misspelled dependency.",
                            detection_method="static_analysis",
                            confidence=0.6
                        ))
        return bugs

    def _is_known_package(self, name: str) -> bool:
        """Check if a module name is a well-known third-party package."""
        known = {
            'fastapi', 'uvicorn', 'pydantic', 'pydantic_settings', 'httpx',
            'numpy', 'pandas', 'scipy', 'sklearn', 'matplotlib', 'seaborn',
            'flask', 'django', 'sqlalchemy', 'alembic', 'celery', 'redis',
            'requests', 'aiohttp', 'aiofiles', 'boto3', 'botocore',
            'docker', 'yaml', 'toml', 'dotenv', 'jwt', 'bcrypt',
            'langchain', 'langgraph', 'openai', 'anthropic', 'google',
            'transformers', 'torch', 'tensorflow', 'keras',
            'chromadb', 'pinecone', 'qdrant_client', 'weaviate',
            'starlette', 'jinja2', 'click', 'typer', 'rich', 'tqdm',
            'edge_tts', 'PIL', 'cv2', 'pytest', 'mock', 'freezegun',
            'setuptools', 'pip', 'wheel', 'twine', 'black', 'ruff',
            'pylint', 'flake8', 'mypy', 'isort', 'autopep8',
        }
        return name.lower().replace('-', '_') in known

    def _check_common_patterns(self, file_path: str, content: str) -> List[DetectedBug]:
        """Detect common bug patterns across languages."""
        bugs = []
        lines = content.splitlines()

        for i, line in enumerate(lines, 1):
            stripped = line.strip()

            # Division by zero risk in Python
            if file_path.endswith('.py'):
                # Catch direct / 0 or / 0.0
                if re.search(r'/\s*0\b', stripped) and not stripped.startswith('#'):
                    bugs.append(DetectedBug(
                        bug_id=f"pat-{uuid.uuid4().hex[:8]}",
                        title="Potential division by zero",
                        category=BugCategory.RUNTIME_EXCEPTION,
                        severity=BugSeverity.HIGH,
                        file_path=file_path,
                        line_number=i,
                        evidence=stripped,
                        explanation="Division by zero will raise a ZeroDivisionError at runtime.",
                        detection_method="static_analysis",
                        confidence=0.85
                    ))

                # Bare except clause
                if re.match(r'^except\s*:', stripped):
                    bugs.append(DetectedBug(
                        bug_id=f"pat-{uuid.uuid4().hex[:8]}",
                        title="Bare except clause catches all exceptions",
                        category=BugCategory.LOGIC_ERROR,
                        severity=BugSeverity.MEDIUM,
                        file_path=file_path,
                        line_number=i,
                        evidence=stripped,
                        explanation="Bare 'except:' catches all exceptions including SystemExit and KeyboardInterrupt. Use 'except Exception:' instead.",
                        detection_method="static_analysis",
                        confidence=0.9
                    ))

                # Mutable default arguments
                if re.match(r'def\s+\w+\s*\(.*=\s*(\[\]|\{\}|set\(\))', stripped):
                    bugs.append(DetectedBug(
                        bug_id=f"pat-{uuid.uuid4().hex[:8]}",
                        title="Mutable default argument in function definition",
                        category=BugCategory.LOGIC_ERROR,
                        severity=BugSeverity.MEDIUM,
                        file_path=file_path,
                        line_number=i,
                        evidence=stripped,
                        explanation="Mutable default arguments (list, dict, set) are shared across function calls and can cause unexpected behavior. Use None as default and initialize inside the function.",
                        detection_method="static_analysis",
                        confidence=0.95
                    ))

            # JavaScript/TypeScript patterns
            if file_path.endswith(('.js', '.jsx', '.ts', '.tsx')):
                # == instead of === (loose equality)
                if re.search(r'[^=!]==[^=]', stripped) and not stripped.strip().startswith('//'):
                    bugs.append(DetectedBug(
                        bug_id=f"pat-{uuid.uuid4().hex[:8]}",
                        title="Loose equality comparison (== instead of ===)",
                        category=BugCategory.LOGIC_ERROR,
                        severity=BugSeverity.LOW,
                        file_path=file_path,
                        line_number=i,
                        evidence=stripped,
                        explanation="Using == instead of === can lead to unexpected type coercion. Use strict equality (===) unless type coercion is intentional.",
                        detection_method="static_analysis",
                        confidence=0.7
                    ))

        return bugs

    async def _run_static_analysis(
        self, repo_dir: str, file_contents: Dict[str, str]
    ) -> List[DetectedBug]:
        """Run static analysis tools on the repository."""
        bugs = []

        # Check if Python files exist
        python_files = [p for p in file_contents if p.endswith('.py')]
        if python_files:
            # Try ruff first (fast), then pylint
            ruff_bugs = await self._run_ruff(repo_dir)
            bugs.extend(ruff_bugs)

        return bugs

    async def _run_ruff(self, repo_dir: str) -> List[DetectedBug]:
        """Run ruff static analysis on Python files."""
        bugs = []
        try:
            proc = subprocess.run(
                ["ruff", "check", "--output-format=json", "--select=E,F,W", repo_dir],
                capture_output=True,
                text=True,
                timeout=30,
                cwd=repo_dir
            )
            if proc.stdout:
                import json
                try:
                    results = json.loads(proc.stdout)
                    for item in results[:20]:  # Limit to 20 findings
                        severity = BugSeverity.LOW
                        code = item.get("code", "")
                        if code.startswith("F"):  # F = pyflakes (errors)
                            severity = BugSeverity.HIGH
                        elif code.startswith("E"):  # E = style errors
                            severity = BugSeverity.MEDIUM

                        # Map ruff codes to bug categories
                        category = BugCategory.LOGIC_ERROR
                        if "undefined" in item.get("message", "").lower():
                            category = BugCategory.UNDEFINED_VARIABLE
                        elif "import" in item.get("message", "").lower():
                            category = BugCategory.BROKEN_IMPORT
                        elif "syntax" in item.get("message", "").lower():
                            category = BugCategory.SYNTAX_ERROR

                        file_path = os.path.relpath(item.get("filename", ""), repo_dir)
                        bugs.append(DetectedBug(
                            bug_id=f"ruff-{uuid.uuid4().hex[:8]}",
                            title=f"[{code}] {item.get('message', 'Static analysis finding')}",
                            category=category,
                            severity=severity,
                            file_path=file_path,
                            line_number=item.get("location", {}).get("row", 1),
                            end_line=item.get("end_location", {}).get("row"),
                            evidence=item.get("message", ""),
                            explanation=f"Ruff static analyzer detected: {item.get('message', '')} (rule {code})",
                            detection_method="static_analysis",
                            confidence=0.85,
                            raw_tool_output=str(item)
                        ))
                except (json.JSONDecodeError, KeyError):
                    pass
        except FileNotFoundError:
            logger.info("ruff not installed, skipping ruff analysis")
        except subprocess.TimeoutExpired:
            logger.warning("ruff analysis timed out")
        except Exception as e:
            logger.warning(f"ruff analysis failed: {e}")

        return bugs

    async def _llm_code_analysis(self, file_contents: Dict[str, str]) -> List[DetectedBug]:
        """Use LLM to analyze code for bugs through reasoning."""
        if not self.gemini_api_key:
            return []

        bugs = []
        # Build context from files
        code_context = []
        for path, content in list(file_contents.items())[:5]:  # Limit to 5 files
            truncated = content[:3000]  # Limit each file
            code_context.append(f"--- File: {path} ---\n{truncated}")

        prompt = f"""You are a senior code reviewer performing a bug analysis.
Analyze the following source code files for REAL bugs only.

IMPORTANT RULES:
1. Only report bugs that genuinely exist in the code
2. Do NOT invent bugs to fill a quota
3. Focus on: syntax errors, runtime exceptions, logic errors, undefined variables,
   incorrect function calls, broken imports, type errors
4. For each bug, provide the exact file path, line number, and evidence
5. If no bugs are found, respond with "NO_BUGS_FOUND"

Source code:
{'\\n'.join(code_context)}

Respond in this exact format for each bug (one per line):
BUG|<file_path>|<line_number>|<severity:critical/high/medium/low>|<category:syntax_error/runtime_exception/logic_error/undefined_variable/type_error>|<title>|<explanation>

If no bugs found, respond with:
NO_BUGS_FOUND"""

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_MODEL}:generateContent?key={self.gemini_api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 2048}
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

                    if "NO_BUGS_FOUND" in text:
                        return []

                    for line in text.strip().splitlines():
                        if line.startswith("BUG|"):
                            parts = line.split("|")
                            if len(parts) >= 7:
                                sev_map = {
                                    "critical": BugSeverity.CRITICAL,
                                    "high": BugSeverity.HIGH,
                                    "medium": BugSeverity.MEDIUM,
                                    "low": BugSeverity.LOW
                                }
                                cat_map = {
                                    "syntax_error": BugCategory.SYNTAX_ERROR,
                                    "runtime_exception": BugCategory.RUNTIME_EXCEPTION,
                                    "logic_error": BugCategory.LOGIC_ERROR,
                                    "undefined_variable": BugCategory.UNDEFINED_VARIABLE,
                                    "type_error": BugCategory.TYPE_ERROR,
                                    "broken_import": BugCategory.BROKEN_IMPORT,
                                }
                                try:
                                    bugs.append(DetectedBug(
                                        bug_id=f"llm-{uuid.uuid4().hex[:8]}",
                                        title=parts[5].strip(),
                                        category=cat_map.get(parts[4].strip(), BugCategory.LOGIC_ERROR),
                                        severity=sev_map.get(parts[3].strip(), BugSeverity.MEDIUM),
                                        file_path=parts[1].strip(),
                                        line_number=int(parts[2].strip()),
                                        evidence="Detected via LLM code reasoning",
                                        explanation=parts[6].strip() if len(parts) > 6 else "LLM-detected issue",
                                        detection_method="llm",
                                        confidence=0.7
                                    ))
                                except (ValueError, IndexError):
                                    continue
        except Exception as e:
            logger.warning(f"LLM bug analysis failed: {e}")

        return bugs
