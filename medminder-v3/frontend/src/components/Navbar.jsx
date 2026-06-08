import React, { useEffect, useState } from 'react'

const tabs = ['Dashboard', 'Medications', 'Schedule', 'Interactions']

export default function Navbar({ active, onChange }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: 60,
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(247,244,239,0.94)' : 'var(--bg)',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'all 0.25s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>💊</div>
        <span style={{ fontFamily: 'var(--ff-display)', fontSize: '1.1rem' }}>MedMinder</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => onChange(t.toLowerCase())} style={{
            padding: '6px 14px', borderRadius: 6,
            fontSize: '0.8rem',
            background: active === t.toLowerCase() ? 'var(--surface)' : 'transparent',
            color: active === t.toLowerCase() ? 'var(--text)' : 'var(--muted)',
            fontWeight: active === t.toLowerCase() ? 500 : 400,
            boxShadow: active === t.toLowerCase() ? 'var(--shadow)' : 'none',
            transition: 'all 0.18s',
          }}>{t}</button>
        ))}
      </div>
    </nav>
  )
}
