"""Utility for text summarization using Hugging Face transformers."""

from __future__ import annotations

try:
    from transformers import pipeline
except Exception:  # pragma: no cover - library may be missing in some environments
    pipeline = None  # type: ignore


_summarizer = None


def summarize_text(text: str) -> str:
    """Return a summary for the given ``text``.

    The underlying summarization pipeline is initialized lazily on the first
    call to avoid the overhead during application start-up and testing.
    """

    if pipeline is None:  # pragma: no cover
        raise RuntimeError("transformers library is required for summarization")

    global _summarizer
    if _summarizer is None:
        _summarizer = pipeline("summarization")

    result = _summarizer(text, max_length=130, min_length=30, do_sample=False)
    return result[0]["summary_text"]

