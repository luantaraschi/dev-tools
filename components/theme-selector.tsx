"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Theme
        </p>
        <div className="h-9 w-full rounded-md border border-input bg-background" />
      </div>
    )
  }

  return (
    <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      Theme
      <select
        aria-label="Theme selector"
        value={theme ?? "system"}
        onChange={(event) => setTheme(event.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark] [&>option]:bg-background [&>option]:text-foreground dark:[&>option]:bg-card"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
