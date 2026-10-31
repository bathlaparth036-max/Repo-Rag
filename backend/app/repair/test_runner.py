"""Test Runner — executes tests in isolated environments.

Supports:
1. Python projects (pytest)
2. JavaScript/Node projects (npm test)
3. Subprocess-based isolation with timeouts
4. Docker-based isolation when Docker is available
5. Before/after comparison of test results
"""
import os
import sys
import subprocess
import json
import time
import uuid
import shutil
from typing import List, Dict, Optional, Tuple
from app.repair.models import (
    TestCase, TestResult, TestExecutionResult
)
from app.core.logging import logger


class TestRunner:
    """Runs tests in isolated environments with timeout protection."""

    def __init__(self, timeout_seconds: int = 120, use_docker: bool = False):
        self.timeout = timeout_seconds
        self.use_docker = use_docker and self._docker_available()

    def _docker_available(self) -> bool:
        """Check if Docker is available on the host."""
        try:
            result = subprocess.run(
                ["docker", "info"],
                capture_output=True, timeout=5
            )
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    def discover_tests(self, repo_dir: str) -> List[TestCase]:
        """Discover existing test files in the repository."""
        tests = []

        for root, dirs, files in os.walk(repo_dir):
            # Skip common non-test directories
            dirs[:] = [d for d in dirs if d not in {
                'node_modules', '.git', 'venv', '.venv', '__pycache__',
                'dist', 'build', '.next', 'coverage'
            }]

            rel_root = os.path.relpath(root, repo_dir)
            if rel_root == '.':
                rel_root = ''

            for f in files:
                rel_path = os.path.join(rel_root, f) if rel_root else f
                rel_path = rel_path.replace('\\', '/')

                # Python test files
                if f.endswith('.py') and (
                    f.startswith('test_') or f.endswith('_test.py') or
                    '/tests/' in rel_path or '/test/' in rel_path
                ):
                    tests.append(TestCase(
                        test_id=f"test-{uuid.uuid4().hex[:8]}",
                        test_name=rel_path,
                        file_path=rel_path,
                        test_type="existing"
                    ))

                # JavaScript test files
                elif f.endswith(('.test.js', '.test.ts', '.spec.js', '.spec.ts', '.test.jsx', '.test.tsx')):
                    tests.append(TestCase(
                        test_id=f"test-{uuid.uuid4().hex[:8]}",
                        test_name=rel_path,
                        file_path=rel_path,
                        test_type="existing"
                    ))

        return tests

    def detect_project_type(self, repo_dir: str) -> str:
        """Detect the project type (python, node, etc.)."""
        if os.path.exists(os.path.join(repo_dir, 'requirements.txt')) or \
           os.path.exists(os.path.join(repo_dir, 'setup.py')) or \
           os.path.exists(os.path.join(repo_dir, 'pyproject.toml')):
            return 'python'
        elif os.path.exists(os.path.join(repo_dir, 'package.json')):
            return 'node'
        elif os.path.exists(os.path.join(repo_dir, 'go.mod')):
            return 'go'
        elif os.path.exists(os.path.join(repo_dir, 'Cargo.toml')):
            return 'rust'
        return 'unknown'

    async def run_tests(
        self,
        repo_dir: str,
        test_files: Optional[List[str]] = None,
        project_type: Optional[str] = None
    ) -> TestExecutionResult:
        """Run tests in the specified directory."""
        if not project_type:
            project_type = self.detect_project_type(repo_dir)

        if self.use_docker:
            return await self._run_in_docker(repo_dir, project_type, test_files)
        else:
            return await self._run_subprocess(repo_dir, project_type, test_files)

    async def _run_subprocess(
        self,
        repo_dir: str,
        project_type: str,
        test_files: Optional[List[str]] = None
    ) -> TestExecutionResult:
        """Run tests using subprocess with timeout protection."""
        start_time = time.time()

        if project_type == 'python':
            return self._run_pytest(repo_dir, test_files)
        elif project_type == 'node':
            return self._run_npm_test(repo_dir)
        else:
            return TestExecutionResult(
                execution_log=f"Unsupported project type: {project_type}",
                timed_out=False
            )

    def _run_pytest(
        self,
        repo_dir: str,
        test_files: Optional[List[str]] = None
    ) -> TestExecutionResult:
        """Run pytest with JSON output."""
        cmd = [sys.executable, "-m", "pytest", "-v", "--tb=short", "--no-header"]

        if test_files:
            cmd.extend(test_files)

        # Add PYTHONPATH and python dir to PATH for proper imports and subprocess execution
        py_bin_dir = os.path.dirname(sys.executable)
        env = {
            **os.environ,
            "PYTHONPATH": repo_dir,
            "PATH": f"{py_bin_dir}:{os.environ.get('PATH', '')}"
        }

        try:
            result = subprocess.run(
                cmd,
                cwd=repo_dir,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                env=env
            )

            duration = 0.0
            test_results = []
            passed = 0
            failed = 0
            errors = 0
            total = 0

            output = result.stdout + "\n" + result.stderr

            # Parse pytest output for individual test results
            for line in output.splitlines():
                if "PASSED" in line:
                    test_name = line.split("PASSED")[0].strip().split("::")[-1].strip()
                    test_results.append(TestResult(
                        test_name=test_name, passed=True
                    ))
                    passed += 1
                    total += 1
                elif "FAILED" in line:
                    test_name = line.split("FAILED")[0].strip().split("::")[-1].strip()
                    test_results.append(TestResult(
                        test_name=test_name,
                        passed=False,
                        error_message=line
                    ))
                    failed += 1
                    total += 1
                elif "ERROR" in line and "::" in line:
                    errors += 1
                    total += 1

            # Parse duration from pytest summary line
            for line in output.splitlines():
                if "passed" in line or "failed" in line or "error" in line:
                    import re
                    dur_match = re.search(r'in ([\d.]+)s', line)
                    if dur_match:
                        duration = float(dur_match.group(1))

            return TestExecutionResult(
                total_tests=total,
                passed=passed,
                failed=failed,
                errors=errors,
                duration_seconds=duration,
                test_results=test_results,
                execution_log=output,
                timed_out=False
            )

        except subprocess.TimeoutExpired:
            return TestExecutionResult(
                execution_log=f"Test execution timed out after {self.timeout}s",
                timed_out=True
            )
        except Exception as e:
            return TestExecutionResult(
                execution_log=f"Test execution error: {str(e)}",
                errors=1
            )

    def _run_npm_test(self, repo_dir: str) -> TestExecutionResult:
        """Run npm test for Node.js projects."""
        # Check if package.json has a test script
        pkg_path = os.path.join(repo_dir, 'package.json')
        if not os.path.exists(pkg_path):
            return TestExecutionResult(
                execution_log="No package.json found"
            )

        try:
            with open(pkg_path) as f:
                pkg = json.loads(f.read())
                scripts = pkg.get("scripts", {})
                if "test" not in scripts:
                    return TestExecutionResult(
                        execution_log="No 'test' script found in package.json"
                    )
        except Exception:
            pass

        try:
            result = subprocess.run(
                ["npm", "test", "--", "--passWithNoTests"],
                cwd=repo_dir,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )

            output = result.stdout + "\n" + result.stderr
            passed = output.count("✓") + output.count("pass")
            failed = output.count("✗") + output.count("fail")

            return TestExecutionResult(
                total_tests=passed + failed,
                passed=passed,
                failed=failed,
                execution_log=output,
                timed_out=False
            )

        except subprocess.TimeoutExpired:
            return TestExecutionResult(
                execution_log=f"npm test timed out after {self.timeout}s",
                timed_out=True
            )
        except Exception as e:
            return TestExecutionResult(
                execution_log=f"npm test error: {str(e)}"
            )

    async def _run_in_docker(
        self,
        repo_dir: str,
        project_type: str,
        test_files: Optional[List[str]] = None
    ) -> TestExecutionResult:
        """Run tests inside a Docker container for isolation."""
        container_name = f"reporag-test-{uuid.uuid4().hex[:8]}"

        # Choose base image
        if project_type == 'python':
            image = "python:3.11-slim"
            install_cmd = "pip install -r requirements.txt 2>/dev/null || true"
            test_cmd = "python -m pytest -v --tb=short 2>&1"
            if test_files:
                test_cmd = f"python -m pytest -v --tb=short {' '.join(test_files)} 2>&1"
        elif project_type == 'node':
            image = "node:20-slim"
            install_cmd = "npm ci --silent 2>/dev/null || npm install --silent 2>/dev/null || true"
            test_cmd = "npm test -- --passWithNoTests 2>&1"
        else:
            return TestExecutionResult(
                execution_log=f"Docker testing not supported for project type: {project_type}"
            )

        try:
            # Run container with: no network, resource limits, non-root, read-only where possible
            cmd = [
                "docker", "run",
                "--name", container_name,
                "--rm",
                "--network=none",  # No network access
                "--memory=512m",  # Memory limit
                "--cpus=1",  # CPU limit
                "--user", "1000:1000",  # Non-root
                "--read-only",  # Read-only filesystem
                "--tmpfs", "/tmp:rw,size=100m",  # Writable tmp
                "-v", f"{os.path.abspath(repo_dir)}:/workspace:ro",  # Mount repo read-only
                "-w", "/workspace",
                image,
                "sh", "-c", f"cp -r /workspace /tmp/work && cd /tmp/work && {install_cmd} && {test_cmd}"
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.timeout + 30  # Extra time for container startup
            )

            output = result.stdout + "\n" + result.stderr
            return self._parse_test_output(output, project_type)

        except subprocess.TimeoutExpired:
            # Kill the container
            subprocess.run(
                ["docker", "rm", "-f", container_name],
                capture_output=True, timeout=10
            )
            return TestExecutionResult(
                execution_log=f"Docker test execution timed out after {self.timeout}s",
                timed_out=True
            )
        except Exception as e:
            return TestExecutionResult(
                execution_log=f"Docker execution error: {str(e)}"
            )

    def _parse_test_output(
        self, output: str, project_type: str
    ) -> TestExecutionResult:
        """Parse test output from Docker container."""
        passed = 0
        failed = 0
        test_results = []

        for line in output.splitlines():
            if "PASSED" in line:
                passed += 1
                name = line.split("PASSED")[0].strip().split("::")[-1].strip()
                test_results.append(TestResult(test_name=name, passed=True))
            elif "FAILED" in line:
                failed += 1
                name = line.split("FAILED")[0].strip().split("::")[-1].strip()
                test_results.append(TestResult(test_name=name, passed=False, error_message=line))

        return TestExecutionResult(
            total_tests=passed + failed,
            passed=passed,
            failed=failed,
            test_results=test_results,
            execution_log=output
        )

    async def run_regression_test(
        self,
        repo_dir: str,
        test_code: str,
        test_filename: str = "test_regression_reporag.py"
    ) -> TestExecutionResult:
        """Write and run a regression test in the workspace."""
        test_path = os.path.join(repo_dir, test_filename)

        try:
            with open(test_path, 'w', encoding='utf-8') as f:
                f.write(test_code)

            result = await self.run_tests(
                repo_dir, test_files=[test_filename], project_type='python'
            )

            return result
        except Exception as e:
            return TestExecutionResult(
                execution_log=f"Regression test execution failed: {str(e)}"
            )
        finally:
            # Clean up the regression test file
            if os.path.exists(test_path):
                try:
                    os.remove(test_path)
                except Exception:
                    pass
