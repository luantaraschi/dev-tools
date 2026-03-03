# Color Harmony
Minimal web app to generate beautiful **color harmony palettes** from any color.  
No signup.  
No API.  
Just clean palettes.

---

## Live Demo
https://color-harmony-five.vercel.app/#6366f1

---

## Features
- Pick a base color with an interactive **color wheel**
- Enter any **HEX** value (auto-updates on valid input)
- **Eyedropper** support (pick color from screen, supported browsers)
- Generate harmony sets instantly:
  - **Complementary** (180° opposite)
  - **Analogous** (±30° adjacent)
  - **Triadic** (120° spacing)
  - **Split Complementary** (150° & 210°)
  - **Square** (90° spacing)
  - **Tetradic** (double complement)
  - **Monochromatic** (light/dark variants)
- Click any swatch to **copy HEX** (with “Copied!” feedback)
- Copy quick values:
  - **HEX / RGB / HSL** buttons (one-tap copy)
- **Shareable URLs**: color is stored in the URL hash (`/#6366f1`)
- **Recent colors** history (auto updates as you pick)
- **Favorites** saved to localStorage (quick access)
- Clean, responsive, Apple-inspired UI
- No authentication
- No ads
- No watermarks

---

## Tech Stack
- React (Vite)
- Canvas API (custom color wheel rendering)
- Vanilla CSS (Apple-inspired UI)
- Utility color functions (HSL/HEX conversions, contrast, WCAG rating, etc.)
- Vercel (static deploy)

---

## How It Works
1. Pick a color from the **wheel** (canvas-based) or paste a **HEX**
2. App calculates color harmonies by shifting **hue** in HSL space
3. Each harmony card renders swatches you can **copy** instantly
4. The selected color syncs to the URL hash so you can **share** the exact palette

> Everything is computed client-side. Nothing is uploaded.

---

## Privacy
All processing happens **locally in your browser**.  
No data is sent to any server.

---

## Installation
```bash
# Clone the repo
git clone <YOUR_REPO_URL>

# Install dependencies
cd <YOUR_PROJECT_FOLDER>
npm install

# Run locally
npm run dev
