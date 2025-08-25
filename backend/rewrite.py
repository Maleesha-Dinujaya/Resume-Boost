from __future__ import annotations
from functools import lru_cache
from typing import List


def _load_model():
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained("t5-small")
    model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
    return tokenizer, model


@lru_cache(maxsize=1)
def get_model():
    return _load_model()


def rewrite_bullet(text: str) -> List[str]:
    """Generate alternative phrasings for a resume bullet."""
    tokenizer, model = get_model()
    inputs = tokenizer(
        f"paraphrase: {text}", return_tensors="pt", truncation=True
    )
    outputs = model.generate(
        **inputs, num_beams=5, num_return_sequences=3, max_length=64
    )
    return [tokenizer.decode(o, skip_special_tokens=True) for o in outputs]

