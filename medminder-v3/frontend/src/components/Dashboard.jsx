import React, { useEffect, useState } from 'react'
import { getDosesForDate, toggleDose, getStreak } from '../api'
import { Panel, SectionTitle, Btn, Empty, Spinner } from './UI'

function ProgressRing({ taken, total }) {
  const r = 28, circ = 2 * Math.PI * r
  const pct = total ? taken / total : 0
  return (
    <svg width={70} height={70} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={35} cy={35} r={r} fill="none" stroke="var(--surface2)" strokeWidth={6} />
      <circle cx={35} cy={35} r={r} fill="none" stroke="var(--ok)" strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

function StreakBar({ dates }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {days.map(d => {
        const done = dates.includes(d)
        const isToday = d === today
        return (
          <div key={d} style={{
            width: 28, height: 28, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.62rem', fontWeight: 500,
            background: done ? 'var(--ok)' : 'var(--surface2)',
            border: `1px solid ${done ? 'var(--ok)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
            color: done ? '#fff' : isToday ? 'var(--accent)' : 'var(--muted)',
          }}>
            {new Date(d + 'T12:00').toLocaleDateString('en', { weekday: 'narrow' })}
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard({ meds, onToggle }) {
  const today = new Date().toISOString().slice(0, 10)
  const [doses, setDoses] = useState([])
  const [streakDates, setStreakDates] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [d, s] = await Promise.all([getDosesForDate(today), getStreak()])
    setDoses(d)
    setStreakDates(s.dates || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [meds])

  const isTaken = (medId, slot) => doses.some(d => d.med_id === medId && d.slot === slot && d.taken)

  const totalDoses = meds.reduce((acc, m) => acc + (m.times ? m.times.split(',').filter(Boolean).length || 1 : 1), 0)
  const takenCount = doses.filter(d => d.taken).length

  const handleToggle = async (medId, slot) => {
    await toggleDose(medId, slot, today)
    await load()
    onToggle()
  }

  // upcoming: meds whose doses aren't all taken yet
  const upcoming = []
  meds.forEach(m => {
    const times = m.times ? m.times.split(',').map(t => t.trim()).filter(Boolean) : []
    if (!times.length) {
      if (!isTaken(m.id, 'all')) upcoming.push({ m, slot: 'all', time: 'Anytime' })
    } else {
      times.forEach((t, i) => {
        if (!isTaken(m.id, String(i))) upcoming.push({ m, slot: String(i), time: t })
      })
    }
  })
  upcoming.sort((a, b) => (a.time === 'Anytime' ? 1 : a.time.localeCompare(b.time)))

  const refills = meds.filter(m => m.pills !== null && m.pills <= 7)

  const dateLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) return <Spinner />

  return (
    <div>
      {/* Hero stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.25rem' }}>
        {[
          { num: meds.length, label: 'Medications' },
          { num: totalDoses, label: 'Doses today' },
          { num: takenCount, label: 'Taken today' },
          { num: streakDates.length, label: 'Day streak' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '1.1rem 1.25rem',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--accent)', lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Panel>
        <SectionTitle sub={dateLabel}>Today's Progress</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <ProgressRing taken={takenCount} total={totalDoses} />
          <div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 300 }}>
              {takenCount} / {totalDoses} doses taken
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
              {totalDoses === 0 ? 'Add medications to get started' : takenCount === totalDoses ? '🎉 All done for today!' : `${totalDoses - takenCount} remaining`}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Last 7 days</div>
        <StreakBar dates={streakDates} />
      </Panel>

      <Panel>
        <SectionTitle>Upcoming doses</SectionTitle>
        {!upcoming.length
          ? <Empty icon="🎉" title="All done!" desc="You've taken all your doses for today." />
          : upcoming.slice(0, 5).map(({ m, slot, time }) => (
            <MedRow key={`${m.id}-${slot}`} m={m} time={time} taken={isTaken(m.id, slot)}
              onToggle={() => handleToggle(m.id, slot)} />
          ))}
      </Panel>

      {refills.length > 0 && (
        <Panel style={{ borderColor: 'var(--warn-border)', background: 'var(--warn-bg)' }}>
          <SectionTitle>⚠️ Refill Reminders</SectionTitle>
          {refills.map(m => (
            <div key={m.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--warn-border)', fontSize: '0.88rem',
            }}>
              <span>{m.color_e} <strong>{m.name}</strong> — {m.pills} pill{m.pills !== 1 ? 's' : ''} left</span>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 20, background: 'var(--warn-bg)', color: 'var(--warn)', border: '1px solid var(--warn-border)' }}>
                Refill soon
              </span>
            </div>
          ))}
        </Panel>
      )}
    </div>
  )
}

function MedRow({ m, time, taken, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color_bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
        {m.color_e}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{m.name} <span style={{ fontWeight: 300, color: 'var(--muted)', fontSize: '0.82rem' }}>{m.dose}</span></div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>⏰ {time}{m.condition ? ` · ${m.condition}` : ''}</div>
      </div>
      <button onClick={onToggle} style={{
        padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
        border: `1px solid ${taken ? 'var(--ok)' : 'var(--ok-border)'}`,
        background: taken ? 'var(--ok)' : 'var(--ok-bg)',
        color: taken ? '#fff' : 'var(--ok)',
        cursor: 'pointer', transition: 'all 0.18s',
      }}>{taken ? '✓ Taken' : 'Mark taken'}</button>
    </div>
  )
}
