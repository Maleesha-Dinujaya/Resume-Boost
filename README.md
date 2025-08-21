 # Resume Boost
 
 A full-stack application that analyzes resumes against job descriptions using FastAPI and a React front-end.
 
 ## ML Analysis
 
 The backend uses Sentence-BERT embeddings (``all-MiniLM-L6-v2``) combined with TF-IDF weighting to compare job descriptions with resume content. Important terms from the job description receive higher weights, and additional boosts are applied for role and seniority specific skills. The final score is composed of:
 
 - **Skill Match (50%)** – weighted coverage of job-required skills.
 - **Semantic Similarity (30%)** – average embedding similarity between job and resume sentences.
 - **ATS Optimization (20%)** – heuristic checks for keyword density, action verbs, and section completeness.
 
+### Integrated open-source components
+
+- **Cross-encoder semantic scorer** – Optionally loads the `ms-marco-MiniLM-L-6-v2` cross-encoder from Papers With Code to refine sentence-level similarity beyond standard embeddings. If the model is unavailable, the system falls back to embedding similarity alone.
+- **FlashText keyword extractor** – ATS keyword checks use the open-source FlashText library from GitHub for fast lookup of required terms. When FlashText is not installed, a simple keyword counter is used instead.
+
 To run the backend analysis locally:
 
 ```bash
 cd backend
 pip install -r requirements.txt
 uvicorn main:app --reload
 ```
 
 The frontend can be started from the `frontend` directory with `npm install` and `npm run dev`.
