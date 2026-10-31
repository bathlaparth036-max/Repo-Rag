"""Shared state model for the LangGraph repair pipeline."""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.repair.models import (
    DetectedBug, RootCauseHypothesis, CandidateSolution,
    TestCase, TestExecutionResult, PatchResult,
    SolutionEvaluation, RepairReport, RepairStage
)


class RepairState(BaseModel):
    """Shared state passed between all agent nodes in the repair pipeline."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    # Input
    repository_url: str = ""
    repository_id: str = ""
    branch: str = "main"
    job_id: str = ""

    # Repository data
    repo_dir: str = ""  # Path to cloned repository
    workspace_dir: str = ""  # Path to working copy for patches
    file_contents: Dict[str, str] = Field(default_factory=dict)
    languages: Dict[str, float] = Field(default_factory=dict)
    project_type: str = "unknown"

    # Pipeline stage
    stage: RepairStage = RepairStage.IDLE
    progress: int = 0
    message: str = ""
    error: Optional[str] = None

    # Detection results
    detected_bugs: List[DetectedBug] = Field(default_factory=list)
    selected_bug: Optional[DetectedBug] = None

    # Hypothesis results
    hypotheses: List[RootCauseHypothesis] = Field(default_factory=list)

    # Solution results
    candidate_solutions: List[CandidateSolution] = Field(default_factory=list)
    patch_results: List[PatchResult] = Field(default_factory=list)

    # Test results
    discovered_tests: List[TestCase] = Field(default_factory=list)
    original_test_results: Optional[TestExecutionResult] = None
    patched_test_results: Dict[str, TestExecutionResult] = Field(default_factory=dict)
    regression_test: Optional[TestCase] = None
    regression_results_before: Optional[TestExecutionResult] = None
    regression_results_after: Optional[TestExecutionResult] = None

    # Evaluation
    evaluations: List[SolutionEvaluation] = Field(default_factory=list)
    selected_solution: Optional[CandidateSolution] = None
    selected_evaluation: Optional[SolutionEvaluation] = None

    # Report
    report: Optional[RepairReport] = None

    # Control flow
    retry_count: int = 0
    max_retries: int = 3
