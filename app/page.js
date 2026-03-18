'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'
import ResultScreen from '../components/ResultScreen'
import HistoryPanel from '../components/HistoryPanel'

const CHIPS = [
  { label: '😰 Exam stress',         text: "I have exams coming up and I'm really stressed. Can't focus, feeling panicked." },
  { label: '😔 Feeling low',          text: "I've been feeling really low and unmotivated lately. Nothing excites me." },
  { label: '😤 Overwhelmed',          text: "I have so much work piled up with deadlines everywhere. I feel completely overwhelmed." },
  { label: '😴 Can\'t sleep',         text: "I haven't been sleeping well. Tired all day but can't sleep at night." },
  { label: '😟 Anxious about future', text: "I'm really anxious about my future and career. It's keeping me up at night." },
  { label: '😌 Doing okay',           text: "I'm actually doing okay today. Things feel manageable, just a little tired." },
]

const LOADING_WORDS = [
  'Analyzing your feelings…',
  'Detecting stress patterns…',
  'Measuring emotional signals…',
  'Generating your report…',
]

export default function Home() {
  const [screen, setScreen]       = useState('landing') // landing | loading | result
  const [inputVal, setInputVal]   = useState('')
  const [loadWord, setLoadWord]   = useState(LOADING_WORDS[0])
  const [loadPct, setLoadPct]     = useState(0)
  const [result, setResult]       = useState(null)
  const [userText, setUserText]   = useState('')
  const [error, setError]         = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory]     = useState([])

  const taRef     = useRef(null)
  const wordTimer = useRef(null)
  const barTimer  = useRef(null)

  // auto-resize textarea
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 180) + 'px'
    }
  }, [inputVal])

  function startLoading() {
    setLoadPct(0)
    setLoadWord(LOADING_WORDS[0])
    let wi = 0, pct = 0
    wordTimer.current = setInterval(() => {
      wi = (wi + 1) % LOADING_WORDS.length
      setLoadWord(LOADING_WORDS[wi])
    }, 1100)
    barTimer.current = setInterval(() => {
      pct = Math.min(pct + Math.random() * 7 + 1, 88)
      setLoadPct(pct)
    }, 220)
  }
  function stopLoading() {
    clearInterval(wordTimer.current)
    clearInterval(barTimer.current)
    setLoadPct(100)
  }

  async function doAnalyze() {
    const text = inputVal.trim()
    if (!text) { taRef.current?.focus(); return }

    setUserText(text)
    setScreen('loading')
    startLoading()
    setError('')

    try {
      const res  = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'API error')

      // save to history (fire and forget)
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_text:    text,
          score:        data.result.score,
          level:        data.result.level,
          level_label:  data.result.level_label,
          insight:      data.result.insight,
          main_stressor: data.result.main_stressor,
        }),
      }).catch(() => {}) // silently ignore history save errors

      stopLoading()
      await new Promise(r => setTimeout(r, 350))
      setResult(data.result)
      setScreen('result')
      window.scrollTo(0, 0)
    } catch (err) {
      stopLoading()
      setScreen('landing')
      setError(err.message || 'Something went wrong. Please try again.')
      setTimeout(() => setError(''), 5000)
    }
  }

  function goBack() {
    setScreen('landing')
    setResult(null)
    setInputVal('')
    window.scrollTo(0, 0)
  }

  async function fetchHistory() {
    try {
      const res  = await fetch('/api/history')
      const data = await res.json()
      setHistory(data.history || [])
    } catch {
      setHistory([])
    }
    setShowHistory(true)
  }

  return (
    <>
      {/* ── LANDING ── */}
      {screen === 'landing' && (
        <main className={styles.landing}>
          <div className={styles.brand}>
            <div className={styles.bdot} />
            <span className={styles.bname}>MINDEASE</span>
            <button className={styles.histBtn} onClick={fetchHistory}>📋 History</button>
          </div>

          <h1 className={styles.headline}>
            How are you feeling<br /><em>right now?</em>
          </h1>
          <p className={styles.subline}>
            Share what's on your mind — I'll measure your stress level and suggest ways to feel better.
          </p>

          <div className={styles.searchShell}>
            <div className={styles.searchBox}>
              <textarea
                ref={taRef}
                className={styles.feelInput}
                rows={1}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doAnalyze() } }}
                placeholder="e.g. I have exams tomorrow, couldn't sleep, feeling really overwhelmed…"
                maxLength={800}
              />
              <button className={styles.goBtn} onClick={doAnalyze}>→</button>
            </div>
            <div className={styles.hint}>Press Enter to analyze &nbsp;·&nbsp; Be honest, this is private 🔒</div>
          </div>

          <div className={styles.chips}>
            {CHIPS.map((c, i) => (
              <span key={i} className={styles.chip} onClick={() => setInputVal(c.text)}>
                {c.label}
              </span>
            ))}
          </div>

          {error && <div className={styles.errToast}>{error}</div>}
        </main>
      )}

      {/* ── LOADING ── */}
      {screen === 'loading' && (
        <div className={styles.loadScreen}>
          <div className={styles.orb}><div className={styles.orbIn} /></div>
          <div className={styles.lword}>{loadWord}</div>
          <div className={styles.lbarWrap}>
            <div className={styles.lbar} style={{ width: loadPct + '%' }} />
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {screen === 'result' && result && (
        <ResultScreen
          userText={userText}
          result={result}
          onBack={goBack}
        />
      )}

      {/* ── HISTORY PANEL ── */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
