import numpy as np
import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[2]))
from backend import analyzer


def test_embedding_match(monkeypatch):
    class DummyEmbedder:
        def encode(self, sentences, normalize_embeddings=True):
            mapping = {
                "I know Python.": np.array([1.0, 0.0, 0.0]),
                "I have data": np.array([0.0, 1.0, 0.0]),
                "Looking for Python developer.": np.array([1.0, 0.0, 0.0]),
                "Must know JavaScript": np.array([0.0, 0.0, 1.0]),
            }
            arr = np.vstack([mapping.get(s, np.zeros(3)) for s in sentences])
            if normalize_embeddings:
                arr = arr / np.linalg.norm(arr, axis=1, keepdims=True)
            return arr

    monkeypatch.setattr(analyzer, "get_embedder", lambda: DummyEmbedder())

    resume = "I know Python. I have data"
    jd = "Looking for Python developer. Must know JavaScript"
    result = analyzer.embedding_match(resume, jd)

    assert len(result["support"]) == 2
    assert "Must know JavaScript" in result["weak_requirements"]
    assert result["support"][0][2] > 0.9
