import React, { useEffect, useState } from 'react'
import { getMedications } from './api'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Medications from './components/Medications'
import Schedule from './components/Schedule'
import Interactions from './components/Interactions'
import { Toast, Spinner } from './components/UI'
import { useToast } from './hooks/useToast'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast } = useToast()

  const loadMeds = async () => {
    try {
      const data = await getMedications()
      setMeds(data)
    } catch {
      showToast('⚠️ Could not reach backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMeds() }, [])

  const content = () => {
    if (loading) return <Spinner />
    switch (tab) {
      case 'dashboard':    return <Dashboard meds={meds} onToggle={loadMeds} />
      case 'medications':  return <Medications meds={meds} onRefresh={loadMeds} showToast={showToast} />
      case 'schedule':     return <Schedule meds={meds} onToggle={loadMeds} />
      case 'interactions': return <Interactions meds={meds} showToast={showToast} />
      default:             return null
    }
  }

  return (
    <>
      <Navbar active={tab} onChange={setTab} />

      {/* Hero strip */}
      {tab === 'dashboard' && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 2rem 1.5rem' }}>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
            Manage your <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>medications</em> with clarity.
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480 }}>
            Track doses, spot dangerous drug interactions, and never miss a refill — all backed by a real API.
          </p>
        </div>
      )}

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem 4rem' }}>
        {content()}
      </main>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  )
}
