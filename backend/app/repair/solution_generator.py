"""Solution Generator — generates multiple candidate code fixes for detected bugs.

Uses the Gemini LLM to generate actual code patches, not just suggestions.
Each candidate includes the complete modified file content and a description
of what was changed and why.
"""
import uuid
import difflib
from typing import List, Dict, Optional
from app.repair.models import (
    DetectedBug, RootCauseHypothesis, CandidateSolution, CodeChange, BugCategory
)
from app.core.config import settings
from app.core.logging import logger
import httpx


class SolutionGenerator:
    """Generates multiple candidate solutions for a detected bug."""

    def __init__(self, gemini_api_key: Optional[str] = None):
        self.gemini_api_key = gemini_api_key or settings.GEMINI_API_KEY

    async def generate_solutions(
        self,
        bug: DetectedBug,
        hypotheses: List[RootCauseHypothesis],
        file_contents: Dict[str, str],
        max_solutions: int = 3
    ) -> List[CandidateSolution]:
        """Generate multiple candidate patches for a bug."""
        solutions = []

        source_content = file_contents.get(bug.file_path, "")
        if not source_content:
            return []

        if self.gemini_api_key:
            # Generate LLM-based solutions
            for i, hypothesis in enumerate(hypotheses[:max_solutions]):
                solution = await self._llm_generate_solution(
                    bug, hypothesis, source_content, file_contents, i + 1
                )
                if solution:
                    solutions.append(solution)

        if not solutions:
            # Fallback: generate rule-based patches
            solution = self._rule_based_solution(bug, source_content)
            if solution:
                solutions.append(solution)

        return solutions

    async def _llm_generate_solution(
        self,
        bug: DetectedBug,
        hypothesis: RootCauseHypothesis,
        source_content: str,
        all_files: Dict[str, str],
        solution_number: int
    ) -> Optional[CandidateSolution]:
        """Use LLM to generate a concrete code fix."""

        # Get surrounding context
        lines = source_content.splitlines()
        bug_start = max(0, bug.line_number - 5)
        bug_end = min(len(lines), (bug.end_line or bug.line_number) + 5)

        prompt = f"""You are an expert software engineer fixing a bug.

BUG:
- Title: {bug.title}
- Category: {bug.category.value}
- File: {bug.file_path} (line {bug.line_number})
- Evidence: {bug.evidence}
- Explanation: {bug.explanation}

ROOT CAUSE HYPOTHESIS:
- {hypothesis.root_cause}
- Why it occurs: {hypothesis.why_problem_occurs}
- Expected behavior: {hypothesis.expected_behavior}

COMPLETE SOURCE FILE ({bug.file_path}):
```
{source_content}
```

INSTRUCTIONS:
1. Generate the COMPLETE modified file content with the fix applied
2. Only modify what is necessary to fix the bug
3. Preserve all existing functionality, comments, and formatting
4. Do NOT add unnecessary changes

Respond in this exact format:
EXPLANATION: <one-line explanation of the fix>
EXPECTED_OUTCOME: <what will improve after this fix>
RISK: <Low/Medium/High>
SIDE_EFFECTS: <comma-separated list of potential side effects, or "None">
MODIFIED_FILE_START
<complete modified file content here>
MODIFIED_FILE_END
"""

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_MODEL}:generateContent?key={self.gemini_api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.15, "maxOutputTokens": 8192}
            }
            async with httpx.AsyncClient(timeout=45.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

                    return self._parse_llm_solution(
                        text, bug, hypothesis, source_content, solution_number
                    )
        except Exception as e:
            logger.warning(f"LLM solution generation failed: {e}")

        return None

    def _parse_llm_solution(
        self,
        llm_output: str,
        bug: DetectedBug,
        hypothesis: RootCauseHypothesis,
        original_content: str,
        solution_number: int
    ) -> Optional[CandidateSolution]:
        """Parse LLM output into a CandidateSolution."""

        # Extract fields
        explanation = ""
        expected_outcome = ""
        risk = "Medium"
        side_effects = []
        modified_content = ""

        lines_iter = llm_output.splitlines()
        in_file = False
        file_lines = []

        for line in lines_iter:
            if line.startswith("EXPLANATION:"):
                explanation = line.replace("EXPLANATION:", "").strip()
            elif line.startswith("EXPECTED_OUTCOME:"):
                expected_outcome = line.replace("EXPECTED_OUTCOME:", "").strip()
            elif line.startswith("RISK:"):
                risk = line.replace("RISK:", "").strip()
            elif line.startswith("SIDE_EFFECTS:"):
                effects = line.replace("SIDE_EFFECTS:", "").strip()
                if effects.lower() != "none":
                    side_effects = [e.strip() for e in effects.split(",") if e.strip()]
            elif "MODIFIED_FILE_START" in line:
                in_file = True
                continue
            elif "MODIFIED_FILE_END" in line:
                in_file = False
            elif in_file:
                file_lines.append(line)

        if not file_lines:
            return None

        modified_content = "\n".join(file_lines)

        # Strip markdown code fences if present
        if modified_content.startswith("```"):
            modified_lines = modified_content.splitlines()
            if modified_lines[0].startswith("```"):
                modified_lines = modified_lines[1:]
            if modified_lines and modified_lines[-1].strip() == "```":
                modified_lines = modified_lines[:-1]
            modified_content = "\n".join(modified_lines)

        # Generate unified diff
        diff = self._generate_diff(
            original_content, modified_content, bug.file_path
        )

        # Skip if no actual changes
        if original_content.strip() == modified_content.strip():
            return None

        code_change = CodeChange(
            file_path=bug.file_path,
            original_content=original_content,
            modified_content=modified_content,
            diff=diff,
            change_description=explanation
        )

        return CandidateSolution(
            solution_id=f"sol-{uuid.uuid4().hex[:8]}",
            bug_id=bug.bug_id,
            hypothesis_id=hypothesis.hypothesis_id,
            explanation=explanation or f"Fix for {bug.title}",
            code_changes=[code_change],
            expected_outcome=expected_outcome or "Bug should be resolved",
            potential_side_effects=side_effects,
            estimated_risk=risk if risk in ["Low", "Medium", "High"] else "Medium"
        )

    def _rule_based_solution(
        self, bug: DetectedBug, source_content: str
    ) -> Optional[CandidateSolution]:
        """Generate a rule-based fix for common bug patterns."""
        lines = source_content.splitlines()
        modified_lines = lines.copy()
        explanation = ""
        idx = bug.line_number - 1  # 0-indexed

        if idx < 0 or idx >= len(lines):
            return None

        line = lines[idx]

        # Fix bare except
        if bug.category == BugCategory.LOGIC_ERROR and "except:" in line:
            modified_lines[idx] = line.replace("except:", "except Exception:")
            explanation = "Replace bare 'except:' with 'except Exception:' to avoid catching SystemExit and KeyboardInterrupt"

        # Fix mutable default argument
        elif bug.category == BugCategory.LOGIC_ERROR and ("=[]" in line.replace(" ", "") or "={}" in line.replace(" ", "")):
            is_dict = "={}" in line.replace(" ", "")
            # Replace [] or {} with None and add initialization
            if is_dict:
                modified_lines[idx] = line.replace("={}", "=None").replace("= {}", "=None")
            else:
                modified_lines[idx] = line.replace("=[]", "=None").replace("= []", "=None")
            # Find the function body and add initialization
            indent = len(line) - len(line.lstrip()) + 4
            import re
            match = re.search(r'(\w+)\s*:\s*[^=,)]+\s*=\s*None', modified_lines[idx]) or re.search(r'(\w+)\s*=\s*None', modified_lines[idx])
            if match:
                param_name = match.group(1)
                default_val = "{}" if is_dict else "[]"
                init_line = " " * indent + f"if {param_name} is None:\n" + " " * (indent + 4) + f"{param_name} = {default_val}"
                modified_lines.insert(idx + 1, init_line)
            explanation = "Replace mutable default argument with None and initialize inside function body"

        elif "ZeroDivision" in bug.title or "/ len(" in line:
            indent = len(line) - len(line.lstrip())
            guard = " " * indent + "if not numbers:\n" + " " * (indent + 4) + "return 0.0"
            modified_lines.insert(idx, guard)
            explanation = "Add guard check for empty collection before division to prevent ZeroDivisionError"

        else:
            return None  # Can't generate rule-based fix for this bug type

        modified_content = "\n".join(modified_lines)
        diff = self._generate_diff(source_content, modified_content, bug.file_path)

        return CandidateSolution(
            solution_id=f"sol-rule-{uuid.uuid4().hex[:8]}",
            bug_id=bug.bug_id,
            explanation=explanation,
            code_changes=[CodeChange(
                file_path=bug.file_path,
                original_content=source_content,
                modified_content=modified_content,
                diff=diff,
                change_description=explanation
            )],
            expected_outcome="Bug should be resolved",
            estimated_risk="Low"
        )

    @staticmethod
    def _generate_diff(original: str, modified: str, file_path: str) -> str:
        """Generate a unified diff between original and modified content."""
        original_lines = original.splitlines(keepends=True)
        modified_lines = modified.splitlines(keepends=True)

        diff = difflib.unified_diff(
            original_lines,
            modified_lines,
            fromfile=f"a/{file_path}",
            tofile=f"b/{file_path}",
            lineterm=""
        )
        return "\n".join(diff)
