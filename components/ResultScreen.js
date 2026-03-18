'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './ResultScreen.module.css'

const BPAT = {
  box:  [
    { ph:'Inhale', d:4, ico:'🫁', sc:1.18 },
    { ph:'Hold',   d:4, ico:'⏸', sc:1.18 },
    { ph:'Exhale', d:4, ico:'💨', sc:1    },
    { ph:'Hold',   d:4, ico:'⏸', sc:1    },
  ],
  '478':[
    { ph:'Inhale', d:4, ico:'🫁', sc:1.18 },
    { ph:'Hold',   d:7, ico:'⏸', sc:1.18 },
    { ph:'Exhale', d:8, ico:'💨', sc:1    },
  ],
}

const COLORS = { low:'#00E5A0', moderate:'#FFB830', high:'#FF4D6D' }
const FILLS  = {
  low:      'linear-gradient(90deg,#00E5A0,#00C880)',
  moderate: 'linear-gradient(90deg,#FFB830,#E09010)',
  high:     'linear-gradient(90deg,#FF4D6D,#E02040)',
}

export default function ResultScreen({ userText, result, onBack }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [scaleWidth,   setScaleWidth]   = useState(0)
  const [bPhase,       setBPhase]       = useState('Select a technique →')
  const [bSec,         setBSec]         = useState('Reduces cortisol in 3–5 minutes')
  const [bInner,       setBInner]       = useState('🫁')
  const [bScale,       setBScale]       = useState(1)
  const [bProgress,    setBProgress]    = useState(0)  // 0-260 dashoffset fill
  const [bType,        setBType]        = useState(null)
  const [activeBBtn,   setActiveBBtn]   = useState(null)

  const bTick  = useRef(null)
  const bStep  = useRef(0)
  const bCyc   = useRef(0)

  const level = (result.level || 'moderate').toLowerCase()
  const score = Math.min(Math.max(parseInt(result.score) || 50, 0), 100)
  const color = COLORS[level]

  // animate score number + scale bar
  useEffect(() => {
    const dur = 1300, start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayScore(Math.round(score * eased))
      setScaleWidth(score * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    const t = setTimeout(() => requestAnimationFrame(tick), 100)
    return () => clearTimeout(t)
  }, [score])

  // breathing
  function startB(type) {
    stopB()
    setBType(type)
    setActiveBBtn(type)
    bStep.current = 0; bCyc.current = 0
    runBStep(type, 0)
  }

  function runBStep(type, step) {
    const pat  = BPAT[type]
    const s    = pat[step % pat.length]
    let elapsed = 0
    setBPhase(s.ph); setBInner(s.ico); setBScale(s.sc)
    setBProgress(0)

    bTick.current = setInterval(() => {
      elapsed++
      const left = s.d - elapsed
      setBSec(`${left}s remaining  ·  Cycle ${bCyc.current + 1}`)
      setBProgress(Math.round((elapsed / s.d) * 260))
      if (elapsed >= s.d) {
        clearInterval(bTick.current)
        const nextStep = step + 1
        if (nextStep % BPAT[type].length === 0) bCyc.current++
        setTimeout(() => runBStep(type, nextStep), 250)
      }
    }, 1000)
  }

  function stopB() {
    clearInterval(bTick.current)
    setBPhase('Select a technique →'); setBSec('Reduces cortisol in 3–5 minutes')
    setBInner('🫁'); setBScale(1); setBProgress(0)
    setBType(null); setActiveBBtn(null)
  }

  // cleanup on unmount
  useEffect(() => () => clearInterval(bTick.current), [])

  return (
    <main className={styles.wrap}>
      <button className={styles.backBtn} onClick={() => { stopB(); onBack() }}>← Check again</button>

      {/* You said */}
      <div className={styles.card} style={{ animationDelay: '0s' }}>
        <div className={styles.youLabel}>You said</div>
        <div className={styles.youText}>"{userText}"</div>
      </div>

      {/* Stress card */}
      <div className={styles.card} style={{ animationDelay: '.06s' }}>
        <div className={styles.stressHead}>
          <div className={styles.stressTitle}>Stress Analysis</div>
          <div className={`${styles.badge} ${styles[level]}`}>{result.level_label}</div>
        </div>
        <div className={styles.stressBody}>
          <div className={styles.scoreRow}>
            <div className={styles.scoreBig} style={{ color }}>{displayScore}</div>
            <div className={styles.scoreUnit}>/ 100</div>
            <div className={styles.scoreDesc}>{result.score_desc}</div>
          </div>

          <div className={styles.scaleLabels}>
            <span>Calm</span><span>Moderate</span><span>High Stress</span>
          </div>
          <div className={styles.scaleTrack}>
            <div className={styles.scaleGrad} />
            <div className={styles.scaleFill} style={{ width: scaleWidth + '%', background: FILLS[level], boxShadow: `0 0 12px ${color}80` }} />
            <div className={styles.scaleThumb} style={{ left: scaleWidth + '%', background: color, boxShadow: `0 0 10px ${color}80` }} />
          </div>
          <div className={styles.scaleTicks}>
            <span>0–30</span><span>31–65</span><span>66–100</span>
          </div>

          <div className={styles.iblock}>
            <div className={styles.ilabel}>AI Insight</div>
            <div className={styles.itext}>{result.insight}</div>
          </div>

          {result.main_stressor && (
            <div className={styles.iblock}>
              <div className={`${styles.ilabel} ${styles.ilabelAmber}`}>Main Stressor Detected</div>
              <div className={styles.itext}>{result.main_stressor}</div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className={styles.card} style={{ animationDelay: '.12s' }}>
        <div className={styles.sugTitle}>Recommended for you</div>
        <div className={styles.sugGrid}>
          {(result.suggestions || []).slice(0, 4).map((s, i) => (
            <div key={i} className={styles.sugItem}>
              <div className={styles.sugIco}>{s.icon}</div>
              <div>
                <div className={styles.sugName}>{s.name}</div>
                <div className={styles.sugDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breathing */}
      <div className={styles.breathCard} style={{ animationDelay: '.18s' }}>
        <div className={styles.breathTitle}>Try This Now — Breathing Exercise</div>
        <div className={styles.bflex}>
          <div className={styles.bringWrap}>
            <svg viewBox="0 0 110 110" width="110" height="110">
              <circle className={styles.brBg} cx="55" cy="55" r="41"
                fill="none" stroke="var(--bg3)" strokeWidth="7"
                strokeDasharray="260" transform="rotate(-90 55 55)" />
              <circle className={styles.brProg} cx="55" cy="55" r="41"
                fill="none" stroke="var(--cyan)" strokeWidth="7"
                strokeLinecap="round" strokeDasharray="260"
                strokeDashoffset={260 - bProgress}
                transform="rotate(-90 55 55)"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,.4))', transition: 'stroke-dashoffset .9s linear' }}
              />
            </svg>
            <div className={styles.brInner} style={{ transform: `scale(${bScale})` }}>{bInner}</div>
          </div>
          <div className={styles.binfo}>
            <h3 className={styles.bh3}>Guided Breathing</h3>
            <div className={styles.bphase}>{bPhase}</div>
            <div className={styles.bsec}>{bSec}</div>
            <div className={styles.bbtns}>
              <button className={`${styles.bb} ${activeBBtn === 'box' ? styles.on : ''}`} onClick={() => startB('box')}>Box 4-4-4</button>
              <button className={`${styles.bb} ${activeBBtn === '478' ? styles.on : ''}`} onClick={() => startB('478')}>4-7-8</button>
              <button className={styles.bb} onClick={stopB}>■ Stop</button>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.retryBtn} onClick={() => { stopB(); onBack() }}>↩ Analyze again</button>
    </main>
  )
}
