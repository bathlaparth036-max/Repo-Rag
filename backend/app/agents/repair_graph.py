"""Repair Pipeline Orchestrator — coordinates the entire autonomous repair flow.

This module orchestrates all repair engine components in a sequential pipeline
with conditional branching. It can optionally use LangGraph if available,
but works as a standalone orchestrator otherwise.

Pipeline stages:
1. Clone & Analyze Repository
2. Detect Bugs
3. Generate Hypotheses
4. Generate Solutions
5. Apply Patches
6. Run Tests (before & after)
7. Generate Regression Tests
8. Evaluate Solutions
9. Select Best Solution
10. Generate Report
"""
import asyncio
import os
import uuid
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

from app.agents.state import RepairState
from app.repair.models import (
    RepairStage, RepairReport, RepairJobProgress, VerificationStatus,
    DetectedBug, CandidateSolution
)
from app.repair.bug_detector import BugDetector
from app.repair.hypothesis_engine import HypothesisEngine
from app.repair.solution_generator import SolutionGenerator
from app.repair.patch_engine import PatchEngine
from app.repair.test_runner import TestRunner
from app.repair.solution_evaluator import SolutionEvaluator
from app.repair.regression_test_generator import RegressionTestGenerator
from app.ingestion.github_client import GitHubClient
from app.ingestion.repository_cloner import RepositoryCloner
from app.ingestion.file_scanner import FileScanner
from app.parsing.language_detector import LanguageDetector
from app.core.config import settings
from app.core.logging import logger


class RepairOrchestrator:
    """Orchestrates the complete autonomous repair pipeline."""

    def __init__(self):
        self.bug_detector = BugDetector()
        self.hypothesis_engine = HypothesisEngine()
        self.solution_generator = SolutionGenerator()
        self.patch_engine = PatchEngine()
        self.test_runner = TestRunner(timeout_seconds=120)
        self.solution_evaluator = SolutionEvaluator()
        self.regression_generator = RegressionTestGenerator()

        # Track active jobs
        self.jobs: Dict[str, RepairJobProgress] = {}
        self.states: Dict[str, RepairState] = {}
        self.reports: Dict[str, RepairReport] = {}

    def _update_job(
        self, job_id: str, stage: RepairStage, progress: int, message: str,
        error: Optional[str] = None
    ):
        """Update job progress."""
        if job_id in self.jobs:
            self.jobs[job_id].stage = stage
            self.jobs[job_id].progress = progress
            self.jobs[job_id].message = message
            if error:
                self.jobs[job_id].error = error
        if job_id in self.states:
            self.states[job_id].stage = stage
            self.states[job_id].progress = progress
            self.states[job_id].message = message
            if error:
                self.states[job_id].error = error
        logger.info(f"[{job_id}] {stage.value} ({progress}%): {message}")

    async def start_repair(
        self, repo_url: str, token: Optional[str] = None, branch: Optional[str] = None
    ) -> str:
        """Start an autonomous repair job. Returns job_id."""
        job_id = f"repair-{uuid.uuid4().hex[:8]}"

        # Parse repo URL
        gh = GitHubClient(token=token)
        owner, repo = gh.parse_repo_url(repo_url)
        repo_id = f"{owner}--{repo}".lower()

        # Initialize job tracking
        self.jobs[job_id] = RepairJobProgress(
            job_id=job_id,
            repository_id=repo_id,
            repository_url=repo_url,
            stage=RepairStage.IDLE,
            progress=0,
            message="Initializing repair pipeline..."
        )

        state = RepairState(
            repository_url=repo_url,
            repository_id=repo_id,
            job_id=job_id,
            branch=branch or "main"
        )
        self.states[job_id] = state

        # Launch pipeline as background task
        asyncio.create_task(self._run_pipeline(job_id, owner, repo, gh, target_branch=branch))

        return job_id

    async def _run_pipeline(
        self, job_id: str, owner: str, repo: str, gh: GitHubClient,
        target_branch: Optional[str] = None
    ):
        """Execute the complete repair pipeline."""
        state = self.states[job_id]

        try:
            # ============================================================
            # STAGE 1: Clone Repository
            # ============================================================
            self._update_job(job_id, RepairStage.CLONING, 5, f"Cloning {owner}/{repo}...")

            cloner = RepositoryCloner()
            repo_dir, branch = await cloner.clone_repository(owner, repo, branch=target_branch)
            state.repo_dir = repo_dir
            state.branch = branch

            self._update_job(job_id, RepairStage.CLONING, 10, "Repository cloned successfully")

            # ============================================================
            # STAGE 2: Analyze Repository
            # ============================================================
            self._update_job(job_id, RepairStage.ANALYZING, 15, "Scanning repository files...")

            # Scan files
            tree_items, file_contents = cloner.scan_cloned_files(repo_dir)
            state.file_contents = file_contents

            # Detect languages
            all_paths = [f["path"] for f in tree_items if f.get("type") == "blob"]
            state.languages = LanguageDetector.calculate_language_breakdown(all_paths)

            # Detect project type
            state.project_type = self.test_runner.detect_project_type(repo_dir)

            self._update_job(
                job_id, RepairStage.ANALYZING, 20,
                f"Scanned {len(file_contents)} files. Project type: {state.project_type}"
            )

            # ============================================================
            # STAGE 3: Discover and Run Original Tests
            # ============================================================
            self._update_job(job_id, RepairStage.RUNNING_TESTS, 25, "Discovering existing tests...")

            state.discovered_tests = self.test_runner.discover_tests(repo_dir)

            if state.discovered_tests:
                self._update_job(
                    job_id, RepairStage.RUNNING_TESTS, 30,
                    f"Running {len(state.discovered_tests)} existing tests..."
                )
                state.original_test_results = await self.test_runner.run_tests(
                    repo_dir, project_type=state.project_type
                )
                self._update_job(
                    job_id, RepairStage.RUNNING_TESTS, 35,
                    f"Original tests: {state.original_test_results.passed} passed, "
                    f"{state.original_test_results.failed} failed"
                )
            else:
                self._update_job(job_id, RepairStage.RUNNING_TESTS, 35, "No existing tests found")

            # ============================================================
            # STAGE 4: Detect Bugs
            # ============================================================
            self._update_job(job_id, RepairStage.DETECTING_BUGS, 40, "Running bug detection...")

            state.detected_bugs = await self.bug_detector.detect_bugs(
                file_contents, state.languages, repo_dir
            )

            bugs_found = len(state.detected_bugs)
            self.jobs[job_id].bugs_found = bugs_found
            self._update_job(
                job_id, RepairStage.DETECTING_BUGS, 50,
                f"Detected {bugs_found} potential bug(s)"
            )

            # ============================================================
            # CONDITIONAL: If no bugs, generate clean report
            # ============================================================
            if not state.detected_bugs:
                self._update_job(
                    job_id, RepairStage.GENERATING_REPORT, 90,
                    "No bugs detected. Generating clean analysis report..."
                )
                report = RepairReport(
                    report_id=f"report-{uuid.uuid4().hex[:8]}",
                    repository_url=state.repository_url,
                    repository_name=repo,
                    branch=branch,
                    analysis_timestamp=datetime.now().isoformat(),
                    verification_status=VerificationStatus.NOT_VERIFIED,
                    original_test_results=state.original_test_results,
                    summary=f"Repository {owner}/{repo} was analyzed. "
                           f"No significant bugs were detected by the automated analysis pipeline. "
                           f"{'Existing tests: ' + str(state.original_test_results.passed) + ' passed, ' + str(state.original_test_results.failed) + ' failed.' if state.original_test_results else 'No tests found.'}"
                )
                state.report = report
                self.reports[job_id] = report
                self.jobs[job_id].report = report
                self._update_job(job_id, RepairStage.COMPLETE, 100, "Analysis complete — no bugs detected")
                return

            # Select the highest severity bug to fix
            state.detected_bugs.sort(key=lambda b: {
                "critical": 4, "high": 3, "medium": 2, "low": 1, "info": 0
            }.get(b.severity.value, 0), reverse=True)
            state.selected_bug = state.detected_bugs[0]

            # ============================================================
            # STAGE 5: Generate Hypotheses
            # ============================================================
            self._update_job(
                job_id, RepairStage.GENERATING_HYPOTHESES, 55,
                f"Generating root-cause hypotheses for: {state.selected_bug.title}"
            )

            state.hypotheses = await self.hypothesis_engine.generate_hypotheses(
                state.selected_bug, file_contents
            )

            self._update_job(
                job_id, RepairStage.GENERATING_HYPOTHESES, 60,
                f"Generated {len(state.hypotheses)} hypothesis(es)"
            )

            # ============================================================
            # STAGE 6: Generate Solutions
            # ============================================================
            self._update_job(job_id, RepairStage.GENERATING_SOLUTIONS, 65, "Generating candidate fixes...")

            state.candidate_solutions = await self.solution_generator.generate_solutions(
                state.selected_bug, state.hypotheses, file_contents
            )

            solutions_count = len(state.candidate_solutions)
            self.jobs[job_id].solutions_generated = solutions_count
            self._update_job(
                job_id, RepairStage.GENERATING_SOLUTIONS, 70,
                f"Generated {solutions_count} candidate solution(s)"
            )

            if not state.candidate_solutions:
                self._update_job(
                    job_id, RepairStage.GENERATING_REPORT, 90,
                    "Could not generate viable solutions. Generating report..."
                )
                self._generate_final_report(job_id, state, repo, branch)
                return

            # ============================================================
            # STAGE 7: Generate Regression Test
            # ============================================================
            self._update_job(job_id, RepairStage.RUNNING_TESTS, 72, "Generating regression test...")

            state.regression_test = await self.regression_generator.generate_regression_test(
                state.selected_bug, file_contents
            )

            # Run regression test against original code
            if state.regression_test and state.regression_test.source_code:
                state.regression_results_before = await self.test_runner.run_regression_test(
                    repo_dir, state.regression_test.source_code
                )

            # ============================================================
            # STAGE 8: Apply Patches & Test Each Candidate
            # ============================================================
            self._update_job(job_id, RepairStage.APPLYING_PATCHES, 75, "Applying and testing candidate patches...")

            for i, solution in enumerate(state.candidate_solutions):
                progress = 75 + int((i / max(1, solutions_count)) * 10)
                self._update_job(
                    job_id, RepairStage.APPLYING_PATCHES, progress,
                    f"Testing solution {i+1}/{solutions_count}..."
                )

                # Create isolated working copy
                workspace = self.patch_engine.create_working_copy(
                    repo_dir, f"{job_id}-sol{i}"
                )
                state.workspace_dir = workspace

                # Apply the patch
                patch_result = self.patch_engine.apply_patch(workspace, solution)
                state.patch_results.append(patch_result)

                if patch_result.applied_successfully:
                    # Run tests in the patched workspace
                    patched_tests = await self.test_runner.run_tests(
                        workspace, project_type=state.project_type
                    )
                    state.patched_test_results[solution.solution_id] = patched_tests

                    # Run regression test against patched code
                    regression_after = None
                    if state.regression_test and state.regression_test.source_code:
                        regression_after = await self.test_runner.run_regression_test(
                            workspace, state.regression_test.source_code
                        )
                        if solution.solution_id == state.candidate_solutions[0].solution_id:
                            state.regression_results_after = regression_after

                    # Evaluate this solution
                    evaluation = self.solution_evaluator.evaluate_solution(
                        solution,
                        patch_result,
                        state.original_test_results,
                        patched_tests,
                        regression_after
                    )
                    state.evaluations.append(evaluation)

                    # Update solution's verification status
                    solution.verification_status = evaluation.verification_status
                    solution.test_results = patched_tests

                # Cleanup workspace
                self.patch_engine.cleanup_workspace(workspace)

            # ============================================================
            # STAGE 9: Select Best Solution
            # ============================================================
            self._update_job(job_id, RepairStage.EVALUATING, 90, "Evaluating and selecting best solution...")

            best_eval = self.solution_evaluator.select_best_solution(state.evaluations)
            if best_eval:
                # Find the matching solution
                for sol in state.candidate_solutions:
                    if sol.solution_id == best_eval.solution_id:
                        state.selected_solution = sol
                        state.selected_evaluation = best_eval
                        break

                verified_count = sum(
                    1 for e in state.evaluations
                    if e.verification_status == VerificationStatus.VERIFIED
                )
                self.jobs[job_id].solutions_verified = verified_count

            # ============================================================
            # STAGE 10: Generate Report
            # ============================================================
            self._update_job(job_id, RepairStage.GENERATING_REPORT, 95, "Generating repair report...")
            self._generate_final_report(job_id, state, repo, branch)

        except Exception as e:
            logger.error(f"Repair pipeline failed: {e}", exc_info=True)
            self._update_job(
                job_id, RepairStage.FAILED, 0,
                f"Pipeline error: {str(e)}", error=str(e)
            )

    def _generate_final_report(
        self, job_id: str, state: RepairState, repo: str, branch: str
    ):
        """Generate the final repair report."""
        # Determine overall verification status
        if state.selected_evaluation:
            overall_status = state.selected_evaluation.verification_status
        elif state.detected_bugs:
            overall_status = VerificationStatus.FAILED
        else:
            overall_status = VerificationStatus.NOT_VERIFIED

        # Build summary
        summary_parts = [
            f"Analyzed repository {repo} (branch: {branch}).",
            f"Scanned {len(state.file_contents)} files.",
        ]
        if state.detected_bugs:
            summary_parts.append(f"Detected {len(state.detected_bugs)} bug(s).")
        if state.hypotheses:
            summary_parts.append(f"Generated {len(state.hypotheses)} root-cause hypothesis(es).")
        if state.candidate_solutions:
            summary_parts.append(f"Generated {len(state.candidate_solutions)} candidate solution(s).")
        if state.selected_solution:
            summary_parts.append(f"Selected solution: {state.selected_solution.explanation}")
            summary_parts.append(f"Verification: {overall_status.value}")

        report = RepairReport(
            report_id=f"report-{uuid.uuid4().hex[:8]}",
            repository_url=state.repository_url,
            repository_name=repo,
            branch=branch,
            analysis_timestamp=datetime.now().isoformat(),
            detected_bugs=state.detected_bugs,
            hypotheses=state.hypotheses,
            candidate_solutions=state.candidate_solutions,
            selected_solution=state.selected_solution,
            evaluations=state.evaluations,
            verification_status=overall_status,
            original_test_results=state.original_test_results,
            final_test_results=state.patched_test_results.get(
                state.selected_solution.solution_id
            ) if state.selected_solution else None,
            regression_test=state.regression_test,
            summary=" ".join(summary_parts),
            remaining_issues=[
                b.title for b in state.detected_bugs[1:]  # Bugs we didn't fix
            ] if len(state.detected_bugs) > 1 else []
        )

        state.report = report
        self.reports[job_id] = report
        self.jobs[job_id].report = report
        self._update_job(job_id, RepairStage.COMPLETE, 100, "Repair pipeline complete")


# Global singleton
repair_orchestrator = RepairOrchestrator()
