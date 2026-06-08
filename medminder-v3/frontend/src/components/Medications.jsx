import React, { useState } from 'react'
import { createMedication, deleteMedication, updateMedication } from '../api'
import { Panel, SectionTitle, Btn, Field, Input, Select, Empty } from './UI'

const FREQS = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Weekly', 'As needed']

const blank = { name: '', dose: '', freq: 'Once daily', times: '', condition: '', pills: '' }

export default function Medications({ meds, onRefresh, showToast }) {
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.dose.trim()) { showToast('Enter name and dosage'); return }
    setSaving(true)
    const payload = { ...form, pills: form.pills !== '' ? parseInt(form.pills) : null }
    if (editId) {
      await updateMedication(editId, payload)
      showToast('✓ Updated')
    } else {
      await createMedication(payload)
      showToast('✓ ' + form.name + ' added')
    }
    setForm(blank); setEditId(null); setSaving(false); onRefresh()
  }

  const handleEdit = (m) => {
    setForm({ name: m.name, dose: m.dose, freq: m.freq, times: m.times || '', condition: m.condition || '', pills: m.pills ?? '' })
    setEditId(m.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    await deleteMedication(id); showToast('Removed'); onRefresh()
  }

  const handleCancel = () => { setForm(blank); setEditId(null) }

  return (
    <div>
      <Panel>
        <SectionTitle sub={editId ? 'Editing medication' : 'All data saved to backend'}>
          {editId ? 'Edit Medication' : 'Add Medication'}
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <Field label="Medication Name">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Metformin" />
          </Field>
          <Field label="Dosage">
            <Input value={form.dose} onChange={e => set('dose', e.target.value)} placeholder="e.g. 500mg" />
          </Field>
          <Field label="Frequency">
            <Select value={form.freq} onChange={e => set('freq', e.target.value)}>
              {FREQS.map(f => <option key={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Times (comma separated)">
            <Input value={form.times} onChange={e => set('times', e.target.value)} placeholder="e.g. 08:00, 20:00" />
          </Field>
          <Field label="Condition / Purpose">
            <Input value={form.condition} onChange={e => set('condition', e.target.value)} placeholder="e.g. Type 2 Diabetes" />
          </Field>
          <Field label="Pills remaining">
            <Input type="number" value={form.pills} onChange={e => set('pills', e.target.value)} placeholder="e.g. 30" min={0} />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {editId && <Btn variant="outline" onClick={handleCancel}>Cancel</Btn>}
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editId ? 'Save Changes' : '+ Add Medication'}</Btn>
        </div>
      </Panel>

      <Panel>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.15rem' }}>My Medications</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{meds.length} medication{meds.length !== 1 ? 's' : ''}</span>
        </div>
        {!meds.length
          ? <Empty icon="🌿" title="No medications added" desc="Add your first medication above." />
          : meds.map(m => <MedCard key={m.id} m={m} onEdit={handleEdit} onDelete={handleDelete} />)}
      </Panel>
    </div>
  )
}

function MedCard({ m, onEdit, onDelete }) {
  const refillSoon = m.pills !== null && m.pills <= 7
  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '12px 14px',
      border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
      background: 'var(--surface)', boxShadow: 'var(--shadow)',
      marginBottom: 10, transition: 'border-color 0.18s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: m.color_bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
        {m.color_e}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.92rem', marginBottom: 2 }}>
          {m.name} <span style={{ fontWeight: 300, color: 'var(--muted)', fontSize: '0.82rem' }}>{m.dose}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>📅 {m.freq}</span>
          {m.times && <span>⏰ {m.times}</span>}
          {m.condition && <span>🏷 {m.condition}</span>}
          {m.pills !== null && <span>💊 {m.pills} left</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {refillSoon && (
          <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 20, background: 'var(--warn-bg)', color: 'var(--warn)', border: '1px solid var(--warn-border)' }}>
            Refill soon
          </span>
        )}
        <Btn variant="outline" sm onClick={() => onEdit(m)}>Edit</Btn>
        <Btn variant="danger" sm onClick={() => onDelete(m.id)}>✕</Btn>
      </div>
    </div>
  )
}
