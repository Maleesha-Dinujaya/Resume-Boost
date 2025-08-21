import pytest
import requests

URL = "http://localhost:8000/analyze"
PAYLOAD = {
    "resume_text": "I am a Python developer with React experience.",
    "job_description": "Looking for a senior Python backend engineer with Docker.",
}


def get_access_token(email: str = "test@example.com", password: str = "testpass") -> str:
    """Log in or register then log in to retrieve an access token."""
    login_url = "http://localhost:8000/auth/login"
    register_url = "http://localhost:8000/auth/register"
    try:
        resp = requests.post(login_url, data={"username": email, "password": password}, timeout=10)
    except requests.exceptions.ConnectionError:
        raise
    if resp.status_code == 401:  # user not found; attempt to register
        try:
            requests.post(register_url, json={"email": email, "password": password}, timeout=10)
        except requests.exceptions.ConnectionError:
            raise
        resp = requests.post(login_url, data={"username": email, "password": password}, timeout=10)
    resp.raise_for_status()
    return resp.json()["access_token"]


# Manual test:
# TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
#     -d "username=test@example.com" -d "password=testpass" | jq -r '.access_token')
# curl -X POST http://localhost:8000/analyze \
#     -H "Authorization: Bearer $TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{"resume_text": "I am a Python developer with React experience.", "job_description": "Looking for a senior Python backend engineer with Docker."}'


def test_analyze_endpoint():
    try:
        token = get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.post(URL, json=PAYLOAD, headers=headers, timeout=10)
    except requests.exceptions.ConnectionError:
        pytest.skip("API server is not running at localhost:8000")

    data = resp.json()
    print(data)
    assert any("score" in key.lower() for key in data.keys()), "Response missing match score"
    assert any("ats" in key.lower() or "keyword" in key.lower() for key in data.keys()), \
        "Response missing ATS compliance or keyword analysis"
    assert any("semantic" in key.lower() or "skill" in key.lower() for key in data.keys()), \
        "Response missing semantic similarity or skill matching"

