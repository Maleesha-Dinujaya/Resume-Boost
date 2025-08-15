from __future__ import annotations

from functools import lru_cache
from typing import Dict, List, Tuple
import asyncio

import spacy
from spacy.language import Language
# Add skill synonyms mapping
SKILL_SYNONYMS = {
    "javascript": "JavaScript",
    "js": "JavaScript",
    "node js": "Node.js",
    "node": "Node.js",
    "python": "Python",
    "python3": "Python",
    "python 3.11": "Python",
    "react": "React",
    "typescript": "TypeScript",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "data analysis": "Data Analysis",
    "team leadership": "Leadership",
    "led team": "Leadership",
}

from spacy.pipeline import EntityRuler

# ---------------------------------------------------------------------------
# NLP model loading
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def get_nlp() -> Language:
    """Load and cache the spaCy model."""
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # Fallback to blank model if the small English model is unavailable
        nlp = spacy.blank("en")
    _add_skill_ruler(nlp)
    return nlp


def _add_skill_ruler(nlp: Language) -> None:
    """Add an EntityRuler with custom skill patterns and synonyms."""
    if "entity_ruler" in nlp.pipe_names:
        return

    ruler = nlp.add_pipe("entity_ruler", before="ner") if "ner" in nlp.pipe_names else nlp.add_pipe("entity_ruler")
    patterns = []
    for syn in SKILL_SYNONYMS:
        tokens = [{"LOWER": t} for t in syn.split()]
        patterns.append({"label": "SKILL", "pattern": tokens})
    ruler.add_patterns(patterns)



# ---------------------------------------------------------------------------
# Skill extraction and semantic utilities
# ---------------------------------------------------------------------------


def extract_skills(text: str) -> List[str]:
    """Extract skills from text using NER and synonym mapping."""
    nlp = get_nlp()
    doc = nlp(text)
    skill_map: Dict[str, str] = SKILL_SYNONYMS
    skills = set()
    for ent in doc.ents:
        if ent.label_ == "SKILL":
            canonical = skill_map.get(ent.text.lower(), ent.text)
            skills.add(canonical)
    return sorted(skills)


def semantic_similarity(a: str, b: str) -> float:
    """Return semantic similarity between two strings."""
    nlp = get_nlp()
    doc_a, doc_b = nlp(a), nlp(b)
    if nlp.vocab.vectors.n_keys == 0:
        return 0.0
    return float(doc_a.similarity(doc_b))


def prioritize_missing(job_skills: List[str], resume_skills: List[str], job_text: str) -> Dict[str, List[str]]:
    """Return missing skills prioritized by frequency and first occurrence."""
    missing = [s for s in job_skills if s not in resume_skills]
    scored: List[Tuple[str, float]] = []
    lower_job = job_text.lower()
    for skill in missing:
        freq = lower_job.count(skill.lower())
        pos = lower_job.find(skill.lower())
        weight = freq + (1 / (pos + 1) if pos >= 0 else 0)
        scored.append((skill, weight))
    high = [s for s, w in scored if w >= 2]
    med = [s for s, w in scored if 1 <= w < 2]
    return {"high_priority": sorted(high), "medium_priority": sorted(med)}


# ---------------------------------------------------------------------------
# ATS optimisation
# ---------------------------------------------------------------------------

def ats_analysis(resume_text: str, job_skills: List[str]) -> Tuple[float, List[str]]:
    """Compute ATS compliance score and suggestions."""
    suggestions: List[str] = []
    total_score = 0.0
    text_lower = resume_text.lower()

    # Keyword density (10 points)
    tokens = resume_text.split()
    total_tokens = len(tokens) or 1
    keyword_hits = sum(text_lower.count(skill.lower()) for skill in job_skills)
    density = keyword_hits / total_tokens
    if density > 0.02:
        total_score += 10
    elif density > 0.01:
        total_score += 6
        suggestions.append("Increase keyword density for job-specific terms")
    else:
        total_score += 2
        suggestions.append("Increase keyword density for job-specific terms")

    # Action verbs (5 points)
    action_verbs = ["led", "managed", "built", "created", "developed", "designed"]
    lines = [l.strip().lower() for l in resume_text.splitlines() if l.strip()]
    verb_count = sum(1 for l in lines if l.split()[0] in action_verbs)
    if verb_count >= 3:
        total_score += 5
    else:
        total_score += verb_count / 3 * 5
        suggestions.append("Use more action verbs to describe achievements")

    # Section completeness (5 points)
    sections = ["education", "experience"]
    if all(sec in text_lower for sec in sections):
        total_score += 5
    else:
        total_score += 2
        suggestions.append("Include Education and Experience sections")

    return total_score, suggestions


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def calculate_scores(
    job_skills: List[str],
    resume_skills: List[str],
    resume_text: str,
    job_text: str,
) -> Tuple[float, Dict[str, float], List[str], Dict[str, List[str]], List[str]]:
    """Compute overall score, breakdown, matched and missing skills, suggestions."""
    # Skill match coverage
    matched = []
    unmatched_job = []
    for js in job_skills:
        if js in resume_skills:
            matched.append(js)
        else:
            unmatched_job.append(js)

    coverage = (len(matched) / len(job_skills) * 50) if job_skills else 0.0

    # Semantic relevance
    sem = semantic_similarity(resume_text, job_text) * 30

    # ATS analysis
    ats_score, ats_suggestions = ats_analysis(resume_text, job_skills)

    # Missing skills priority
    missing = prioritize_missing(job_skills, resume_skills, job_text)

    total = coverage + sem + ats_score
    breakdown = {
        "skill_match": round(coverage, 2),
        "semantic_similarity": round(sem, 2),
        "ats_optimization": round(ats_score, 2),
    }

    suggestions = []
    for level in ("high_priority", "medium_priority"):
        for skill in missing[level]:
            suggestions.append(f"Include '{skill}' in your resume")
    suggestions.extend(ats_suggestions)
    # Ensure at least three suggestions
    while len(suggestions) < 3:
        suggestions.append("Add quantifiable achievements to your experience")

    return round(total, 2), breakdown, matched, missing, suggestions


# ---------------------------------------------------------------------------
# Public analysis API
# ---------------------------------------------------------------------------

async def perform_analysis(resume_text: str, job_description: str) -> Dict:
    nlp = get_nlp()  # ensure model loaded
    job_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)
    score, breakdown, matched, missing, suggestions = calculate_scores(
        job_skills, resume_skills, resume_text, job_description
    )
    return {
        "score": score,
        "breakdown": breakdown,
        "matched_skills": matched,
        "missing_skills": missing,
        "suggestions": suggestions,
    }


async def timed_analysis(resume_text: str, job_description: str, timeout: float = 5.0) -> Dict:
    """Run analysis with a timeout."""
    return await asyncio.wait_for(perform_analysis(resume_text, job_description), timeout=timeout)
