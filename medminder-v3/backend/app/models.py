from pydantic import BaseModel
from typing import Optional

class MedicationCreate(BaseModel):
    name: str
    dose: str
    freq: str
    times: str = ""
    condition: str = ""
    pills: Optional[int] = None
    color_bg: str = "#e8f1f8"
    color_e: str = "💊"

class MedicationOut(MedicationCreate):
    id: int
    created: str

class DoseToggle(BaseModel):
    med_id: int
    slot: str
    date: str
