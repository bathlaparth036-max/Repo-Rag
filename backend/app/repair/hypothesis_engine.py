"""Hypothesis Generation Engine — generates multiple root-cause hypotheses for detected bugs.

Uses the LLM to reason about WHY a bug occurs and produces multiple plausible
explanations backed by source code evidence.
"""
import uuid
from typing import List, Dict, Optional
from app.repair.models import DetectedBug, RootCauseHypothesis, BugCategory
from app.core.config import settings
from app.core.logging import logger
import httpx


from app.core.llm import LLMClient


class HypothesisEngine:
    """Generates root-cause hypotheses for each detected bug."""

    def __init__(self, api_key: Optional[str] = None):
        self.llm = LLMClient(api_key=api_key)

    async def generate_hypotheses(
        self,
        bug: DetectedBug,
        file_contents: Dict[str, str],
        related_context: str = ""
    ) -> List[RootCauseHypothesis]:
        """Generate 2-3 plausible root-cause hypotheses for a bug."""

        # Get the source file content
        source = file_contents.get(bug.file_path, "")
        lines = source.splitlines()
        start = max(0, bug.line_number - 10)
        end = min(len(lines), (bug.end_line or bug.line_number) + 10)
        context_lines = "\n".join(
            f"{i+1}: {line}" for i, line in enumerate(lines[start:end], start=start)
        )

        # Build related file context
        related_snippets = []
        for f in bug.related_files[:3]:
            if f in file_contents:
                content = file_contents[f][:1500]
                related_snippets.append(f"--- {f} ---\n{content}")

        if self.llm.is_configured():
            return await self._llm_generate_hypotheses(bug, context_lines, related_snippets)

        # Fallback: generate rule-based hypotheses
        return self._rule_based_hypotheses(bug, context_lines)

    async def _llm_generate_hypotheses(
        self,
        bug: DetectedBug,
        code_context: str,
        related_snippets: List[str]
    ) -> List[RootCauseHypothesis]:
        """Use LLM to generate hypotheses."""

        related_text = "\n\n".join(related_snippets) if related_snippets else "No related files available."

        prompt = f"""You are an expert software debugger analyzing a detected bug.

BUG DETAILS:
- Title: {bug.title}
- Category: {bug.category.value}
- Severity: {bug.severity.value}
- File: {bug.file_path} (line {bug.line_number})
- Evidence: {bug.evidence}
- Explanation: {bug.explanation}

SOURCE CODE CONTEXT (around the bug):
```
{code_context}
```

RELATED FILES:
{related_text}

Generate exactly 2-3 root-cause hypotheses. For each hypothesis provide:
1. ROOT_CAUSE: A concise description of the root cause
2. EVIDENCE: What code evidence supports this hypothesis
3. EXPECTED: What the correct behavior should be
4. WHY: Why the problem occurs
5. CONFIDENCE: A value between 0.0 and 1.0
6. VALIDATION: How to verify this hypothesis

IMPORTANT: Only generate multiple hypotheses if the evidence genuinely supports
multiple explanations. Do NOT manufacture hypotheses.

Format each hypothesis as:
HYPOTHESIS|<root_cause>|<evidence>|<expected_behavior>|<why_problem_occurs>|<confidence>|<validation_method>
"""

        hypotheses = []
        try:
            text = await self.llm.generate(prompt, temperature=0.2, max_tokens=2048)
            if not text:
                return self._rule_based_hypotheses(bug, code_context)

            for line in text.strip().splitlines():
                if line.startswith("HYPOTHESIS|"):
                    parts = line.split("|")
                    if len(parts) >= 7:
                        try:
                            hypotheses.append(RootCauseHypothesis(
                                hypothesis_id=f"hyp-{uuid.uuid4().hex[:8]}",
                                bug_id=bug.bug_id,
                                root_cause=parts[1].strip(),
                                evidence_from_code=parts[2].strip(),
                                affected_files=[bug.file_path] + bug.related_files[:3],
                                expected_behavior=parts[3].strip(),
                                why_problem_occurs=parts[4].strip(),
                                confidence=min(1.0, max(0.1, float(parts[5].strip()))),
                                validation_method=parts[6].strip()
                            ))
                        except (ValueError, IndexError):
                            continue
        except Exception as e:
            logger.warning(f"LLM hypothesis generation failed: {e}")

        # If LLM fails, fall back to rule-based
        if not hypotheses:
            hypotheses = self._rule_based_hypotheses(bug, code_context)

        return hypotheses

    def _rule_based_hypotheses(
        self, bug: DetectedBug, code_context: str
    ) -> List[RootCauseHypothesis]:
        """Generate rule-based hypotheses when LLM is unavailable."""
        hypotheses = []

        # Primary hypothesis based on the bug category
        primary = RootCauseHypothesis(
            hypothesis_id=f"hyp-{uuid.uuid4().hex[:8]}",
            bug_id=bug.bug_id,
            root_cause=f"Direct {bug.category.value.replace('_', ' ')} in {bug.file_path}",
            evidence_from_code=bug.evidence,
            affected_files=[bug.file_path] + bug.related_files[:2],
            expected_behavior=f"Code at line {bug.line_number} should execute without {bug.category.value.replace('_', ' ')}",
            why_problem_occurs=bug.explanation,
            confidence=bug.confidence,
            validation_method=f"Fix the code at line {bug.line_number} and run the test suite"
        )
        hypotheses.append(primary)

        # Secondary hypothesis — upstream dependency issue
        if bug.category in [BugCategory.BROKEN_IMPORT, BugCategory.UNDEFINED_VARIABLE]:
            hypotheses.append(RootCauseHypothesis(
                hypothesis_id=f"hyp-{uuid.uuid4().hex[:8]}",
                bug_id=bug.bug_id,
                root_cause="Missing or misconfigured dependency",
                evidence_from_code=bug.evidence,
                affected_files=[bug.file_path],
                expected_behavior="The imported module or variable should be available",
                why_problem_occurs="The required module may not be installed, or the import path may be incorrect due to a refactoring",
                confidence=max(0.3, bug.confidence - 0.2),
                validation_method="Check package manifest (requirements.txt / package.json) for the missing dependency"
            ))

        # Tertiary hypothesis for logic errors
        if bug.category in [BugCategory.LOGIC_ERROR, BugCategory.INCORRECT_CONDITION]:
            hypotheses.append(RootCauseHypothesis(
                hypothesis_id=f"hyp-{uuid.uuid4().hex[:8]}",
                bug_id=bug.bug_id,
                root_cause="Incorrect logic or edge case not handled",
                evidence_from_code=bug.evidence,
                affected_files=[bug.file_path],
                expected_behavior="The code should correctly handle all expected inputs and edge cases",
                why_problem_occurs="The developer may have missed an edge case or used incorrect conditional logic",
                confidence=max(0.3, bug.confidence - 0.25),
                validation_method="Write test cases covering edge cases and verify the expected output"
            ))

        return hypotheses
