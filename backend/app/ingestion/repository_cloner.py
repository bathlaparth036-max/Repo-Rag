"""Git shallow clone ingestion pipeline for rate-limit-free repository ingestion."""
import os
import shutil
import subprocess
import asyncio
from typing import Dict, Any, List, Optional, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.models.file import TreeNode, FileInfo
from app.models.repository import GitCommit
from app.ingestion.file_scanner import FileScanner


class RepositoryCloner:
    def __init__(self, base_cache_dir: str = "./data/cloned_repos"):
        self.base_cache_dir = os.path.abspath(base_cache_dir)
        os.makedirs(self.base_cache_dir, exist_ok=True)

    @staticmethod
    def check_remote_accessible(owner: str, repo: str) -> bool:
        """Verifies if the repository is publicly accessible via Git smart HTTP."""
        url = f"https://github.com/{owner}/{repo}.git"
        try:
            res = subprocess.run(
                ["git", "ls-remote", "--heads", url],
                capture_output=True,
                text=True,
                timeout=10
            )
            return res.returncode == 0
        except Exception as e:
            logger.warning(f"git ls-remote check failed for {owner}/{repo}: {e}")
            return False

    async def clone_repository(self, owner: str, repo: str, branch: Optional[str] = None) -> Tuple[str, str]:
        """
        Performs a shallow clone (--depth 1) of the public GitHub repository.
        Returns: (repo_dir, default_branch)
        """
        repo_slug = f"{owner}--{repo}".lower()
        target_dir = os.path.join(self.base_cache_dir, repo_slug)
        url = f"https://github.com/{owner}/{repo}.git"

        # Check for local demo repository
        if owner.lower() in ("demo", "local") and "demo" in repo.lower():
            workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
            local_demo = os.path.join(workspace_root, "demo-buggy-repo")
            if os.path.exists(local_demo):
                logger.info(f"Using local demo repository from {local_demo}")
                if os.path.exists(target_dir):
                    shutil.rmtree(target_dir, ignore_errors=True)
                shutil.copytree(local_demo, target_dir, ignore=shutil.ignore_patterns('__pycache__', '.pytest_cache', '.git'))
                subprocess.run(["git", "init"], cwd=target_dir, capture_output=True)
                subprocess.run(["git", "add", "."], cwd=target_dir, capture_output=True)
                subprocess.run(
                    ["git", "commit", "-m", "Initial commit for demo-buggy-repo", "--allow-empty"],
                    cwd=target_dir, capture_output=True,
                    env={**os.environ, "GIT_AUTHOR_NAME": "Demo", "GIT_AUTHOR_EMAIL": "demo@reporag.dev",
                         "GIT_COMMITTER_NAME": "Demo", "GIT_COMMITTER_EMAIL": "demo@reporag.dev"}
                )
                return target_dir, "main"

        # If repo is already cloned, refresh it or reuse
        if os.path.exists(target_dir) and os.path.isdir(os.path.join(target_dir, ".git")):
            logger.info(f"Reusing existing clone at {target_dir}")
        else:
            if os.path.exists(target_dir):
                shutil.rmtree(target_dir, ignore_errors=True)

            logger.info(f"Cloning {url} into {target_dir} with depth 1...")
            clone_cmd = ["git", "clone", "--depth", "1"]
            if branch:
                clone_cmd.extend(["-b", branch])
            clone_cmd.extend([url, target_dir])
            proc = await asyncio.create_subprocess_exec(
                *clone_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await proc.communicate()
            if proc.returncode != 0:
                err_msg = stderr.decode().strip()
                raise RuntimeError(f"Git clone failed: {err_msg}")

        # Detect default branch
        branch = "main"
        try:
            b_proc = await asyncio.create_subprocess_exec(
                "git", "-C", target_dir, "branch", "--show-current",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            b_out, _ = await b_proc.communicate()
            detected = b_out.decode().strip()
            if detected:
                branch = detected
        except Exception:
            pass

        return target_dir, branch

    def get_commit_history(self, target_dir: str, limit: int = 15) -> List[GitCommit]:
        """Extracts recent commits directly using local git log."""
        commits: List[GitCommit] = []
        try:
            res = subprocess.run(
                ["git", "-C", target_dir, "log", f"-n{limit}", "--pretty=format:%H|%h|%an|%ad|%s", "--date=short"],
                capture_output=True,
                text=True,
                timeout=8
            )
            if res.returncode == 0 and res.stdout.strip():
                for line in res.stdout.strip().splitlines():
                    parts = line.split("|", 4)
                    if len(parts) >= 5:
                        full_hash, short_h, author, date, msg = parts
                        # Get changed files in this commit
                        files_res = subprocess.run(
                            ["git", "-C", target_dir, "diff-tree", "--no-commit-id", "--name-only", "-r", full_hash],
                            capture_output=True,
                            text=True,
                            timeout=5
                        )
                        changed = [f.strip() for f in files_res.stdout.splitlines() if f.strip()]
                        commits.append(GitCommit(
                            hash=full_hash,
                            short_hash=short_h,
                            author=author,
                            date=date,
                            message=msg,
                            changed_files=changed
                        ))
        except Exception as e:
            logger.warning(f"Could not read local git log: {e}")
        return commits

    def scan_cloned_files(self, target_dir: str) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """
        Scans all files inside the cloned directory on disk.
        Returns: (tree_items, contents_dict)
        """
        scanner = FileScanner()
        tree_items = []
        contents_dict = {}

        for root, dirs, files in os.walk(target_dir):
            rel_root = os.path.relpath(root, target_dir).replace("\\", "/")
            if rel_root == ".":
                rel_root = ""

            # Filter out ignored directories in-place to avoid descending
            dirs[:] = [d for d in dirs if not scanner.should_ignore(f"{rel_root}/{d}" if rel_root else d)]

            for file_name in files:
                rel_path = f"{rel_root}/{file_name}" if rel_root else file_name
                if scanner.should_ignore(rel_path):
                    continue

                abs_file_path = os.path.join(root, file_name)
                try:
                    file_size = os.path.getsize(abs_file_path)
                    tree_items.append({
                        "path": rel_path,
                        "type": "blob",
                        "size": file_size
                    })

                    # Read text content if within size limit
                    if file_size <= settings.MAX_FILE_SIZE_BYTES:
                        with open(abs_file_path, "r", encoding="utf-8", errors="replace") as f:
                            contents_dict[rel_path] = f.read()
                except Exception as e:
                    logger.warning(f"Could not read cloned file {rel_path}: {e}")

        return tree_items, contents_dict
