import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  getAllHarmonies,
  getContrastColor,
  formatHsl,
  formatRgb,
  hexToHsl,
  hslToHex,
  getContrastRatio,
  getWcagRating,
  simulateColorBlindness,
  getColorName,
  generateCssVariables
} from './utils/colorUtils'

const DEFAULT_COLOR = '#6366f1'

const HARMONY_INFO = {
  complementary: {
    title: 'Complementary',
    desc: '180° opposite'
  },
  analogous: {
    title: 'Analogous',
    desc: '±30° adjacent'
  },
  triadic: {
    title: 'Triadic',
    desc: '120° spacing'
  },
  splitComplementary: {
    title: 'Split Complementary',
    desc: '150° & 210°'
  },
  square: {
    title: 'Square',
    desc: '90° spacing'
  },
  tetradic: {
    title: 'Tetradic',
    desc: 'Double complement'
  },
  monochromatic: {
    title: 'Monochromatic',
    desc: 'Light/dark variants'
  }
}

// Grid layout: 3-2-2
const HARMONY_ROWS = [
  ['complementary', 'analogous', 'triadic'],
  ['splitComplementary', 'square'],
  ['tetradic', 'monochromatic']
]

// Icons
const EyedropperIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 22 1-1h3l9-9"/>
    <path d="M3 21v-3l9-9"/>
    <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>
  </svg>
)

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
)

const RandomIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="12" height="12" x="2" y="10" rx="2" ry="2"/>
    <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/>
    <path d="M6 18h.01"/>
    <path d="M10 14h.01"/>
    <path d="M15 6h.01"/>
    <path d="M18 9h.01"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// Color Wheel Component
function ColorWheel({ color, onChange, size = 200 }) {
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const hsl = hexToHsl(color)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 8

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180
      const endAngle = (angle + 1) * Math.PI / 180

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, `hsl(${angle}, 10%, 100%)`)
      gradient.addColorStop(0.5, `hsl(${angle}, 100%, 50%)`)
      gradient.addColorStop(1, `hsl(${angle}, 100%, 25%)`)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw center hole
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2)
    ctx.fillStyle = '#141821'
    ctx.fill()

    // Draw current color indicator
    if (hsl) {
      const indicatorAngle = (hsl.h - 90) * Math.PI / 180
      const indicatorRadius = radius * (0.25 + (1 - hsl.l / 100) * 0.75)
      const indicatorX = centerX + Math.cos(indicatorAngle) * indicatorRadius
      const indicatorY = centerY + Math.sin(indicatorAngle) * indicatorRadius

      // Outer ring
      ctx.beginPath()
      ctx.arc(indicatorX, indicatorY, 10, 0, Math.PI * 2)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.stroke()

      // Inner fill
      ctx.beginPath()
      ctx.arc(indicatorX, indicatorY, 7, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
  }, [color, size, hsl])

  const handleInteraction = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 8

    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Check if within wheel bounds
    if (distance > radius || distance < radius * 0.25) return

    // Calculate hue from angle
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
    if (angle < 0) angle += 360

    // Calculate lightness from distance
    const normalizedDist = (distance - radius * 0.25) / (radius * 0.75)
    const lightness = Math.round((1 - normalizedDist) * 100)

    const newColor = hslToHex(Math.round(angle), hsl?.s || 80, Math.max(20, Math.min(80, lightness)))
    onChange(newColor)
  }, [size, hsl, onChange])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleInteraction(e)
  }

  const handleMouseMove = (e) => {
    if (isDragging) handleInteraction(e)
  }

  const handleMouseUp = () => setIsDragging(false)

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove)
      window.addEventListener('touchend', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleMouseMove)
        window.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="colorWheel"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ cursor: 'crosshair' }}
    />
  )
}

function ColorSwatch({ color, onCopy, copiedId, swatchId }) {
  const contrast = getContrastColor(color.hex)
  const isCopied = copiedId === swatchId

  const handleClick = () => {
    navigator.clipboard.writeText(color.hex.toUpperCase())
    onCopy(swatchId)
  }

  return (
    <button
      className={`swatch ${isCopied ? 'copied' : ''}`}
      style={{ backgroundColor: color.hex }}
      onClick={handleClick}
      title={`Click to copy ${color.hex.toUpperCase()}`}
    >
      {isCopied ? (
        <span className="swatchCopied" style={{ color: contrast }}>Copied!</span>
      ) : (
        <>
          <span className="swatchHex" style={{ color: contrast }}>
            {color.hex.toUpperCase()}
          </span>
          <span className="swatchLabel" style={{ color: contrast }}>
            {color.label}
          </span>
        </>
      )}
    </button>
  )
}

function HarmonyCard({ type, colors, onCopy, copiedId }) {
  const info = HARMONY_INFO[type]

  return (
    <div className="harmonyCard">
      <div className="harmonyHeader">
        <h3 className="harmonyTitle">{info.title}</h3>
        <span className="harmonyDesc">{info.desc}</span>
      </div>
      <div className="swatchRow">
        {colors.map((color, i) => (
          <ColorSwatch
            key={i}
            color={color}
            onCopy={onCopy}
            copiedId={copiedId}
            swatchId={`${type}-${i}`}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  // Load initial color from URL or use default
  const getInitialColor = () => {
    const hash = window.location.hash.slice(1)
    if (/^[0-9A-Fa-f]{6}$/.test(hash)) {
      return '#' + hash.toLowerCase()
    }
    return DEFAULT_COLOR
  }

  const [color, setColor] = useState(getInitialColor)
  const [copied, setCopied] = useState(null)
  const [recentColors, setRecentColors] = useState([])
  const [hexInput, setHexInput] = useState(getInitialColor().toUpperCase())
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('colorHarmonyFavorites')
    return saved ? JSON.parse(saved) : []
  })
  const [showColorBlindness, setShowColorBlindness] = useState(false)

  const harmonies = useMemo(() => getAllHarmonies(color), [color])
  const hsl = useMemo(() => hexToHsl(color), [color])
  const contrast = useMemo(() => getContrastColor(color), [color])
  const colorName = useMemo(() => getColorName(color), [color])
  const contrastWithWhite = useMemo(() => getContrastRatio(color, '#ffffff'), [color])
  const contrastWithBlack = useMemo(() => getContrastRatio(color, '#000000'), [color])
  const wcagWhite = useMemo(() => getWcagRating(contrastWithWhite), [contrastWithWhite])
  const wcagBlack = useMemo(() => getWcagRating(contrastWithBlack), [contrastWithBlack])

  const isFavorite = favorites.includes(color)

  // Update URL when color changes
  useEffect(() => {
    window.history.replaceState(null, '', `#${color.slice(1)}`)
  }, [color])

  useEffect(() => {
    setHexInput(color.toUpperCase())
  }, [color])

  useEffect(() => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color)
      return [color, ...filtered].slice(0, 8)
    })
  }, [color])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('colorHarmonyFavorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(prev => prev.filter(c => c !== color))
    } else {
      setFavorites(prev => [color, ...prev].slice(0, 12))
    }
  }

  const shareUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopiedValue('share')
    setTimeout(() => setCopiedValue(null), 1500)
  }

  const exportCss = () => {
    const css = generateCssVariables(harmonies, color)
    navigator.clipboard.writeText(css)
    setCopiedValue('css')
    setTimeout(() => setCopiedValue(null), 1500)
  }

  const handleCopy = useCallback((value) => {
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  const [copiedValue, setCopiedValue] = useState(null)

  const copyValue = (id, value) => {
    navigator.clipboard.writeText(value)
    setCopiedValue(id)
    setTimeout(() => setCopiedValue(null), 1500)
  }

  const handleReset = () => setColor(DEFAULT_COLOR)

  const handleRandom = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setColor(randomHex)
  }

  const handleEyedropper = async () => {
    if (!window.EyeDropper) {
      alert('EyeDropper API is not supported in your browser. Try Chrome or Edge.')
      return
    }
    try {
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      setColor(result.sRGBHex.toLowerCase())
    } catch (e) {}
  }

  const handleHexInputChange = (e) => {
    let val = e.target.value.toUpperCase()
    if (!val.startsWith('#')) val = '#' + val
    val = val.slice(0, 7)
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setColor(val.toLowerCase())
    }
  }

  return (
    <div className="page">
      {/* Top Section with Color Wheel */}
      <header className="topSection">
        <div className="topSectionInner">
          {/* Color Wheel */}
          <div className="wheelArea">
            <ColorWheel color={color} onChange={setColor} size={220} />
          </div>

          {/* Color Info */}
          <div className="colorInfoArea">
            <div className="colorPreviewLarge" style={{ backgroundColor: color }}>
              <span className="colorPreviewHex" style={{ color: contrast }}>
                {color.toUpperCase()}
              </span>
            </div>

            <div className="colorControls">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                className="hexInput"
                placeholder="#6366F1"
                maxLength={7}
                spellCheck={false}
              />
              <div className="controlButtons">
                <button className="controlBtn" onClick={handleEyedropper} title="Pick from screen">
                  <EyedropperIcon />
                </button>
                <button className="controlBtn" onClick={handleRandom} title="Random">
                  <RandomIcon />
                </button>
                <button className="controlBtn" onClick={handleReset} title="Reset">
                  <ResetIcon />
                </button>
              </div>
            </div>

            <div className="colorValues">
              <button className="valueBtn" onClick={() => copyValue('hex', color.toUpperCase())}>
                {copiedValue === 'hex' ? (
                  <span className="valueCopied">Copied!</span>
                ) : (
                  <>
                    <span className="valueLabel">HEX</span>
                    <span className="valueText">{color.toUpperCase()}</span>
                    <CopyIcon />
                  </>
                )}
              </button>
              <button className="valueBtn" onClick={() => copyValue('rgb', formatRgb(color))}>
                {copiedValue === 'rgb' ? (
                  <span className="valueCopied">Copied!</span>
                ) : (
                  <>
                    <span className="valueLabel">RGB</span>
                    <span className="valueText">{formatRgb(color)}</span>
                    <CopyIcon />
                  </>
                )}
              </button>
              {hsl && (
                <button className="valueBtn" onClick={() => copyValue('hsl', formatHsl(hsl))}>
                  {copiedValue === 'hsl' ? (
                    <span className="valueCopied">Copied!</span>
                  ) : (
                    <>
                      <span className="valueLabel">HSL</span>
                      <span className="valueText">{formatHsl(hsl)}</span>
                      <CopyIcon />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Recent Colors - Always rendered for consistent layout */}
            <div className="recentArea">
              {recentColors.length > 1 ? (
                <>
                  <span className="recentLabel">Recent</span>
                  <div className="recentSwatches">
                    {recentColors.slice(1).map((c, i) => (
                      <button
                        key={i}
                        className="recentSwatch"
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                        title={c.toUpperCase()}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <span className="recentLabel" style={{ opacity: 0 }}>Recent</span>
              )}
            </div>
          </div>

          {/* Hidden color input */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="hiddenColorInput"
            aria-label="Choose a color"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="harmoniesContainer">
          {HARMONY_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className={`harmonyRow row${row.length}`}>
              {row.map(type => (
                <HarmonyCard
                  key={type}
                  type={type}
                  colors={harmonies[type]}
                  onCopy={handleCopy}
                  copiedId={copied}
                />
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="credit">
        Built by{' '}
        <a href="https://instagram.com/berkindev" target="_blank" rel="noopener noreferrer" className="creditLink">
          berkindev
        </a>
      </footer>
    </div>
  )
}

export default App
