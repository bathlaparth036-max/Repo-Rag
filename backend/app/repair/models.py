"""Pydantic models for the Autonomous Software Repair pipeline."""
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class BugSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class BugCategory(str, Enum):
    SYNTAX_ERROR = "syntax_error"
    RUNTIME_EXCEPTION = "runtime_exception"
    LOGIC_ERROR = "logic_error"
    UNDEFINED_VARIABLE = "undefined_variable"
    INCORRECT_FUNCTION_CALL = "incorrect_function_call"
    BROKEN_IMPORT = "broken_import"
    DEPENDENCY_ISSUE = "dependency_issue"
    SECURITY_VULNERABILITY = "security_vulnerability"
    TYPE_ERROR = "type_error"
    INCORRECT_CONDITION = "incorrect_condition"
    RESOURCE_LEAK = "resource_leak"
    CONCURRENCY_ISSUE = "concurrency_issue"


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"
    FAILED = "FAILED"
    NOT_VERIFIED = "NOT_VERIFIED"
    PENDING = "PENDING"


class RepairStage(str, Enum):
    IDLE = "IDLE"
    CLONING = "CLONING"
    ANALYZING = "ANALYZING"
    DETECTING_BUGS = "DETECTING_BUGS"
    GENERATING_HYPOTHESES = "GENERATING_HYPOTHESES"
    GENERATING_SOLUTIONS = "GENERATING_SOLUTIONS"
    APPLYING_PATCHES = "APPLYING_PATCHES"
    RUNNING_TESTS = "RUNNING_TESTS"
    EVALUATING = "EVALUATING"
    GENERATING_REPORT = "GENERATING_REPORT"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"


class DetectedBug(BaseModel):
    """A single detected bug in the repository."""
    bug_id: str
    title: str
    category: BugCategory
    severity: BugSeverity
    file_path: str
    line_number: int
    end_line: Optional[int] = None
    evidence: str  # Code snippet or explanation
    explanation: str  # Why this is a bug
    detection_method: str  # "llm", "static_analysis", "syntax_check", "test_failure"
    confidence: float = 0.8  # 0.0 - 1.0
    related_files: List[str] = Field(default_factory=list)
    raw_tool_output: Optional[str] = None  # Raw output from static analysis


class RootCauseHypothesis(BaseModel):
    """A plausible explanation for a detected bug."""
    hypothesis_id: str
    bug_id: str
    root_cause: str
    evidence_from_code: str
    affected_files: List[str] = Field(default_factory=list)
    expected_behavior: str
    why_problem_occurs: str
    confidence: float = 0.7
    validation_method: str  # How to verify this hypothesis


class CodeChange(BaseModel):
    """A single file modification within a candidate solution."""
    file_path: str
    original_content: str
    modified_content: str
    diff: str = ""
    change_description: str = ""


class CandidateSolution(BaseModel):
    """A proposed fix for a detected bug."""
    solution_id: str
    bug_id: str
    hypothesis_id: Optional[str] = None
    explanation: str
    code_changes: List[CodeChange] = Field(default_factory=list)
    expected_outcome: str
    potential_side_effects: List[str] = Field(default_factory=list)
    estimated_risk: str = "Low"  # Low, Medium, High
    verification_status: VerificationStatus = VerificationStatus.PENDING
    test_results: Optional["TestExecutionResult"] = None


class TestCase(BaseModel):
    """A single test case (discovered or generated)."""
    test_id: str
    test_name: str
    file_path: str
    test_type: str  # "existing", "regression", "generated"
    source_code: Optional[str] = None


class TestResult(BaseModel):
    """Result of a single test execution."""
    test_name: str
    passed: bool
    duration_ms: float = 0.0
    error_message: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None


class TestExecutionResult(BaseModel):
    """Aggregate result of running tests."""
    total_tests: int = 0
    passed: int = 0
    failed: int = 0
    errors: int = 0
    skipped: int = 0
    duration_seconds: float = 0.0
    test_results: List[TestResult] = Field(default_factory=list)
    execution_log: str = ""
    timed_out: bool = False


class PatchResult(BaseModel):
    """Result of applying a patch to the codebase."""
    solution_id: str
    applied_successfully: bool
    diff_output: str = ""
    files_modified: List[str] = Field(default_factory=list)
    syntax_valid: bool = True
    unrelated_changes: bool = False
    error: Optional[str] = None


class SolutionEvaluation(BaseModel):
    """Evaluation of a candidate solution after testing."""
    solution_id: str
    original_test_results: Optional[TestExecutionResult] = None
    patched_test_results: Optional[TestExecutionResult] = None
    regression_test_results: Optional[TestExecutionResult] = None
    syntax_valid: bool = True
    static_analysis_passed: bool = True
    behavioral_correct: bool = False
    unrelated_modifications: bool = False
    security_issues: List[str] = Field(default_factory=list)
    overall_score: float = 0.0
    verification_status: VerificationStatus = VerificationStatus.PENDING
    reasoning: str = ""


class RepairReport(BaseModel):
    """Complete repair report for a repository."""
    report_id: str
    repository_url: str
    repository_name: str
    branch: str = "main"
    analysis_timestamp: str = ""
    detected_bugs: List[DetectedBug] = Field(default_factory=list)
    hypotheses: List[RootCauseHypothesis] = Field(default_factory=list)
    candidate_solutions: List[CandidateSolution] = Field(default_factory=list)
    selected_solution: Optional[CandidateSolution] = None
    evaluations: List[SolutionEvaluation] = Field(default_factory=list)
    verification_status: VerificationStatus = VerificationStatus.NOT_VERIFIED
    original_test_results: Optional[TestExecutionResult] = None
    final_test_results: Optional[TestExecutionResult] = None
    regression_test: Optional[TestCase] = None
    summary: str = ""
    remaining_issues: List[str] = Field(default_factory=list)

    def to_markdown(self) -> str:
        """Generate a markdown report."""
        lines = [
            f"# Autonomous Repair Report — {self.repository_name}",
            f"",
            f"**Repository:** {self.repository_url}",
            f"**Branch:** {self.branch}",
            f"**Analyzed:** {self.analysis_timestamp}",
            f"**Verification Status:** `{self.verification_status.value}`",
            f"",
            f"---",
            f"",
            f"## Summary",
            f"",
            self.summary or "No summary available.",
            f"",
        ]

        if self.detected_bugs:
            lines.extend([
                f"## Detected Bugs ({len(self.detected_bugs)})",
                f""
            ])
            for i, bug in enumerate(self.detected_bugs, 1):
                lines.extend([
                    f"### Bug {i}: {bug.title}",
                    f"- **Severity:** {bug.severity.value}",
                    f"- **Category:** {bug.category.value}",
                    f"- **File:** `{bug.file_path}` (line {bug.line_number})",
                    f"- **Detection Method:** {bug.detection_method}",
                    f"- **Confidence:** {bug.confidence:.0%}",
                    f"",
                    f"**Evidence:**",
                    f"```",
                    bug.evidence,
                    f"```",
                    f"",
                    f"**Explanation:** {bug.explanation}",
                    f""
                ])

        if self.hypotheses:
            lines.extend([
                f"## Root-Cause Hypotheses ({len(self.hypotheses)})",
                f""
            ])
            for i, h in enumerate(self.hypotheses, 1):
                lines.extend([
                    f"### Hypothesis {i}: {h.root_cause}",
                    f"- **Confidence:** {h.confidence:.0%}",
                    f"- **Expected Behavior:** {h.expected_behavior}",
                    f"- **Why Problem Occurs:** {h.why_problem_occurs}",
                    f"- **Validation:** {h.validation_method}",
                    f"- **Affected Files:** {', '.join(f'`{f}`' for f in h.affected_files)}",
                    f""
                ])

        if self.candidate_solutions:
            lines.extend([
                f"## Candidate Solutions ({len(self.candidate_solutions)})",
                f""
            ])
            for i, sol in enumerate(self.candidate_solutions, 1):
                status_icon = "✅" if sol.verification_status == VerificationStatus.VERIFIED else (
                    "⚠️" if sol.verification_status == VerificationStatus.PARTIALLY_VERIFIED else "❌"
                )
                lines.extend([
                    f"### Solution {i} {status_icon} [{sol.verification_status.value}]",
                    f"- **Explanation:** {sol.explanation}",
                    f"- **Risk:** {sol.estimated_risk}",
                    f"- **Files Modified:** {', '.join(f'`{c.file_path}`' for c in sol.code_changes)}",
                    f""
                ])
                for change in sol.code_changes:
                    if change.diff:
                        lines.extend([
                            f"**Diff for `{change.file_path}`:**",
                            f"```diff",
                            change.diff,
                            f"```",
                            f""
                        ])

        if self.selected_solution:
            lines.extend([
                f"## Selected Repair",
                f"",
                f"**Solution:** {self.selected_solution.explanation}",
                f"**Status:** `{self.selected_solution.verification_status.value}`",
                f""
            ])

        if self.original_test_results:
            tr = self.original_test_results
            lines.extend([
                f"## Test Results — Before Repair",
                f"| Metric | Value |",
                f"|:---|:---|",
                f"| Total | {tr.total_tests} |",
                f"| Passed | {tr.passed} |",
                f"| Failed | {tr.failed} |",
                f"| Errors | {tr.errors} |",
                f"| Duration | {tr.duration_seconds:.1f}s |",
                f""
            ])

        if self.final_test_results:
            tr = self.final_test_results
            lines.extend([
                f"## Test Results — After Repair",
                f"| Metric | Value |",
                f"|:---|:---|",
                f"| Total | {tr.total_tests} |",
                f"| Passed | {tr.passed} |",
                f"| Failed | {tr.failed} |",
                f"| Errors | {tr.errors} |",
                f"| Duration | {tr.duration_seconds:.1f}s |",
                f""
            ])

        if self.remaining_issues:
            lines.extend([
                f"## Remaining Issues",
                f""
            ])
            for issue in self.remaining_issues:
                lines.append(f"- {issue}")

        return "\n".join(lines)


class RepairJobProgress(BaseModel):
    """Tracks progress of a repair job."""
    job_id: str
    repository_id: str
    repository_url: str
    stage: RepairStage = RepairStage.IDLE
    progress: int = 0
    message: str = "Waiting to start..."
    error: Optional[str] = None
    bugs_found: int = 0
    solutions_generated: int = 0
    solutions_verified: int = 0
    report: Optional[RepairReport] = None


# Update forward references
CandidateSolution.model_rebuild()
