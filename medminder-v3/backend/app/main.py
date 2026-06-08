from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import medications, doses, interactions
import os

app = FastAPI(title="MedMinder API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL if set
frontend_url = os.getenv("FRONTEND_URL", "")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(medications.router, prefix="/api/medications", tags=["medications"])
app.include_router(doses.router,       prefix="/api/doses",       tags=["doses"])
app.include_router(interactions.router,prefix="/api/interactions",tags=["interactions"])

@app.get("/")
def root():
    return {"status": "MedMinder API running"}
