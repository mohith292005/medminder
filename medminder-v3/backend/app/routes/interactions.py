from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import urllib.request
import json
import os

router = APIRouter()

class InteractionRequest(BaseModel):
    drugs: List[str]

@router.post("/check")
def check_interactions(payload: InteractionRequest):
    if len(payload.drugs) < 2:
        raise HTTPException(400, "Provide at least 2 drug names")

    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        raise HTTPException(500, "OPENROUTER_API_KEY not set on server")

    prompt = f"""You are a clinical pharmacist AI. Analyze drug interactions between: {', '.join(payload.drugs)}.
Return ONLY a JSON object (no markdown, no extra text):
{{
  "overall": "major" | "moderate" | "minor" | "none",
  "summary": "1-2 sentence plain-English summary",
  "pairs": [
    {{
      "drugs": ["Drug A", "Drug B"],
      "severity": "major" | "moderate" | "minor" | "none",
      "mechanism": "brief mechanism",
      "effect": "what happens clinically",
      "recommendation": "what to do"
    }}
  ],
  "generalTips": ["tip1", "tip2"]
}}
Be medically accurate. If no interactions exist, say so clearly."""

    body = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}]
    }).encode()

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://medminder.vercel.app",
            "X-Title": "MedMinder",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        raw = data["choices"][0]["message"]["content"]
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception as e:
        raise HTTPException(502, f"AI request failed: {str(e)}")
