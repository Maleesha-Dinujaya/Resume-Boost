import pytest
import requests

URL = "http://localhost:8000/analyze"
PAYLOAD = {
    "resume": "I am a Python developer with React experience.",
    "job_description": "Looking for a senior Python backend engineer with Docker."
}

# Manual test:
# curl -X POST http://localhost:8000/analyze \
#    -H "Content-Type: application/json" \
#    -d '{"resume": "I am a Python developer with React experience.", "job_description": "Looking for a senior Python backend engineer with Docker."}'


def test_analyze_endpoint():
    try:
        resp = requests.post(URL, json=PAYLOAD, timeout=10)
    except requests.exceptions.ConnectionError:
        pytest.skip("API server is not running at localhost:8000")

    data = resp.json()
    print(data)
    assert any("score" in key.lower() for key in data.keys()), "Response missing match score"
    assert any("ats" in key.lower() or "keyword" in key.lower() for key in data.keys()), \
        "Response missing ATS compliance or keyword analysis"
    assert any("semantic" in key.lower() or "skill" in key.lower() for key in data.keys()), \
        "Response missing semantic similarity or skill matching"
