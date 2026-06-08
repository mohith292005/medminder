import psycopg2
import psycopg2.extras
import os

def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"], sslmode="require")
    return conn

def init_db():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS medications (
                id        SERIAL PRIMARY KEY,
                name      TEXT    NOT NULL,
                dose      TEXT    NOT NULL,
                freq      TEXT    NOT NULL,
                times     TEXT    DEFAULT '',
                condition TEXT    DEFAULT '',
                pills     INTEGER,
                color_bg  TEXT    DEFAULT '#e8f1f8',
                color_e   TEXT    DEFAULT '💊',
                created   DATE    DEFAULT CURRENT_DATE
            );

            CREATE TABLE IF NOT EXISTS doses (
                id      SERIAL PRIMARY KEY,
                med_id  INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
                slot    TEXT    NOT NULL,
                date    DATE    NOT NULL,
                taken   BOOLEAN DEFAULT FALSE,
                UNIQUE(med_id, slot, date)
            );
            """)
        conn.commit()
