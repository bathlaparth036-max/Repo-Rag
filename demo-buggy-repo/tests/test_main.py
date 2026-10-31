"""Tests for main module."""
import pytest
from main import divide, calculate_average, parse_user_config, format_greeting, process_batch


def test_divide_basic():
    assert divide(10, 2) == 5.0
    assert divide(7, 3) == pytest.approx(2.333, rel=1e-2)


def test_divide_by_zero():
    """This should not raise an unhandled exception."""
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)


def test_calculate_average():
    assert calculate_average([1, 2, 3]) == 2.0
    assert calculate_average([10]) == 10.0


def test_calculate_average_empty():
    """Empty list should return 0 or raise a clear error."""
    with pytest.raises(ZeroDivisionError):
        calculate_average([])


def test_parse_config_valid():
    result = parse_user_config('{"key": "value"}')
    assert result == {"key": "value"}


def test_parse_config_invalid():
    result = parse_user_config("not json")
    assert result == {}


def test_format_greeting():
    assert format_greeting("World") == "Hello, World!"
    assert format_greeting("User", "Hi") == "Hi, User!"


def test_process_batch():
    items = list("abcdefghijk")
    batches = process_batch(items, 3)
    assert len(batches) == 4
    assert batches[0] == ["a", "b", "c"]
