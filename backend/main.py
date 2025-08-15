from fastapi import FastAPI, UploadFile, File
from typing import Optional
import spacy

app = FastAPI()

# Load NLP model (for resume parsing)
nlp = spacy.load("en_core_web_sm")

@app.post("/analyze")
async def analyze_resume(
    resume_text: str,
    job_description: str,
    role: Optional[str] = None,
    emphasis: Optional[list[str]] = None
):
    """Analyze resume against job description using NLP."""
    # Process text with spaCy
    doc = nlp(resume_text)
    
    # Extract skills (simple example)
    skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    
    # Calculate match score (placeholder logic)
    match_score = 75  # Replace with real AI logic later
    
    return {
        "score": match_score,
        "matched_skills": skills,
        "improvement_areas": ["Add more metrics", "Highlight leadership"],
        "highlights": ["Built React apps", "Led team projects"]
    }

# Run the server (development mode)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)