import sys, pathlib, numpy as np
sys.path.append(str(pathlib.Path(__file__).resolve().parents[2]))
from backend import analyzer


def test_cross_encoder_match_bounds(monkeypatch):
    class DummyCrossEncoder:
        def predict(self, pairs):
            return np.array([-2.0, -3.0, -3.0, 5.0])

    monkeypatch.setattr(analyzer, "get_cross_encoder", lambda: DummyCrossEncoder())

    resume = "A. B."
    jd = "C. D."
    result = analyzer.cross_encoder_match(resume, jd)

    assert len(result["support"]) == 2
    for _, _, sim in result["support"]:
        assert -1.0 <= sim <= 1.0
    assert any(sim < 0 for _, _, sim in result["support"])
    assert -1.0 <= result["semantic"] <= 1.0
