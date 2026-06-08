# MedMinder V3 — Full Stack (PostgreSQL + OpenRouter)

## Local Setup

### 1. Get a free PostgreSQL database from Neon
1. Go to https://neon.tech and sign up free
2. Create a new project → name it "medminder"
3. Copy the connection string — looks like:
   `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Set up backend .env
Edit `backend/.env` and fill in your values:
```
DATABASE_URL=postgresql://your-neon-url-here
OPENROUTER_API_KEY=sk-or-v1-your-key-here
FRONTEND_URL=http://localhost:5173
```

### 3. Run backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Test at: http://localhost:8000/docs

### 4. Run frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

---

## Deploy to Production

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "MedMinder v3"
git remote add origin https://github.com/YOUR_USERNAME/medminder.git
git push -u origin main
```

### Step 2 — Deploy Backend to Render
1. Go to render.com → New Web Service
2. Connect your GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables (add all three):
   - `DATABASE_URL` = your Neon connection string
   - `OPENROUTER_API_KEY` = your OpenRouter key
   - `FRONTEND_URL` = https://your-app.vercel.app (add after Vercel deploy)
5. Deploy → copy your Render URL

### Step 3 — Deploy Frontend to Vercel
1. Go to vercel.com → New Project → import your repo
2. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
3. Environment Variables:
   - `VITE_API_URL` = https://your-app.onrender.com
4. Deploy → copy your Vercel URL

### Step 4 — Fix CORS (final step)
1. Go to Render dashboard → your service → Environment
2. Update `FRONTEND_URL` = https://your-app.vercel.app
3. Click Save → Render redeploys automatically

### Step 5 — Keep backend awake (UptimeRobot)
1. Go to uptimerobot.com → sign up free
2. New Monitor → HTTP(s)
3. URL: https://your-app.onrender.com
4. Interval: every 5 minutes
5. Save — backend never sleeps again
