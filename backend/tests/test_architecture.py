from __future__ import annotations

import ast
import unittest
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = REPOSITORY_ROOT / "backend" / "src" / "bell_below"


class ArchitectureBoundaryTests(unittest.TestCase):
    def test_content_contracts_have_no_runtime_framework_dependencies(self) -> None:
        forbidden_roots = {
            "anthropic",
            "fastapi",
            "openai",
            "sqlalchemy",
            "starlette",
        }
        violations: list[str] = []

        for path in sorted(SOURCE_ROOT.rglob("*.py")):
            tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    roots = {alias.name.split(".", 1)[0] for alias in node.names}
                elif isinstance(node, ast.ImportFrom) and node.module is not None:
                    roots = {node.module.split(".", 1)[0]}
                else:
                    continue
                for root in roots & forbidden_roots:
                    violations.append(f"{path.relative_to(REPOSITORY_ROOT)} imports {root}")

        self.assertEqual(violations, [])


if __name__ == "__main__":
    unittest.main()
