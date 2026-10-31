"""Solution Evaluator — evidence-based comparison and selection of candidate patches.

Compares candidates using:
- Test pass rates (before/after)
- Syntax validity
- Static analysis results
- Behavioral correctness
- Unrelated modifications check
- Security implications
"""
from typing import List, Dict, Optional
from app.repair.models import (
    CandidateSolution, SolutionEvaluation, PatchResult,
    TestExecutionResult, VerificationStatus
)
from app.core.logging import logger


class SolutionEvaluator:
    """Evaluates and ranks candidate solutions based on evidence."""

    def evaluate_solution(
        self,
        solution: CandidateSolution,
        patch_result: PatchResult,
        original_tests: Optional[TestExecutionResult],
        patched_tests: Optional[TestExecutionResult],
        regression_tests: Optional[TestExecutionResult] = None
    ) -> SolutionEvaluation:
        """Evaluate a single candidate solution."""

        score = 0.0
        reasoning_parts = []

        # 1. Patch application success (required)
        if not patch_result.applied_successfully:
            return SolutionEvaluation(
                solution_id=solution.solution_id,
                verification_status=VerificationStatus.FAILED,
                overall_score=0.0,
                reasoning="Patch could not be applied to the codebase."
            )

        # 2. Syntax validity (+20 points)
        syntax_valid = patch_result.syntax_valid
        if syntax_valid:
            score += 20.0
            reasoning_parts.append("✅ Patch has valid syntax")
        else:
            reasoning_parts.append("❌ Patch introduces syntax errors")
            return SolutionEvaluation(
                solution_id=solution.solution_id,
                syntax_valid=False,
                verification_status=VerificationStatus.FAILED,
                overall_score=0.0,
                reasoning="Patch introduces syntax errors in the modified files."
            )

        # 3. No unrelated modifications (+10 points)
        if not patch_result.unrelated_changes:
            score += 10.0
            reasoning_parts.append("✅ Changes are focused and minimal")
        else:
            score -= 5.0
            reasoning_parts.append("⚠️ Patch may include unrelated modifications")

        # 4. Test results comparison (+40 points max)
        behavioral_correct = False
        if patched_tests and original_tests:
            # Check if tests improved or stayed the same
            original_pass_rate = (original_tests.passed / max(1, original_tests.total_tests))
            patched_pass_rate = (patched_tests.passed / max(1, patched_tests.total_tests))

            if patched_pass_rate >= original_pass_rate:
                score += 30.0
                reasoning_parts.append(f"✅ Tests pass rate maintained or improved ({patched_tests.passed}/{patched_tests.total_tests})")
                behavioral_correct = True

                if patched_pass_rate > original_pass_rate:
                    score += 10.0
                    reasoning_parts.append(f"✅ Tests improved from {original_tests.passed} to {patched_tests.passed} passing")
            else:
                score -= 10.0
                reasoning_parts.append(f"❌ Tests regressed from {original_tests.passed}/{original_tests.total_tests} to {patched_tests.passed}/{patched_tests.total_tests}")

            if patched_tests.timed_out:
                score -= 20.0
                reasoning_parts.append("❌ Test execution timed out")
        elif patched_tests:
            # No original tests to compare
            if patched_tests.passed > 0 and patched_tests.failed == 0:
                score += 20.0
                behavioral_correct = True
                reasoning_parts.append(f"✅ All {patched_tests.passed} tests pass")
            elif patched_tests.total_tests == 0:
                reasoning_parts.append("⚠️ No tests were executed")
        else:
            reasoning_parts.append("⚠️ No test results available for verification")

        # 5. Regression test (+20 points)
        if regression_tests:
            if regression_tests.passed > 0 and regression_tests.failed == 0:
                score += 20.0
                reasoning_parts.append("✅ Regression test passes after fix")
            elif regression_tests.failed > 0:
                score -= 5.0
                reasoning_parts.append("⚠️ Regression test has failures")

        # 6. Risk assessment (+10 points for low risk)
        if solution.estimated_risk == "Low":
            score += 10.0
        elif solution.estimated_risk == "Medium":
            score += 5.0

        # Normalize score to 0-100
        score = max(0.0, min(100.0, score))

        # Determine verification status
        if score >= 70 and syntax_valid and behavioral_correct:
            status = VerificationStatus.VERIFIED
        elif score >= 40 and syntax_valid:
            status = VerificationStatus.PARTIALLY_VERIFIED
        elif score < 20:
            status = VerificationStatus.FAILED
        else:
            status = VerificationStatus.NOT_VERIFIED

        return SolutionEvaluation(
            solution_id=solution.solution_id,
            original_test_results=original_tests,
            patched_test_results=patched_tests,
            regression_test_results=regression_tests,
            syntax_valid=syntax_valid,
            behavioral_correct=behavioral_correct,
            unrelated_modifications=patch_result.unrelated_changes,
            overall_score=round(score, 1),
            verification_status=status,
            reasoning="\n".join(reasoning_parts)
        )

    def select_best_solution(
        self,
        evaluations: List[SolutionEvaluation]
    ) -> Optional[SolutionEvaluation]:
        """Select the best solution from evaluated candidates."""
        if not evaluations:
            return None

        # Filter to only verified or partially verified solutions
        viable = [e for e in evaluations if e.verification_status in [
            VerificationStatus.VERIFIED,
            VerificationStatus.PARTIALLY_VERIFIED
        ]]

        if not viable:
            # Return the best failed candidate with explanation
            best_failed = max(evaluations, key=lambda e: e.overall_score)
            logger.info(f"No verified solutions. Best candidate scored {best_failed.overall_score}")
            return best_failed

        # Sort by score descending
        viable.sort(key=lambda e: e.overall_score, reverse=True)
        best = viable[0]
        logger.info(f"Selected solution {best.solution_id} with score {best.overall_score} [{best.verification_status.value}]")
        return best
