from fastapi import APIRouter, HTTPException
from app.database import get_conn
from app.models import MedicationCreate, MedicationOut
from typing import List
import psycopg2.extras

router = APIRouter()

COLORS = [
    {"bg": "#e8f1f8", "e": "💊"}, {"bg": "#eef7f2", "e": "🌿"},
    {"bg": "#fef8f0", "e": "⭐"}, {"bg": "#fdf0ee", "e": "❤️"},
    {"bg": "#f0e8f8", "e": "🔵"}, {"bg": "#f5f5dc", "e": "🟡"},
]

def row_to_dict(row):
    d = dict(row)
    if "created" in d and d["created"]:
        d["created"] = str(d["created"])
    return d

@router.get("/", response_model=List[MedicationOut])
def list_medications():
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM medications ORDER BY id")
            return [row_to_dict(r) for r in cur.fetchall()]

@router.post("/", response_model=MedicationOut, status_code=201)
def create_medication(med: MedicationCreate):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT COUNT(*) as c FROM medications")
            count = cur.fetchone()["c"]
            color = COLORS[count % len(COLORS)]
            cur.execute(
                """INSERT INTO medications (name, dose, freq, times, condition, pills, color_bg, color_e)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""",
                (med.name, med.dose, med.freq, med.times, med.condition,
                 med.pills, med.color_bg or color["bg"], med.color_e or color["e"])
            )
            conn.commit()
            return row_to_dict(cur.fetchone())

@router.put("/{med_id}", response_model=MedicationOut)
def update_medication(med_id: int, med: MedicationCreate):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """UPDATE medications SET name=%s,dose=%s,freq=%s,times=%s,condition=%s,pills=%s
                   WHERE id=%s RETURNING *""",
                (med.name, med.dose, med.freq, med.times, med.condition, med.pills, med_id)
            )
            conn.commit()
            row = cur.fetchone()
            if not row:
                raise HTTPException(404, "Medication not found")
            return row_to_dict(row)

@router.delete("/{med_id}", status_code=204)
def delete_medication(med_id: int):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM medications WHERE id=%s", (med_id,))
            conn.commit()
