'use client'
import styles from './HistoryPanel.module.css'

const LEVEL_COLOR = { low: '#00E5A0', moderate: '#FFB830', high: '#FF4D6D' }
const LEVEL_ICON  = { low: '😌', moderate: '😐', high: '😰' }

export default function HistoryPanel({ history, onClose }) {
  function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' }) +
           ' · ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.panelHead}>
          <div className={styles.panelTitle}>📋 Stress History</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {history.length === 0 ? (
          <div className={styles.empty}>No history yet — analyze your first feeling!</div>
        ) : (
          <div className={styles.list}>
            {history.map((h, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.entryTop}>
                  <span className={styles.entryIcon}>{LEVEL_ICON[h.level] || '😐'}</span>
                  <div style={{ flex: 1 }}>
                    <div className={styles.entryLabel} style={{ color: LEVEL_COLOR[h.level] }}>
                      {h.level_label} — {h.score}/100
                    </div>
                    <div className={styles.entryDate}>{formatDate(h.created_at)}</div>
                  </div>
                  <div className={styles.scoreBar}>
                    <div className={styles.scoreBarFill}
                      style={{ width: h.score + '%', background: LEVEL_COLOR[h.level] }} />
                  </div>
                </div>
                <div className={styles.entryText}>"{h.user_text}"</div>
                {h.main_stressor && (
                  <div className={styles.entryStressor}>⚡ {h.main_stressor}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
