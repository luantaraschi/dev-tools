// Convert HEX to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

// Convert RGB to HEX
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Convert HSL to RGB
export function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// Convert HEX to HSL
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

// Convert HSL to HEX
export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

// Rotate hue by degrees
function rotateHue(h, degrees) {
  return (h + degrees + 360) % 360
}

// Generate color with rotated hue
function generateColor(baseHsl, rotation) {
  const newH = rotateHue(baseHsl.h, rotation)
  return {
    hex: hslToHex(newH, baseHsl.s, baseHsl.l),
    hsl: { h: newH, s: baseHsl.s, l: baseHsl.l }
  }
}

// Color Harmony Functions

// Complementary: opposite on the color wheel (180°)
export function getComplementary(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 180), label: 'Complementary' }
  ]
}

// Analogous: adjacent colors (±30°)
export function getAnalogous(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { ...generateColor(hsl, -30), label: 'Analogous 1' },
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 30), label: 'Analogous 2' }
  ]
}

// Triadic: three colors equally spaced (120° apart)
export function getTriadic(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 120), label: 'Triadic 1' },
    { ...generateColor(hsl, 240), label: 'Triadic 2' }
  ]
}

// Split-Complementary: base + two colors adjacent to complement (150° and 210°)
export function getSplitComplementary(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 150), label: 'Split 1' },
    { ...generateColor(hsl, 210), label: 'Split 2' }
  ]
}

// Square: four colors equally spaced (90° apart)
export function getSquare(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 90), label: 'Square 1' },
    { ...generateColor(hsl, 180), label: 'Square 2' },
    { ...generateColor(hsl, 270), label: 'Square 3' }
  ]
}

// Tetradic (Rectangle): two complementary pairs
export function getTetradic(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []
  return [
    { hex, hsl, label: 'Base' },
    { ...generateColor(hsl, 60), label: 'Tetradic 1' },
    { ...generateColor(hsl, 180), label: 'Tetradic 2' },
    { ...generateColor(hsl, 240), label: 'Tetradic 3' }
  ]
}

// Monochromatic: same hue, different lightness/saturation
export function getMonochromatic(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return []

  const variations = [
    { l: Math.min(95, hsl.l + 30), s: Math.max(10, hsl.s - 20) },
    { l: Math.min(85, hsl.l + 15), s: hsl.s },
    { l: hsl.l, s: hsl.s },
    { l: Math.max(15, hsl.l - 15), s: hsl.s },
    { l: Math.max(5, hsl.l - 30), s: Math.min(100, hsl.s + 10) }
  ]

  return variations.map((v, i) => ({
    hex: hslToHex(hsl.h, v.s, v.l),
    hsl: { h: hsl.h, s: v.s, l: v.l },
    label: i === 2 ? 'Base' : `Shade ${i + 1}`
  }))
}

// Get all harmonies for a color
export function getAllHarmonies(hex) {
  return {
    complementary: getComplementary(hex),
    analogous: getAnalogous(hex),
    triadic: getTriadic(hex),
    splitComplementary: getSplitComplementary(hex),
    square: getSquare(hex),
    tetradic: getTetradic(hex),
    monochromatic: getMonochromatic(hex)
  }
}

// Get contrast color (black or white) for text
export function getContrastColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#ffffff'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Format HSL for display
export function formatHsl(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

// Format RGB for display
export function formatRgb(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return ''
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

// Calculate WCAG contrast ratio
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 1

  const luminance = (rgb) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = luminance(rgb1)
  const l2 = luminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2)
}

// Get WCAG rating
export function getWcagRating(ratio) {
  if (ratio >= 7) return { level: 'AAA', label: 'Excellent' }
  if (ratio >= 4.5) return { level: 'AA', label: 'Good' }
  if (ratio >= 3) return { level: 'AA Large', label: 'OK for large text' }
  return { level: 'Fail', label: 'Poor contrast' }
}

// Color blindness simulation matrices
const colorBlindnessMatrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ]
}

// Simulate color blindness
export function simulateColorBlindness(hex, type) {
  const rgb = hexToRgb(hex)
  if (!rgb || !colorBlindnessMatrices[type]) return hex

  const matrix = colorBlindnessMatrices[type]
  const r = Math.round(matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b)
  const g = Math.round(matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b)
  const b = Math.round(matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b)

  return rgbToHex(
    Math.max(0, Math.min(255, r)),
    Math.max(0, Math.min(255, g)),
    Math.max(0, Math.min(255, b))
  )
}

// Color name database (simplified)
const colorNames = [
  { name: 'Red', h: 0, s: 100, l: 50 },
  { name: 'Coral', h: 16, s: 100, l: 66 },
  { name: 'Orange', h: 30, s: 100, l: 50 },
  { name: 'Gold', h: 45, s: 100, l: 50 },
  { name: 'Yellow', h: 60, s: 100, l: 50 },
  { name: 'Lime', h: 75, s: 100, l: 50 },
  { name: 'Green', h: 120, s: 100, l: 35 },
  { name: 'Emerald', h: 140, s: 70, l: 45 },
  { name: 'Teal', h: 180, s: 100, l: 35 },
  { name: 'Cyan', h: 180, s: 100, l: 50 },
  { name: 'Sky', h: 200, s: 100, l: 50 },
  { name: 'Blue', h: 220, s: 100, l: 50 },
  { name: 'Indigo', h: 240, s: 60, l: 50 },
  { name: 'Violet', h: 270, s: 80, l: 60 },
  { name: 'Purple', h: 280, s: 100, l: 50 },
  { name: 'Magenta', h: 300, s: 100, l: 50 },
  { name: 'Pink', h: 330, s: 100, l: 70 },
  { name: 'Rose', h: 350, s: 100, l: 60 },
  { name: 'White', h: 0, s: 0, l: 100 },
  { name: 'Silver', h: 0, s: 0, l: 75 },
  { name: 'Gray', h: 0, s: 0, l: 50 },
  { name: 'Charcoal', h: 0, s: 0, l: 25 },
  { name: 'Black', h: 0, s: 0, l: 0 }
]

// Get approximate color name
export function getColorName(hex) {
  const hsl = hexToHsl(hex)
  if (!hsl) return 'Unknown'

  // Handle grayscale
  if (hsl.s < 15) {
    if (hsl.l > 90) return 'White'
    if (hsl.l > 70) return 'Silver'
    if (hsl.l > 40) return 'Gray'
    if (hsl.l > 15) return 'Charcoal'
    return 'Black'
  }

  // Find closest color by hue
  let closestColor = colorNames[0]
  let minDiff = 360

  for (const color of colorNames) {
    if (color.s === 0) continue // Skip grayscale in hue matching
    let hueDiff = Math.abs(hsl.h - color.h)
    if (hueDiff > 180) hueDiff = 360 - hueDiff
    if (hueDiff < minDiff) {
      minDiff = hueDiff
      closestColor = color
    }
  }

  // Add lightness modifier
  let prefix = ''
  if (hsl.l > 75) prefix = 'Light '
  else if (hsl.l < 30) prefix = 'Dark '

  return prefix + closestColor.name
}

// Generate CSS variables from harmonies
export function generateCssVariables(harmonies, baseColor) {
  let css = ':root {\n'
  css += `  --color-base: ${baseColor};\n`

  for (const [harmonyType, colors] of Object.entries(harmonies)) {
    colors.forEach((color, i) => {
      const name = `--color-${harmonyType}-${i + 1}`
      css += `  ${name}: ${color.hex};\n`
    })
  }

  css += '}'
  return css
}
