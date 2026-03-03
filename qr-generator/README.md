# QR Generator
Minimal web app to generate QR codes from any text or URL.
No signup.
No API.
Just clean generation.

---

## Live Demo
https://qrgenerator-liard.vercel.app/

---

## Features
- Generate QR codes **instantly** as you type
- Works with any **text or URL**
- Download as **PNG** (512px, high resolution)
- Download as **SVG** (vector, infinitely scalable)
- **High error correction** (readable even if partially obscured)
- Live preview panel
- Real-time debounced generation (150ms)
- Fully responsive (mobile-friendly)
- Full keyboard accessibility
- No authentication
- No ads
- No watermarks

---

## Tech Stack
- React (Vite)
- qrcode (QR generation)
- Vanilla CSS (Apple-inspired UI)
- Vercel (static deploy)

---

## How It Works
1. Type or paste any text / URL
2. QR code generates instantly in the browser
3. Click **Download PNG** for a raster image
4. Click **Download SVG** for a vector file

> All generation happens client-side. Nothing is uploaded.

---

## Privacy
All processing happens **locally in your browser**.
No data is sent to any server.
Your content never leaves your device.

---

## Installation
```bash
# Clone the repo
git clone https://github.com/berkinyilmaz/qr-generator.git

# Install dependencies
cd qr-generator
npm install

# Run locally
npm run dev
```
