"""Utility functions for data processing."""
from typing import List, Dict, Any, Optional


def flatten_list(nested: List[List[Any]]) -> List[Any]:
    """Flatten a nested list into a single list."""
    result = []
    for sublist in nested:
        result.extend(sublist)
    return result


def safe_get(data: dict, key: str, default: Any = None) -> Any:
    """Safely get a value from a dictionary."""
    return data.get(key, default)


def count_words(text: str) -> Dict[str, int]:
    """Count word frequencies in a text string."""
    words = text.lower().split()
    counts = {}
    for word in words:
        word = word.strip(".,!?;:\"'")
        if word:
            counts[word] = counts.get(word, 0) + 1
    return counts


def validate_email(email: str) -> bool:
    """Simple email validation."""
    # BUG: overly simplistic — doesn't validate properly
    return "@" in email


def truncate_string(text: str, max_length: int = 100) -> str:
    """Truncate a string to max_length, adding ellipsis if needed."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
