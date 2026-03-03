"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  calculateStrength,
  generatePassphrase,
  generatePassword,
  generatePronounceable,
} from "@/password-generator/src/utils/generatePassword"

type PasswordMode = "random" | "pronounceable" | "passphrase"

type PasswordOptions = {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
  mustContain: boolean
}

const MAX_HISTORY = 5

export function FullPasswordGeneratorTool() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(4)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<PasswordMode>("random")
  const [history, setHistory] = useState<string[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    mustContain: false,
  })

  const strength = useMemo(
    () => calculateStrength(password, options, mode),
    [mode, options, password]
  )

  const generate = useCallback((trackHistory = true) => {
    let next = ""

    if (mode === "random") next = generatePassword(length, options)
    if (mode === "pronounceable") next = generatePronounceable(length)
    if (mode === "passphrase") next = generatePassphrase(wordCount)

    setPassword((previous) => {
      if (trackHistory && next && previous && next !== previous) {
        setHistory((prev) => {
          const unique = [previous, ...prev.filter((item) => item !== previous)]
          return unique.slice(0, MAX_HISTORY)
        })
      }
      return next
    })

    setCopied(false)
  }, [length, mode, options, wordCount])

  useEffect(() => {
    generate(false)
  }, [generate])

  const handleCopy = async (value = password) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const setOption = (key: keyof PasswordOptions) => {
    if (key === "excludeSimilar" || key === "mustContain") {
      setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
      return
    }

    const next = { ...options, [key]: !options[key] }
    const hasAtLeastOne = [
      next.uppercase,
      next.lowercase,
      next.numbers,
      next.symbols,
    ].some(Boolean)

    if (hasAtLeastOne) {
      setOptions(next)
    }
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Password Generator</h2>
        <p className="text-sm text-muted-foreground">Generate secure, random passwords</p>

        <div className="mt-4 grid gap-3">
          <div className="inline-flex rounded-lg border border-border p-1">
            {([
              ["random", "Random"],
              ["pronounceable", "Pronounceable"],
              ["passphrase", "Passphrase"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm ${mode === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setMode(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="break-all text-center font-mono text-sm">{password || "Select options"}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${index < strength.score ? "bg-emerald-500" : "bg-muted"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{strength.label}</span>
          </div>

          {mode === "passphrase" ? (
            <label className="grid gap-2 text-sm">
              Words: {wordCount}
              <input
                type="range"
                min={3}
                max={8}
                value={wordCount}
                onChange={(event) => setWordCount(Number(event.target.value))}
              />
            </label>
          ) : (
            <label className="grid gap-2 text-sm">
              Length: {length}
              <input
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
            </label>
          )}

          {mode === "random" && (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {([
                  ["uppercase", "Uppercase", "A-Z"],
                  ["lowercase", "Lowercase", "a-z"],
                  ["numbers", "Numbers", "0-9"],
                  ["symbols", "Symbols", "!@#$%"],
                ] as const).map(([key, label, hint]) => (
                  <label key={key} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options[key]}
                        onChange={() => setOption(key)}
                      />
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </label>
                ))}
              </div>

              <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                <span>Exclude similar</span>
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={() => setOption("excludeSimilar")}
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                <span>Must contain</span>
                <input
                  type="checkbox"
                  checked={options.mustContain}
                  onChange={() => setOption("mustContain")}
                />
              </label>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={() => generate()}>Generate</Button>
            <Button variant="outline" onClick={() => handleCopy()} disabled={!password}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </section>

      {history.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent</h3>
            <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setHistory([])}>
              Clear
            </button>
          </div>

          <div className="grid gap-2">
            {history.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => handleCopy(item)}
              >
                <span className="truncate font-mono">{item}</span>
                <span className="text-xs text-muted-foreground">Copy</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
