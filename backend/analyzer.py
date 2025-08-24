from __future__ import annotations

import re
from functools import lru_cache
from typing import Dict, List, Tuple, Optional
import asyncio

import numpy as np
import spacy
try:  # pragma: no cover - optional dependency in tests
    # Sentence-BERT models from PWC (https://paperswithcode.com/paper/sentence-bert)
    from sentence_transformers import SentenceTransformer, CrossEncoder
except Exception:  # pragma: no cover
    SentenceTransformer = None  # type: ignore
    CrossEncoder = None  # type: ignore
try:  # pragma: no cover - keyword extraction via GitHub project FlashText
    # FlashText repo: https://github.com/vi3k6i5/flashtext
    from flashtext import KeywordProcessor
except Exception:  # pragma: no cover
    KeywordProcessor = None  # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer
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

ROLE_PRIORITY = {
    "data scientist": ["python", "pandas", "numpy", "sql", "statistics", "machine learning"],
    "frontend developer": ["javascript", "react", "typescript", "css", "html"],
    "backend developer": ["python", "node.js", "sql", "aws", "docker"],
}

SENIORITY_PRIORITY = {
    "junior": ["learning", "collaboration"],
    "senior": ["leadership", "architecture", "mentoring"],
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


@lru_cache(maxsize=1)
def get_embedder() -> SentenceTransformer:
    """Load and cache the sentence transformer model."""
    if SentenceTransformer is None:  # pragma: no cover
        raise ImportError("sentence-transformers not installed")
    return SentenceTransformer("all-MiniLM-L6-v2")


@lru_cache(maxsize=1)
def get_cross_encoder() -> CrossEncoder:
    """Load and cache cross-encoder model for fine-grained similarity."""
    if CrossEncoder is None:  # pragma: no cover
        raise ImportError("sentence-transformers not installed")
    return CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def split_sents(text: str) -> List[str]:
    """Split text into sentences or bullet points with a cap of 200."""
    chunks = re.split(r"[\n\r•\-]+", text)
    sents: List[str] = []
    for chunk in chunks:
        parts = re.split(r"(?<=[.!?]) +", chunk)
        for p in parts:
            p = p.strip()
            if p:
                sents.append(p)
            if len(sents) >= 200:
                return sents[:200]
    return sents[:200]


def embedding_match(resume_text: str, jd_text: str) -> Dict:
    """Return semantic matching stats using sentence embeddings."""
    resume = split_sents(resume_text)
    jd = split_sents(jd_text)
    if not resume or not jd:
        return {"semantic": 0.0, "weak_requirements": jd, "support": []}

    model = get_embedder()
    R = model.encode(resume, normalize_embeddings=True)
    J = model.encode(jd, normalize_embeddings=True)

    sims = np.clip(R @ J.T, -1, 1)
    best_idx = sims.argmax(axis=0)
    top_per_jd = sims[best_idx, np.arange(len(jd))]

    weak = [jd[i] for i, v in enumerate(top_per_jd) if v < 0.45]
    support = [
        (jd[i], resume[best_idx[i]], float(top_per_jd[i]))
        for i in range(len(jd))
    ]
    return {
        "semantic": float(top_per_jd.mean()) if len(top_per_jd) else 0.0,
        "weak_requirements": weak,
        "support": support,
    }


def cross_encoder_match(resume_text: str, jd_text: str) -> Dict:
    """Refine semantic stats using a cross-encoder model."""
    resume = split_sents(resume_text)
    jd = split_sents(jd_text)
    if not resume or not jd:
        return {"semantic": 0.0, "support": []}

    model = get_cross_encoder()
    pairs = [[j, r] for j in jd for r in resume]
    scores = np.array(model.predict(pairs))
    scores = 1 / (1 + np.exp(-scores))  # map logits to 0–1
    scores = 2 * scores - 1  # optional [-1, 1] range for cosine consistency
    scores = scores.reshape(len(jd), len(resume))
    scores = np.clip(scores, -1, 1)

    best_idx = scores.argmax(axis=1)
    top_scores = scores[np.arange(len(jd)), best_idx]
    support = [
        (jd[i], resume[best_idx[i]], float(np.clip(top_scores[i], -1, 1)))
        for i in range(len(jd))
    ]
    semantic = float(np.clip(top_scores.mean(), -1, 1)) if len(top_scores) else 0.0
    return {"semantic": semantic, "support": support}


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
    if KeywordProcessor:
        kp = KeywordProcessor(case_sensitive=False)
        for skill in job_skills:
            kp.add_keyword(skill)
        found = kp.extract_keywords(text_lower)
        density = len(found) / total_tokens
    else:
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
    role: Optional[str] = None,
    seniority: Optional[str] = None,
) -> Tuple[
    float,
    Dict[str, float],
    List[str],
    Dict[str, List[str]],
    List[str],
    List[str],
    List[Tuple[str, str, float]],
]:
    """Compute overall score, breakdown, matched/missing skills and suggestions."""

    jd_sents = split_sents(job_text)
    vectorizer = TfidfVectorizer(ngram_range=(1, 2)).fit(jd_sents or [job_text])
    tfidf_matrix = vectorizer.transform(jd_sents or [job_text])

    priority = set()
    if role:
        priority.update(ROLE_PRIORITY.get(role.lower(), []))
    if seniority:
        priority.update(SENIORITY_PRIORITY.get(seniority.lower(), []))

    # Skill weights via TF-IDF
    skill_weights: Dict[str, float] = {}
    for skill in job_skills:
        key = skill.lower()
        tokens = key.split()
        weight = 0.0
        phrase_idx = vectorizer.vocabulary_.get(key)
        if phrase_idx is not None:
            weight += float(tfidf_matrix[:, phrase_idx].max())
        if phrase_idx is None or len(tokens) > 1:
            for t in tokens:
                idx = vectorizer.vocabulary_.get(t)
                if idx is not None:
                    weight += float(tfidf_matrix[:, idx].max())
        if weight == 0.0:
            weight = 0.1
        if key in priority:
            weight *= 1.3
        skill_weights[skill] = weight

    total_skill_weight = sum(skill_weights.values()) or 1.0
    matched = [s for s in job_skills if s in resume_skills]
    coverage = sum(skill_weights[s] for s in matched) / total_skill_weight * 50

    # Embedding-based semantic matching
    embed = embedding_match(resume_text, job_text)
    similarities = np.array([sim for _, _, sim in embed["support"]])
    sentence_weights = np.array(tfidf_matrix.sum(axis=1)).flatten() if jd_sents else np.array([1.0])
    for i, jd_sentence in enumerate(jd_sents):
        if any(p in jd_sentence.lower() for p in priority):
            sentence_weights[i] *= 1.3
    if sentence_weights.sum() == 0:
        sentence_weights += 1.0
    weighted_sem = float((similarities * sentence_weights).sum() / sentence_weights.sum()) if len(similarities) else 0.0

    # Cross-encoder refinement (PWC model). Fallback silently if unavailable.
    cross_sem = 0.0
    cross_support: List[Tuple[str, str, float]] = []
    try:
        cross = cross_encoder_match(resume_text, job_text)
        cross_sem = cross["semantic"]
        cross_support = cross["support"]
    except Exception:
        pass

    combined_sem = weighted_sem
    support = embed["support"]
    if cross_sem:
        combined_sem = (weighted_sem + cross_sem) / 2
        if cross_support:
            support = cross_support

    semantic_score = combined_sem * 30

    # ATS analysis
    ats_score, ats_suggestions = ats_analysis(resume_text, job_skills)

    # Missing skills priority
    missing = prioritize_missing(job_skills, resume_skills, job_text)

    total = coverage + semantic_score + ats_score
    breakdown = {
        "skill_match": round(coverage, 2),
        "semantic_similarity": round(semantic_score, 2),
        "ats_optimization": round(ats_score, 2),
    }

    suggestions = []
    for level in ("high_priority", "medium_priority"):
        for skill in missing[level]:
            suggestions.append(f"Include '{skill}' in your resume")
    suggestions.extend(ats_suggestions)
    while len(suggestions) < 3:
        suggestions.append("Add quantifiable achievements to your experience")

    return (
        round(total, 2),
        breakdown,
        matched,
        missing,
        suggestions,
        embed["weak_requirements"],
        support,
    )


# ---------------------------------------------------------------------------
# Public analysis API
# ---------------------------------------------------------------------------

async def perform_analysis(
    resume_text: str,
    job_description: str,
    role: Optional[str] = None,
    seniority: Optional[str] = None,
) -> Dict:
    nlp = get_nlp()  # ensure model loaded
    job_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)
    (
        score,
        breakdown,
        matched,
        missing,
        suggestions,
        weak_requirements,
        support,
    ) = calculate_scores(
        job_skills,
        resume_skills,
        resume_text,
        job_description,
        role,
        seniority,
    )
    evidence = [
        {"jd": jd, "resume": r, "similarity": sim} for jd, r, sim in support
    ]
    return {
        "score": score,
        "breakdown": breakdown,
        "matched_skills": matched,
        "missing_skills": missing,
        "suggestions": suggestions,
        "weak_requirements": weak_requirements,
        "evidence": evidence,
    }


async def timed_analysis(
    resume_text: str,
    job_description: str,
    role: Optional[str] = None,
    seniority: Optional[str] = None,
    timeout: float = 5.0,
) -> Dict:
    """Run analysis with a timeout."""
    return await asyncio.wait_for(
        perform_analysis(resume_text, job_description, role, seniority),
        timeout=timeout,
    )
