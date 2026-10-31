"""Main application module — a simple calculator and data processor.

This module contains intentional bugs for demonstrating autonomous repair.
"""
import json
from typing import List, Optional


def divide(a: float, b: float) -> float:
    """Divide a by b."""
    # BUG: No zero-division guard
    return a / b


def calculate_average(numbers: List[float]) -> float:
    """Calculate the average of a list of numbers."""
    # BUG: crashes on empty list (ZeroDivisionError)
    total = sum(numbers)
    return total / len(numbers)


def parse_user_config(config_string: str) -> dict:
    """Parse a JSON configuration string."""
    try:
        data = json.loads(config_string)
        return data
    except:
        # BUG: bare except — catches SystemExit, KeyboardInterrupt, etc.
        return {}


def find_element(data: list, target: str) -> int:
    """Find the index of a target in a list. Returns -1 if not found."""
    # BUG: uses == instead of proper comparison, and doesn't handle None
    for i in range(len(data)):
        if data[i] == target:
            return i
    return -1


def merge_records(defaults: dict, overrides: dict = {}) -> dict:
    """Merge two dictionaries. Overrides take precedence."""
    # BUG: mutable default argument — shared across calls
    defaults.update(overrides)
    return defaults


def format_greeting(name: str, greeting: str = "Hello") -> str:
    """Format a greeting message."""
    return f"{greeting}, {name}!"


def process_batch(items: List[str], batch_size: int = 10) -> List[List[str]]:
    """Split items into batches."""
    batches = []
    for i in range(0, len(items), batch_size):
        batches.append(items[i:i + batch_size])
    return batches
