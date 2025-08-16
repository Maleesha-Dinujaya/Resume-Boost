# Authentication Guide

The ResumeBoost frontend now provides end-to-end authentication against the FastAPI backend.

## Routes
- **/register** – create an account with email and password. Automatically signs the user in.
- **/login** – authenticate an existing account.
- **/history** – protected; only accessible when signed in.

## Flow
1. Register or log in to obtain a JWT `access_token` from the API.
2. The token is stored in `localStorage` under `resumeBoost_auth` and automatically attached to API requests.
3. Header shows the current user and offers a logout option.
4. Logging out clears the token and redirects to the landing page.

## Local Testing
1. **Start backend**: `uvicorn backend.main:app --reload` (port 8000).
2. **Start frontend**: from `frontend` run `npm install` then `npm run dev` (port 5173).
3. Visit `http://localhost:5173/register` or `/login` to create an account and sign in.
4. After authentication you can access `/history`; logging out will protect it again.

E2E tests using Playwright are available in `frontend/e2e/auth.spec.ts`.
