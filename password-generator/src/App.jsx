import { useState, useEffect, useCallback } from 'react'
import { generatePassword, generatePronounceable, generatePassphrase, calculateStrength } from './utils/generatePassword'

const MAX_HISTORY = 5

function App() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(4)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState('random') // random, pronounceable, passphrase
  const [history, setHistory] = useState([])
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    mustContain: false
  })

  const strength = calculateStrength(password, options, mode)

  const generate = useCallback(() => {
    let newPassword = ''

    if (mode === 'random') {
      newPassword = generatePassword(length, options)
    } else if (mode === 'pronounceable') {
      newPassword = generatePronounceable(length)
    } else if (mode === 'passphrase') {
      newPassword = generatePassphrase(wordCount)
    }

    if (newPassword && password && password !== newPassword) {
      setHistory(prev => {
        const updated = [password, ...prev.filter(p => p !== password)]
        return updated.slice(0, MAX_HISTORY)
      })
    }

    setPassword(newPassword)
    setCopied(false)
  }, [length, wordCount, options, mode, password])

  useEffect(() => {
    generate()
  }, [mode, length, wordCount, options.uppercase, options.lowercase, options.numbers, options.symbols, options.excludeSimilar, options.mustContain])

  const handleCopy = async (text = password) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleOptionChange = (key) => {
    if (key === 'excludeSimilar' || key === 'mustContain') {
      setOptions(prev => ({ ...prev, [key]: !prev[key] }))
      return
    }

    const newOptions = { ...options, [key]: !options[key] }
    const hasAtLeastOne = ['uppercase', 'lowercase', 'numbers', 'symbols'].some(k => newOptions[k])
    if (hasAtLeastOne) {
      setOptions(newOptions)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      generate()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [generate])

  return (
    <div className="page">
      <div className="shell">
        <div className="card">
          <header className="header">
            <h1 className="title">Password Generator</h1>
            <p className="subtitle">Generate secure, random passwords</p>
          </header>

          {/* Mode Selector */}
          <div className="mode-selector">
            {[
              { key: 'random', label: 'Random' },
              { key: 'pronounceable', label: 'Pronounceable' },
              { key: 'passphrase', label: 'Passphrase' }
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`mode-btn ${mode === key ? 'active' : ''}`}
                onClick={() => setMode(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="password-display">
            <span className="password-text">{password || 'Select options'}</span>
          </div>

          <div className="strength-meter">
            <div className="strength-bars">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`strength-bar ${i < strength.score ? 'active' : ''}`}
                  data-level={strength.score}
                />
              ))}
            </div>
            <span className="strength-label">{strength.label}</span>
          </div>

          <div className="options-section">
            {/* Length / Word Count Control */}
            {mode === 'passphrase' ? (
              <div className="length-control">
                <div className="length-header">
                  <label htmlFor="wordCount">Words</label>
                  <span className="length-value">{wordCount}</span>
                </div>
                <input
                  type="range"
                  id="wordCount"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="slider"
                />
              </div>
            ) : (
              <div className="length-control">
                <div className="length-header">
                  <label htmlFor="length">Length</label>
                  <span className="length-value">{length}</span>
                </div>
                <input
                  type="range"
                  id="length"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="slider"
                />
              </div>
            )}

            {/* Character Options - only for random mode */}
            {mode === 'random' && (
              <>
                <div className="checkboxes">
                  {[
                    { key: 'uppercase', label: 'Uppercase', hint: 'A-Z' },
                    { key: 'lowercase', label: 'Lowercase', hint: 'a-z' },
                    { key: 'numbers', label: 'Numbers', hint: '0-9' },
                    { key: 'symbols', label: 'Symbols', hint: '!@#$%' }
                  ].map(({ key, label, hint }) => (
                    <label key={key} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={options[key]}
                        onChange={() => handleOptionChange(key)}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-label">{label}</span>
                      <span className="checkbox-hint">{hint}</span>
                    </label>
                  ))}
                </div>

                <div className="extra-options">
                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={() => handleOptionChange('excludeSimilar')}
                    />
                    <span className="toggle-custom"></span>
                    <div className="toggle-text">
                      <span className="toggle-label">Exclude similar</span>
                      <span className="toggle-hint">0O1lI|</span>
                    </div>
                  </label>

                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={options.mustContain}
                      onChange={() => handleOptionChange('mustContain')}
                    />
                    <span className="toggle-custom"></span>
                    <div className="toggle-text">
                      <span className="toggle-label">Must contain</span>
                      <span className="toggle-hint">At least 1 of each</span>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={generate}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Generate
            </button>
            <button
              className="btn-ghost"
              onClick={() => handleCopy()}
              disabled={!password}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Password History */}
        {history.length > 0 && (
          <div className="history-card">
            <div className="history-header">
              <span className="history-title">Recent</span>
              <button className="history-clear" onClick={() => setHistory([])}>Clear</button>
            </div>
            <div className="history-list">
              {history.map((pwd, index) => (
                <div key={index} className="history-item" onClick={() => handleCopy(pwd)}>
                  <span className="history-password">{pwd}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="footer">
          <a href="https://instagram.com/berkindev" target="_blank" rel="noopener noreferrer">
            Coded by @berkindev
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
