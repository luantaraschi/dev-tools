# Color Palette Extractor

Minimal web app to extract beautiful color palettes from any image.
No signup.
No API.
Just clean extraction.

---

## Live Demo

https://color-palette-extractor-eight.vercel.app/

---

## Features

- **Drag & drop** or click to upload any image
- Extract **3 to 12 colors** with adjustable slider
- View colors in **HEX, RGB, or HSL** formats
- **Click to copy** any color value to clipboard
- Smart **median cut algorithm** for accurate palette extraction
- **Vibrant color prioritization** (saturated colors rank higher)
- Automatic **contrast detection** for readable text overlay
- Live palette preview strip
- Fully responsive (mobile-friendly)
- Full keyboard accessibility
- No authentication
- No ads
- No watermarks

---

## Tech Stack

- React (Vite)
- Canvas API (color extraction)
- Vanilla CSS (Apple-inspired UI)
- Vercel (static deploy)

---

## How It Works

1. Drop or select any image file
2. Colors are extracted instantly using the median cut algorithm
3. Adjust the number of colors (3–12) with the slider
4. Switch between HEX / RGB / HSL formats
5. Click any color card to copy its value

> All extraction happens client-side using Canvas. Nothing is uploaded.

---

## Privacy

All processing happens **locally in your browser**.
No data is sent to any server.
Your images never leave your device.

---

## Installation

```bash
# Clone the repo
git clone https://github.com/berkinyilmaz/color-palette-extractor.git

# Install dependencies
cd color-palette-extractor
npm install

# Run locally
npm run dev
```
