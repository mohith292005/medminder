const BASE = import.meta.env.VITE_API_URL || ''

// ── Medications ──
export const getMedications = () =>
  fetch(`${BASE}/api/medications/`).then(r => r.json())

export const createMedication = (data) =>
  fetch(`${BASE}/api/medications/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const updateMedication = (id, data) =>
  fetch(`${BASE}/api/medications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const deleteMedication = (id) =>
  fetch(`${BASE}/api/medications/${id}`, { method: 'DELETE' })

// ── Doses ──
export const getDosesForDate = (date) =>
  fetch(`${BASE}/api/doses/${date}`).then(r => r.json())

export const toggleDose = (med_id, slot, date) =>
  fetch(`${BASE}/api/doses/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ med_id, slot, date }),
  }).then(r => r.json())

export const getStreak = () =>
  fetch(`${BASE}/api/doses/streak/last7`).then(r => r.json())

// ── AI Interaction check (goes through backend) ──
export const checkInteractions = async (drugNames) => {
  const res = await fetch(`${BASE}/api/interactions/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drugs: drugNames }),
  })
  if (!res.ok) throw new Error('Backend interaction check failed')
  return res.json()
}
