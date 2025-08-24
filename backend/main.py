from __future__ import annotations
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import asyncio

from backend.analyzer import timed_analysis
from .database import Base, engine, SessionLocal
from .models import User, Analysis
from .auth import (
    get_db, hash_password, verify_password,
    create_access_token, get_current_user
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# ---------- Schemas ----------
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    role: Optional[str] = None
    seniority: Optional[str] = None
    emphasis: Optional[List[str]] = None

class RegisterRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- Health ----------
@app.get("/")
def root():
    return {"message": "ResumeBoost backend is running"}

# ---------- Auth ----------
@app.post("/auth/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=data.email, hashed_password=hash_password(data.password))
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)

@app.post("/auth/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)

# ---------- Business endpoints (protected) ----------
@app.post("/analyze")
async def analyze_resume(req: AnalysisRequest, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    if not req.resume_text.strip() or not req.job_description.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description are required")

    try:
        result = await timed_analysis(
            req.resume_text,
            req.job_description,
            req.role,
            req.seniority,
            timeout=2.0,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=503, detail="Analysis timed out")

    analysis = Analysis(
        job_title=(req.role or "Target Position"),
        score=int(result["score"]),
        matched_skills=result["matched_skills"],
        improvement_areas=result["suggestions"],
        highlights=result["suggestions"],
        resume_preview=(req.resume_text[:100] + "...") if len(req.resume_text) > 100 else req.resume_text,
        user_id=me.id,
    )
    db.add(analysis); db.commit(); db.refresh(analysis)

    return {
        "id": str(analysis.id),
        "createdAt": analysis.created_at.isoformat(),
        "jobTitle": analysis.job_title,
        "score": analysis.score,
        "matchedSkills": analysis.matched_skills,
        "improvementAreas": analysis.improvement_areas,
        "highlights": analysis.highlights,
        "resumePreview": analysis.resume_preview,
        "breakdown": result.get("breakdown"),
        "weakRequirements": result.get("weak_requirements"),
        "evidence": result.get("evidence"),
    }

@app.get("/history")
def get_history(db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    items = (
        db.query(Analysis)
          .filter(Analysis.user_id == me.id)
          .order_by(Analysis.created_at.desc())
          .all()
    )
    return {"items": [
        {"id": str(a.id), "createdAt": a.created_at.isoformat(), "role": a.job_title, "score": a.score}
        for a in items
    ]}

@app.get("/history/{analysis_id}")
def get_history_item(analysis_id: int, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    a = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == me.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {
        "id": str(a.id),
        "createdAt": a.created_at.isoformat(),
        "jobTitle": a.job_title,
        "score": a.score,
        "matchedSkills": a.matched_skills,
        "improvementAreas": a.improvement_areas,
        "highlights": a.highlights,
        "resumePreview": a.resume_preview,
    }

@app.delete("/history/{analysis_id}")
def delete_history_item(analysis_id: int, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    a = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == me.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(a); db.commit()
    return {"status": "deleted"}
