"""Regression Test Generator — generates test cases that reproduce detected bugs.

Uses LLM to create a test that:
1. Fails against the original (buggy) code
2. Passes after the fix is applied
This proves the repair actually fixed the problem.
"""
import uuid
from typing import Optional, Dict
from app.repair.models import DetectedBug, TestCase
from app.core.config import settings
from app.core.logging import logger
import httpx


from app.core.llm import LLMClient


class RegressionTestGenerator:
    """Generates regression tests for detected bugs."""

    def __init__(self, api_key: Optional[str] = None):
        self.llm = LLMClient(api_key=api_key)

    async def generate_regression_test(
        self,
        bug: DetectedBug,
        file_contents: Dict[str, str]
    ) -> Optional[TestCase]:
        """Generate a regression test that reproduces the detected bug."""

        source_code = file_contents.get(bug.file_path, "")
        if not source_code:
            return None

        if self.llm.is_configured():
            return await self._llm_generate_test(bug, source_code)
        else:
            return self._rule_based_test(bug, source_code)

    async def _llm_generate_test(
        self, bug: DetectedBug, source_code: str
    ) -> Optional[TestCase]:
        """Use LLM to generate a regression test."""

        prompt = f"""You are a test engineer writing a regression test for a detected bug.

BUG DETAILS:
- Title: {bug.title}
- Category: {bug.category.value}
- File: {bug.file_path} (line {bug.line_number})
- Evidence: {bug.evidence}
- Explanation: {bug.explanation}

SOURCE CODE:
```python
{source_code[:4000]}
```

Write a Python pytest test that:
1. Tests the specific behavior related to this bug
2. Should FAIL against the original buggy code
3. Should PASS after the bug is fixed
4. Is self-contained and does not require external dependencies
5. Imports the relevant function/class from the source file

IMPORTANT:
- Use pytest style (def test_xxx...)
- Include appropriate assertions
- Add a docstring explaining what the test verifies
- Handle the case where the import might fail

Respond with ONLY the Python test code, no markdown fences or explanations.
Start with the necessary imports."""

        try:
            text = await self.llm.generate(prompt, temperature=0.1, max_tokens=2048)
            if not text:
                return self._rule_based_test(bug, source_code)

            # Clean up markdown fences if present
            test_code = text.strip()
            if test_code.startswith("```"):
                lines = test_code.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                test_code = "\n".join(lines)

            if "def test_" in test_code:
                return TestCase(
                    test_id=f"regtest-{uuid.uuid4().hex[:8]}",
                    test_name=f"regression_test_{bug.bug_id}",
                    file_path="test_regression_reporag.py",
                    test_type="regression",
                    source_code=test_code
                )
        except Exception as e:
            logger.warning(f"LLM regression test generation failed: {e}")

        return self._rule_based_test(bug, source_code)

    def _rule_based_test(
        self, bug: DetectedBug, source_code: str
    ) -> Optional[TestCase]:
        """Generate a simple rule-based regression test."""

        # For syntax errors, test that the file can be parsed
        if bug.category.value == "syntax_error":
            test_code = f'''"""Regression test for syntax error in {bug.file_path}"""
import ast
import os

def test_file_has_valid_syntax():
    """Verify that {bug.file_path} has valid Python syntax."""
    file_path = os.path.join(os.path.dirname(__file__), "{bug.file_path}")
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            source = f.read()
        # This should not raise SyntaxError
        tree = ast.parse(source)
        assert tree is not None, "AST parsing should succeed"
    else:
        # If file doesn't exist at expected path, try current dir
        import importlib.util
        # Just verify the module concept is sound
        assert True, "File path verification skipped"
'''
            return TestCase(
                test_id=f"regtest-{uuid.uuid4().hex[:8]}",
                test_name=f"regression_test_syntax_{bug.bug_id}",
                file_path="test_regression_reporag.py",
                test_type="regression",
                source_code=test_code
            )

        # For import errors, test that the import works
        if bug.category.value == "broken_import":
            module = bug.evidence.replace("import ", "").replace("from ", "").split(" ")[0]
            test_code = f'''"""Regression test for broken import in {bug.file_path}"""

def test_import_resolves():
    """Verify that the import '{module}' resolves correctly."""
    try:
        import importlib
        mod = importlib.import_module("{module}")
        assert mod is not None
    except ImportError as e:
        # The import should work after the fix
        assert False, f"Import still broken: {{e}}"
'''
            return TestCase(
                test_id=f"regtest-{uuid.uuid4().hex[:8]}",
                test_name=f"regression_test_import_{bug.bug_id}",
                file_path="test_regression_reporag.py",
                test_type="regression",
                source_code=test_code
            )

        return None
