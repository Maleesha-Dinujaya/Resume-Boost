from fastapi import FastAPI, HTTPException
from typing import Optional
from datetime import datetime
import spacy

app = FastAPI()

# Load NLP model (for resume parsing)
nlp = spacy.load("en_core_web_sm")

# In-memory storage for analyses
analyses: list[dict] = []
next_id = 1


@app.post("/analyze")
async def analyze_resume(
    resume_text: str,
    job_description: str,
    role: Optional[str] = None,
    emphasis: Optional[list[str]] = None,
):
    """Analyze resume against job description using NLP."""
    global next_id

    # Process text with spaCy
    doc = nlp(resume_text)

    # Extract skills (simple example)
    skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]

    # Calculate match score (placeholder logic)
    match_score = 75  # Replace with real AI logic later

    analysis_id = str(next_id)
    next_id += 1
    created_at = datetime.utcnow().isoformat()

    analysis = {
        "id": analysis_id,
        "createdAt": created_at,
        "jobTitle": role or "Target Position",
        "score": match_score,
        "matchedSkills": skills,
        "improvementAreas": ["Add more metrics", "Highlight leadership"],
        "highlights": ["Built React apps", "Led team projects"],
        "resumePreview": (resume_text[:100] + "...") if len(resume_text) > 100 else resume_text,
    }

    analyses.insert(0, analysis)
    return analysis


@app.get("/history")
async def get_history():
    """Return list of past analyses."""
    items = [
        {
            "id": a["id"],
            "createdAt": a["createdAt"],
            "role": a.get("jobTitle", "Unnamed Role"),
            "score": a["score"],
        }
        for a in analyses
    ]
    return {"items": items}


@app.get("/history/{analysis_id}")
async def get_history_item(analysis_id: str):
    for a in analyses:
        if a["id"] == analysis_id:
            return a
    raise HTTPException(status_code=404, detail="Analysis not found")


@app.delete("/history/{analysis_id}")
async def delete_history_item(analysis_id: str):
    for idx, a in enumerate(analyses):
        if a["id"] == analysis_id:
            analyses.pop(idx)
            return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Analysis not found")


# Run the server (development mode)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
