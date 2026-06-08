from fastapi import APIRouter
from app.database import get_conn
from app.models import DoseToggle
import psycopg2.extras

router = APIRouter()

@router.get("/{date}")
def get_doses_for_date(date: str):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM doses WHERE date=%s", (date,))
            return [dict(r) for r in cur.fetchall()]

@router.post("/toggle")
def toggle_dose(payload: DoseToggle):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT * FROM doses WHERE med_id=%s AND slot=%s AND date=%s",
                (payload.med_id, payload.slot, payload.date)
            )
            existing = cur.fetchone()

            if existing:
                new_val = not existing["taken"]
                cur.execute("UPDATE doses SET taken=%s WHERE id=%s", (new_val, existing["id"]))
                taken = new_val
            else:
                cur.execute(
                    "INSERT INTO doses (med_id, slot, date, taken) VALUES (%s,%s,%s,%s)",
                    (payload.med_id, payload.slot, payload.date, True)
                )
                taken = True

            if taken:
                cur.execute(
                    "UPDATE medications SET pills = GREATEST(0, pills - 1) WHERE id=%s AND pills IS NOT NULL",
                    (payload.med_id,)
                )

            conn.commit()
            return {"med_id": payload.med_id, "slot": payload.slot, "date": payload.date, "taken": taken}

@router.get("/streak/last7")
def get_streak():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT DISTINCT date::text FROM doses
                   WHERE taken=TRUE AND date >= CURRENT_DATE - INTERVAL '6 days'
                   ORDER BY date"""
            )
            return {"dates": [r[0] for r in cur.fetchall()]}
