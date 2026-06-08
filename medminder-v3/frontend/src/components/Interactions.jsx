import React, { useState } from 'react'
import { checkInteractions } from '../api'
import { Panel, SectionTitle, Btn, Field, Input } from './UI'

export default function Interactions({ meds, showToast }) {
  const [selected, setSelected] = useState([])
  const [custom, setCustom] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleMed = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleCheck = async () => {
    const names = selected.map(id => meds.find(m => m.id === id)?.name).filter(Boolean)
    if (custom) custom.split(',').map(s => s.trim()).filter(Boolean).forEach(n => names.push(n))
    if (names.length < 2) { showToast('Select at least 2 medications'); return }
    setLoading(true); setResult(null)
    try {
      const r = await checkInteractions(names)
      setResult({ ...r, checkedNames: names })
    } catch {
      showToast('Could not fetch AI analysis — check connection')
    }
    setLoading(false)
  }

  const cls = result ? (result.overall === 'major' ? 'danger' : result.overall === 'moderate' ? 'warn' : 'ok') : ''
  const icon = result ? (result.overall === 'major' ? '🔴' : result.overall === 'moderate' ? '🟡' : '🟢') : ''
  const title = result ? (result.overall === 'major' ? 'Major Interaction Detected' : result.overall === 'moderate' ? 'Moderate Interaction' : result.overall === 'minor' ? 'Minor Interaction' : 'No Significant Interactions') : ''

  const colors = { danger: { bg: 'var(--danger-bg)', border: 'var(--danger-border)', accent: 'var(--danger)' }, warn: { bg: 'var(--warn-bg)', border: 'var(--warn-border)', accent: 'var(--warn)' }, ok: { bg: 'var(--ok-bg)', border: 'var(--ok-border)', accent: 'var(--ok)' } }
  const c = colors[cls] || {}

  return (
    <div>
      {/* Checker box */}
      <div style={{ background: 'linear-gradient(135deg,var(--accent-light),#f0e8f8)', border: '1px solid var(--accent-border)', borderRadius: 'var(--r-lg)', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 20, background: 'var(--accent)', color: '#fff', fontWeight: 500, letterSpacing: '0.05em' }}>AI Powered</span>
          <span style={{ fontFamily: 'var(--ff-display)', fontSize: '1.1rem' }}>Drug Interaction Checker</span>
        </div>
        <p style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: 12 }}>Select medications from your list or type custom drug names to check for interactions.</p>

        {meds.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {meds.map(m => (
              <span key={m.id} onClick={() => toggleMed(m.id)} style={{
                padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.78rem',
                border: `1px solid ${selected.includes(m.id) ? 'var(--accent)' : 'var(--border)'}`,
                background: selected.includes(m.id) ? 'var(--accent)' : 'var(--surface)',
                color: selected.includes(m.id) ? '#fff' : 'var(--muted)',
                transition: 'all 0.18s',
              }}>{m.color_e} {m.name}</span>
            ))}
          </div>
        )}

        <Field label="Or enter drug names manually (comma separated)">
          <Input value={custom} onChange={e => setCustom(e.target.value)} placeholder="e.g. Warfarin, Aspirin, Ibuprofen" />
        </Field>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Btn onClick={handleCheck} disabled={loading}>{loading ? 'Analyzing…' : 'Check Interactions'}</Btn>
          <Btn variant="outline" onClick={() => { setSelected([]); setCustom(''); setResult(null) }}>Clear</Btn>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>🔍 Analyzing interactions...</div>
          <div style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>Consulting AI for drug interaction data…</div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="fade-up" style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--r-lg)', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: '1rem', marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Checked: {result.checkedNames.join(', ')}</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 14 }}>{result.summary}</p>

          {result.pairs?.map((p, i) => {
            const sc = p.severity === 'major' ? 'var(--danger)' : p.severity === 'moderate' ? 'var(--warn)' : 'var(--ok)'
            return (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: '1rem', marginBottom: 8, borderLeft: `3px solid ${sc}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{p.drugs[0]} + {p.drugs[1]}</span>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: sc, letterSpacing: '0.06em', fontWeight: 500 }}>{p.severity}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--text)' }}>Effect:</strong> {p.effect}<br />
                  <strong style={{ color: 'var(--text)' }}>Mechanism:</strong> {p.mechanism}<br />
                  <strong style={{ color: 'var(--text)' }}>Recommendation:</strong> {p.recommendation}
                </div>
              </div>
            )
          })}

          {result.generalTips?.length > 0 && (
            <ul style={{ paddingLeft: '1rem', marginTop: 10 }}>
              {result.generalTips.map((t, i) => <li key={i} style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 4 }}>{t}</li>)}
            </ul>
          )}
          <p style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>⚕️ Always verify with your pharmacist or physician before making changes.</p>
        </div>
      )}

      {/* Guide */}
      <Panel>
        <SectionTitle>Severity Guide</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[
            { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger-border)', icon: '🔴', label: 'Major', desc: 'Potentially life-threatening. Avoid the combination.' },
            { color: 'var(--warn)', bg: 'var(--warn-bg)', border: 'var(--warn-border)', icon: '🟡', label: 'Moderate', desc: 'Monitor closely. May need dose adjustment.' },
            { color: 'var(--ok)', bg: 'var(--ok-bg)', border: 'var(--ok-border)', icon: '🟢', label: 'Minor / None', desc: 'Generally safe. Always consult your doctor.' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1rem', borderRadius: 'var(--r)', background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontWeight: 500, fontSize: '0.85rem', color: s.color, marginBottom: 4 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
          ⚕️ <strong>Disclaimer:</strong> This tool is for informational purposes only and does not replace professional medical advice. Always consult your pharmacist or physician.
        </p>
      </Panel>
    </div>
  )
}
