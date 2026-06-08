import React from 'react'

export function Panel({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '1.75rem',
      boxShadow: 'var(--shadow)',
      marginBottom: '1.25rem',
      ...style,
    }}>{children}</div>
  )
}

export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.15rem', fontWeight: 400 }}>{children}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export function Btn({ children, variant = 'primary', sm, onClick, disabled, style = {} }) {
  const base = {
    padding: sm ? '6px 12px' : '9px 18px',
    borderRadius: 'var(--r)',
    fontSize: sm ? '0.78rem' : '0.85rem',
    fontWeight: 500,
    transition: 'all 0.18s',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none' },
    outline: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' },
    danger:  { background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)' },
    ok:      { background: 'var(--ok-bg)', border: '1px solid var(--ok-border)', color: 'var(--ok)' },
  }
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>
}

export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props) {
  return (
    <input {...props} style={{
      padding: '9px 12px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontSize: '0.88rem',
      transition: 'border-color 0.18s, box-shadow 0.18s',
      width: '100%',
      ...props.style,
    }} onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-light)' }}
       onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }} />
  )
}

export function Select({ children, ...props }) {
  return (
    <select {...props} style={{
      padding: '9px 12px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontSize: '0.88rem',
      width: '100%',
      ...props.style,
    }}>{children}</select>
  )
}

export function Empty({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', color: 'var(--text)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: '0.82rem', maxWidth: 280, margin: '0 auto' }}>{desc}</div>
    </div>
  )
}

export function Toast({ msg, show }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: 'var(--text)', color: '#fff',
      padding: '10px 18px', borderRadius: 'var(--r)',
      fontSize: '0.82rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      transform: show ? 'translateY(0)' : 'translateY(60px)',
      opacity: show ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
      pointerEvents: 'none',
    }}>{msg}</div>
  )
}

export function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
      Loading...
    </div>
  )
}
