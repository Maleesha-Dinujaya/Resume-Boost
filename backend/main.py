from __future__ import annotations
from typing import Optional, List, Dict, Tuple 
from fastapi import FastAPI, HTTPException
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import asyncio

from analyzer import timed_analysis

app = FastAPI()

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    role: Optional[str] = None
    emphasis: Optional[List[str]] = None

# In-memory storage for analyses
analyses: list[dict] = []
next_id = 1


@app.post("/analyze")
async def analyze_resume(req: AnalysisRequest):
    resume_text = req.resume_text
    job_description = req.job_description
    role = req.role
    emphasis = req.emphasis
    """Analyze resume against job description using NLP."""
    global next_id

    if not resume_text.strip() or not job_description.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description are required")

    try:
        result = await timed_analysis(resume_text, job_description, timeout=2.0)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=503, detail="Analysis timed out")

    analysis_id = str(next_id)
    next_id += 1
    created_at = datetime.utcnow().isoformat()

    analysis = {
        "id": analysis_id,
        "createdAt": created_at,
        "jobTitle": role or "Target Position",
        **result,
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
