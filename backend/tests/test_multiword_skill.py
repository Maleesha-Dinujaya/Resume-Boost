import backend.analyzer as analyzer


def test_multiword_skill_weight(monkeypatch):
    monkeypatch.setattr(
        analyzer,
        "embedding_match",
        lambda *_args, **_kwargs: {"semantic": 0.0, "weak_requirements": [], "support": []},
    )
    monkeypatch.setattr(
        analyzer,
        "cross_encoder_match",
        lambda *_args, **_kwargs: {"semantic": 0.0, "support": []},
    )

    resume = "Experienced in machine learning"
    job = "machine learning machine learning python"
    job_skills = analyzer.extract_skills(job)
    resume_skills = analyzer.extract_skills(resume)
    _, breakdown, *_ = analyzer.calculate_scores(job_skills, resume_skills, resume, job)
    assert breakdown["skill_match"] > 40

