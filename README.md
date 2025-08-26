# Resume Boost

Resume Boost is a friendly web app that checks how well a resume matches a job description.  It uses a **FastAPI** backend with machine‑learning models and a **React + Vite** frontend.

The guide below walks you through every step, from nothing installed to seeing the site in your browser.  Each instruction is written so that even a beginner can follow along.

---

## 1. What you need before you start

Pick one of the two ways to run the project:

### Option A – Use Docker (recommended for new users)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
* Git installed.

### Option B – Run directly on your computer
* **Python 3.11 or newer**
* **Node.js 18 or newer** (includes `npm`)
* Git installed

---

## 2. Get the project files

Open a terminal and run:

```bash
git clone https://github.com/some-user/Resume-Boost.git
cd Resume-Boost
```

---

## 3. Start the app with Docker (Option A)

1. Make sure Docker Desktop is running.
2. Inside the project folder run:
   ```bash
   docker-compose up --build
   ```
3. Wait until you see messages saying the **frontend** is listening on port `5173` and the **backend** on port `8000`.
4. Open a browser and visit:
   * Frontend: <http://localhost:5173>
   * API docs: <http://localhost:8000/docs>
5. To stop everything press `Ctrl + C` in the terminal and run `docker-compose down`.

---

## 4. Start the app without Docker (Option B)

### 4.1 Run the backend
1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```
2. Install backend packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The API docs will now be at <http://localhost:8000/docs>.

### 4.2 Run the frontend
1. Open a second terminal and go to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install JavaScript packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The site will be at <http://localhost:5173>.

### 4.3 Stop the servers
Press `Ctrl + C` in each terminal window when you are done.

---

## 5. Using the app
1. Visit <http://localhost:5173>.
2. Paste or upload a resume and the job description.
3. Click the **Analyze** button.
4. Read the score and suggestions to improve the resume.

---

## 6. Run the automated tests (optional)
Running tests checks that the backend behaves as expected.  From the project root run:

```bash
pytest
```

If the tests fail because a large package (like `scipy`) is missing, install the requirements again or read the error message for hints.

---

## 7. How it works (for the curious)
* **Skill Match** – finds important words in the job post and checks if they appear in the resume.
* **Semantic Similarity** – uses Sentence‑BERT models to compare the meaning of sentences.
* **ATS Optimisation** – looks for good structure, action verbs and other tips to pass applicant‑tracking systems.

---

## 8. Project structure
```
Resume-Boost/
├── backend/        # FastAPI server and ML code
├── frontend/       # React app built with Vite
├── docker-compose.yml
└── README.md
```

Enjoy improving your resume!

