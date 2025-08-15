import pytest
from fastapi.testclient import TestClient


from backend.main import app
from backend.analyzer import extract_skills

client = TestClient(app)


def test_synonym_handling():
    resume = "Experienced in JS and Node js development"
    skills = extract_skills(resume)
    assert "JavaScript" in skills
    assert "Node.js" in skills


def test_score_calculation_logic():
    resume = "Python and React developer"
    job = "Looking for a Python React engineer"
    resp = client.post("/analyze", json={"resume_text": resume, "job_description": job})
    assert resp.status_code == 200
    data = resp.json()
    total = (
        data["breakdown"]["skill_match"]
        + data["breakdown"]["semantic_similarity"]
        + data["breakdown"]["ats_optimization"]
    )
    assert pytest.approx(total, rel=1e-3) == data["score"]


def test_empty_input():
    resp = client.post("/analyze", json={"resume_text": "", "job_description": ""})
    assert resp.status_code == 400


def test_non_english_text():
    spanish_resume = "Trabajo en equipo y liderazgo"
    skills = extract_skills(spanish_resume)
    assert skills == []
