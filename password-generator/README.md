# Password Generator

Minimal web app to generate **secure, random passwords** with multiple modes.
No signup.
No API.
Just strong passwords.

---

## Live Demo

https://password-generator-seven-zeta.vercel.app/

---

## Features

- **Three generation modes:**
  - **Random** – fully randomized characters
  - **Pronounceable** – easy-to-remember syllable-based passwords
  - **Passphrase** – word-based passwords (e.g., `Apple-coral-jazz-42`)
- Adjustable **length** (8–64 characters) or **word count** (3–8 words)
- Character options for random mode:
  - **Uppercase** (A-Z)
  - **Lowercase** (a-z)
  - **Numbers** (0-9)
  - **Symbols** (!@#$%^&*)
- **Exclude similar** characters (0O1lI|) to avoid confusion
- **Must contain** option – guarantees at least one of each selected type
- Visual **strength meter** (Weak / Fair / Good / Strong)
- **One-click copy** with "Copied!" feedback
- **Recent passwords** history (last 5, click to copy)
- **Keyboard shortcut**: press `Enter` to regenerate
- **Cryptographically secure** random generation (`crypto.getRandomValues`)
- Clean, responsive, Apple-inspired UI
- No authentication
- No ads
- No watermarks

---

## Tech Stack

- React (Vite)
- Vanilla CSS (Apple-inspired UI)
- Web Crypto API (secure random)
- Vercel (static deploy)

---

## How It Works

1. Choose a **mode** (Random / Pronounceable / Passphrase)
2. Adjust **length** or **word count** with the slider
3. Toggle character types and extra options (random mode only)
4. App generates password instantly using `crypto.getRandomValues`
5. Click **Copy** or press `Enter` to regenerate

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
cd password-generator
npm install

# Run locally
npm run dev
```
