# Time Zone Converter

Minimal web app to **convert times across regions** instantly.
No signup.
No API.
Just accurate time conversion.

---

## Live Demo

https://time-converter-eta.vercel.app/

---

## Features

- **Two modes:**
  - **Converter** – convert a specific time to multiple timezones
  - **World Clock** – live clocks showing current time in selected cities
- **300+ cities** with 2M+ population worldwide
- **Smart search** – find cities by name or country with keyboard
- **UTC offset display** – see offset for every city (e.g., UTC+3, UTC-5)
- **Working hours indicator** – shows if a city is in business hours (9-17)
- **Time difference** – displays hour difference from your timezone
- **Day indicator** – shows +1/-1 when time crosses midnight
- **Preset regions:**
  - US Team
  - Europe
  - Asia Pacific
  - Global
- **Share link** – generate URL with your selected times and cities
- **Schedule Meeting** – copy formatted meeting invite with all timezones
- **24-hour / 12-hour format** toggle
- **Auto-save favorites** – remembers your selected cities
- Clean, responsive, Apple-inspired dark UI
- No authentication
- No ads
- No watermarks

---

## Tech Stack

- React (Vite)
- Vanilla CSS (Apple-inspired UI)
- Intl.DateTimeFormat API (timezone conversion)
- LocalStorage (favorites persistence)
- Vercel (static deploy)

---

## How It Works

1. Select your **source city** from 300+ options
2. Set the **time** you want to convert
3. Add **target cities** using search or presets
4. View converted times with working hours and day indicators
5. **Share** the link or **copy meeting invite**

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
cd timezone-converter
npm install

# Run locally
npm run dev
```
