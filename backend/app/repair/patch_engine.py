"""Patch Engine — applies candidate patches to isolated working copies.

This module handles:
1. Creating isolated working copies of repositories
2. Applying code patches (modified file content)
3. Validating patch syntax
4. Generating Git diffs
5. Rolling back unsuccessful patches
6. Never modifying the original repository
"""
import os
import shutil
import subprocess
import ast
import uuid
import difflib
from typing import List, Dict, Optional, Tuple
from app.repair.models import CandidateSolution, CodeChange, PatchResult
from app.core.logging import logger


class PatchEngine:
    """Applies patches to isolated working copies and manages rollback."""

    def __init__(self, workspace_base: str = "./data/repair_workspaces"):
        self.workspace_base = os.path.abspath(workspace_base)
        os.makedirs(self.workspace_base, exist_ok=True)

    def create_working_copy(self, original_dir: str, job_id: str) -> str:
        """Create an isolated copy of the repository for patch experimentation."""
        workspace_dir = os.path.join(self.workspace_base, f"repair-{job_id}")

        if os.path.exists(workspace_dir):
            shutil.rmtree(workspace_dir, ignore_errors=True)

        # Copy the original directory (excluding .git for speed, re-init after)
        shutil.copytree(
            original_dir,
            workspace_dir,
            ignore=shutil.ignore_patterns('.git', '__pycache__', 'node_modules', '.venv', 'venv')
        )

        # Initialize a fresh git repo so we can generate diffs
        try:
            subprocess.run(
                ["git", "init"], cwd=workspace_dir,
                capture_output=True, timeout=10
            )
            subprocess.run(
                ["git", "add", "."], cwd=workspace_dir,
                capture_output=True, timeout=15
            )
            subprocess.run(
                ["git", "commit", "-m", "Initial state before repair", "--allow-empty"],
                cwd=workspace_dir, capture_output=True, timeout=15,
                env={**os.environ, "GIT_AUTHOR_NAME": "RepoRAG", "GIT_AUTHOR_EMAIL": "repair@reporag.dev",
                     "GIT_COMMITTER_NAME": "RepoRAG", "GIT_COMMITTER_EMAIL": "repair@reporag.dev"}
            )
        except Exception as e:
            logger.warning(f"Git init in workspace failed: {e}")

        return workspace_dir

    def apply_patch(
        self,
        workspace_dir: str,
        solution: CandidateSolution
    ) -> PatchResult:
        """Apply a candidate solution's code changes to the workspace."""
        files_modified = []
        all_diffs = []

        try:
            for change in solution.code_changes:
                target_path = os.path.join(workspace_dir, change.file_path)

                # Ensure the directory exists
                os.makedirs(os.path.dirname(target_path), exist_ok=True)

                # Read original content for verification
                original = ""
                if os.path.exists(target_path):
                    with open(target_path, 'r', encoding='utf-8', errors='replace') as f:
                        original = f.read()

                # Write modified content
                with open(target_path, 'w', encoding='utf-8') as f:
                    f.write(change.modified_content)

                files_modified.append(change.file_path)

                # Generate diff if not already provided
                if change.diff:
                    all_diffs.append(change.diff)
                else:
                    diff = self._generate_diff(original, change.modified_content, change.file_path)
                    all_diffs.append(diff)

            # Validate syntax of modified files
            syntax_valid = self._validate_syntax(workspace_dir, files_modified)

            # Check for unrelated changes
            unrelated = self._check_unrelated_changes(solution)

            # Generate a git diff
            git_diff = self._git_diff(workspace_dir)
            combined_diff = git_diff if git_diff else "\n".join(all_diffs)

            return PatchResult(
                solution_id=solution.solution_id,
                applied_successfully=True,
                diff_output=combined_diff,
                files_modified=files_modified,
                syntax_valid=syntax_valid,
                unrelated_changes=unrelated
            )

        except Exception as e:
            logger.error(f"Patch application failed: {e}")
            return PatchResult(
                solution_id=solution.solution_id,
                applied_successfully=False,
                error=str(e)
            )

    def rollback_patch(self, workspace_dir: str) -> bool:
        """Rollback all changes in the workspace to the initial state."""
        try:
            subprocess.run(
                ["git", "checkout", "."],
                cwd=workspace_dir,
                capture_output=True,
                timeout=10
            )
            subprocess.run(
                ["git", "clean", "-fd"],
                cwd=workspace_dir,
                capture_output=True,
                timeout=10
            )
            return True
        except Exception as e:
            logger.error(f"Rollback failed: {e}")
            return False

    def cleanup_workspace(self, workspace_dir: str):
        """Remove a workspace directory after repair is complete."""
        try:
            if os.path.exists(workspace_dir):
                shutil.rmtree(workspace_dir, ignore_errors=True)
        except Exception as e:
            logger.warning(f"Workspace cleanup failed: {e}")

    def _validate_syntax(self, workspace_dir: str, files: List[str]) -> bool:
        """Validate syntax of modified files."""
        for file_path in files:
            full_path = os.path.join(workspace_dir, file_path)
            if not os.path.exists(full_path):
                continue

            with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()

            if file_path.endswith('.py'):
                try:
                    ast.parse(content, filename=file_path)
                except SyntaxError as e:
                    logger.warning(f"Syntax error in patched file {file_path}: {e}")
                    return False

            elif file_path.endswith('.json'):
                import json
                try:
                    json.loads(content)
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON syntax error in {file_path}: {e}")
                    return False

        return True

    def _check_unrelated_changes(self, solution: CandidateSolution) -> bool:
        """Check if the solution modifies files unrelated to the bug."""
        # Simple heuristic: if more than 3 files are changed, flag as potentially unrelated
        if len(solution.code_changes) > 3:
            return True

        # Check if change ratio is suspiciously large
        for change in solution.code_changes:
            original_lines = len(change.original_content.splitlines())
            modified_lines = len(change.modified_content.splitlines())
            if original_lines > 0:
                change_ratio = abs(modified_lines - original_lines) / original_lines
                if change_ratio > 0.5:  # More than 50% change in file size
                    return True

        return False

    def _git_diff(self, workspace_dir: str) -> str:
        """Generate a git diff of all changes in the workspace."""
        try:
            result = subprocess.run(
                ["git", "diff"],
                cwd=workspace_dir,
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                return result.stdout
        except Exception as e:
            logger.warning(f"Git diff failed: {e}")
        return ""

    @staticmethod
    def _generate_diff(original: str, modified: str, file_path: str) -> str:
        """Generate unified diff between two strings."""
        return "\n".join(difflib.unified_diff(
            original.splitlines(keepends=True),
            modified.splitlines(keepends=True),
            fromfile=f"a/{file_path}",
            tofile=f"b/{file_path}",
            lineterm=""
        ))
