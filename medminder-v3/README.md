# 💊 MedMinder

> A full-stack medication management web app that helps patients track daily doses, get refill reminders, and check dangerous drug interactions using AI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-brightgreen?style=for-the-badge)](https://medminder.vercel.app)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🎬 Demo

![MedMinder Demo](assets/demo.gif)

---

## 📸 Screenshots

### Dashboard — Daily progress & streak tracker
![Dashboard](assets/dashboard.png)

### Medications — Add, edit & manage your medications
![Medications](assets/medications.png)

### Schedule — Timeline view of your day
![Schedule](assets/schedule.png)

### AI Interaction Checker — Powered by GPT-4o-mini
![Interactions](assets/interactions.png)

---

## 🚑 The Problem

Over **125,000 deaths** occur annually in the US alone due to medication non-adherence. Patients managing multiple medications struggle with:

- Forgetting doses or accidentally double-dosing
- Not knowing dangerous drug-drug interactions
- Missing refill deadlines
- No simple tool that does all of this in one place

**MedMinder solves this.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 💊 Medication Management | Add, edit, delete medications with dose, frequency and schedule |
| ✅ Dose Tracking | Mark doses as taken, progress ring updates in real time |
| 🗓️ Daily Schedule | Timeline view organised by time of day |
| 🤖 AI Interaction Checker | Detects major, moderate and minor drug interactions using AI |
| ⚠️ Refill Reminders | Alerts when pill count drops to 7 or below |
| 🔥 Streak Tracker | 7-day adherence calendar to build healthy habits |
| 💾 Persistent Storage | All data saved to PostgreSQL — never lost on refresh |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — component-based UI
- **Vite** — fast dev server and build tool
- **Vanilla CSS** — custom design system, no UI library

### Backend
- **FastAPI** — high-performance Python API framework
- **PostgreSQL** — production-grade relational database (hosted on Neon)
- **psycopg2** — PostgreSQL adapter for Python
- **python-dotenv** — environment variable management

### AI
- **OpenRouter API** — routes to GPT-4o-mini for drug interaction analysis

### Deployment
- **Vercel** — frontend hosting with CI/CD
- **Render** — backend hosting with auto-deploy from GitHub
- **Neon** — serverless PostgreSQL database

---

## 📁 Project Structure

```
medminder/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS
│   │   ├── database.py      # PostgreSQL connection + table init
│   │   ├── models.py        # Pydantic schemas
│   │   └── routes/
│   │       ├── medications.py   # CRUD endpoints
│   │       ├── doses.py         # Dose toggle + streak
│   │       └── interactions.py  # AI interaction checker
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Medications.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Interactions.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── UI.jsx
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── api.js           # All backend fetch calls
│   │   └── App.jsx
│   └── package.json
├── assets/                  # Screenshots for README
└── README.md
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Neon](https://neon.tech) PostgreSQL database

### 1. Clone the repo
```bash
git clone https://github.com/mohith292005/medminder.git
cd medminder
```

### 2. Set up backend
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
DATABASE_URL=postgresql://your-neon-url-here
OPENROUTER_API_KEY=your-openrouter-key-here
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
uvicorn app.main:app --reload
```
API runs at → http://localhost:8000  
API docs at → http://localhost:8000/docs

### 3. Set up frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at → http://localhost:5173

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications/` | List all medications |
| POST | `/api/medications/` | Add a medication |
| PUT | `/api/medications/{id}` | Update a medication |
| DELETE | `/api/medications/{id}` | Delete a medication |
| GET | `/api/doses/{date}` | Get doses for a date |
| POST | `/api/doses/toggle` | Toggle dose taken/untaken |
| GET | `/api/doses/streak/last7` | Get last 7 days streak |
| POST | `/api/interactions/check` | AI drug interaction check |

---

## ☁️ Deployment

| Service | Purpose | URL |
|---|---|---|
| Vercel | Frontend | https://medminder-beryl.vercel.app |
| Render | Backend API | https://medminder-u38p.onrender.com |
| Neon | PostgreSQL DB | neon.tech |

---

## ⚕️ Disclaimer

MedMinder is a portfolio project built for educational purposes. It is not a substitute for professional medical advice. Always consult your pharmacist or physician before making changes to your medication regimen.

---

## 👨‍💻 Author

**Mohith** — Final Year CS Student  
[GitHub](https://github.com/mohith292005)
