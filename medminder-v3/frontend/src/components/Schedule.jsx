import React, { useEffect, useState } from 'react'
import { getDosesForDate, toggleDose } from '../api'
import { Panel, SectionTitle, Empty } from './UI'

export default function Schedule({ meds, onToggle }) {
  const today = new Date().toISOString().slice(0, 10)
  const [doses, setDoses] = useState([])

  const load = async () => {
    const d = await getDosesForDate(today)
    setDoses(d)
  }

  useEffect(() => { load() }, [meds])

  const isTaken = (medId, slot) => doses.some(d => d.med_id === medId && d.slot === String(slot) && d.taken)

  const handleToggle = async (medId, slot) => {
    await toggleDose(medId, String(slot), today)
    await load(); onToggle()
  }

  // build time → meds map
  const timeMap = {}
  meds.forEach(m => {
    const times = m.times ? m.times.split(',').map(t => t.trim()).filter(Boolean) : []
    if (!times.length) {
      if (!timeMap['Anytime']) timeMap['Anytime'] = []
      timeMap['Anytime'].push({ m, slot: 'all' })
    } else {
      times.forEach((t, i) => {
        if (!timeMap[t]) timeMap[t] = []
        timeMap[t].push({ m, slot: i })
      })
    }
  })
  const sorted = Object.keys(timeMap).sort((a, b) => a === 'Anytime' ? 1 : a.localeCompare(b))

  const dateLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Panel>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.15rem' }}>Today's Schedule</div>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{dateLabel}</span>
      </div>

      {!sorted.length
        ? <Empty icon="🗓️" title="No schedule yet" desc="Add medications with times to see your schedule." />
        : sorted.map(time => (
          <div key={time} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ minWidth: 68, fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 500, paddingTop: 6 }}>{time}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
              {timeMap[time].map(({ m, slot }) => {
                const tk = isTaken(m.id, slot)
                return (
                  <span key={`${m.id}-${slot}`}
                    onClick={() => handleToggle(m.id, slot)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                      background: tk ? 'var(--ok-bg)' : 'var(--accent-light)',
                      border: `1px solid ${tk ? 'var(--ok-border)' : 'var(--accent-border)'}`,
                      color: tk ? 'var(--ok)' : 'var(--accent)',
                      fontSize: '0.8rem', fontWeight: 500,
                      transition: 'all 0.18s',
                    }}>
                    {tk ? '✓ ' : ''}{m.color_e} {m.name} {m.dose}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
    </Panel>
  )
}
