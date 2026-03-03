"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_KEY,
  PRESETS,
  TIMEZONES,
  convertTime,
  createDateInTimezone,
  findByKey,
  formatDate,
  formatOffset,
  formatTime,
  generateShareableUrl,
  getCurrentTimeInTimezone,
  getTimeDifference,
  isWorkingHours,
} from "@/time-converter/src/utils/timezone"

const STORAGE_KEY = "devtools-timeconverter-target-keys"

type Mode = "converter" | "worldclock"

export function FullTimeConverterTool() {
  const [sourceKey, setSourceKey] = useState<string>(DEFAULT_KEY)
  const [targetKeys, setTargetKeys] = useState<string[]>(["seoul-south-korea"])
  const [hour, setHour] = useState<number>(9)
  const [minute, setMinute] = useState<number>(0)
  const [mode, setMode] = useState<Mode>("converter")
  const [use24Hour, setUse24Hour] = useState(true)
  const [citySearch, setCitySearch] = useState("")
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  const sourceInfo = findByKey(sourceKey)
  const sourceTimezone = sourceInfo?.id ?? "UTC"

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((key) => TIMEZONES.some((tz) => tz.key === key))
          if (filtered.length > 0) setTargetKeys(filtered)
        }
      } catch {}
    }

    const now = getCurrentTimeInTimezone(sourceTimezone)
    setHour(now.hour)
    setMinute(now.minute)
  }, [sourceTimezone])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(targetKeys))
  }, [targetKeys])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const availableTimezones = useMemo(() => {
    return TIMEZONES.filter((tz) => !targetKeys.includes(tz.key) && tz.key !== sourceKey).filter((tz) => {
      const search = citySearch.trim().toLowerCase()
      if (!search) return true
      return (
        tz.city.toLowerCase().includes(search) ||
        tz.country.toLowerCase().includes(search)
      )
    })
  }, [citySearch, sourceKey, targetKeys])

  const getConverted = (targetTimezoneId: string) => {
    const sourceDate = createDateInTimezone(hour, minute, sourceTimezone, new Date())
    return convertTime(sourceDate, sourceTimezone, targetTimezoneId)
  }

  const getLive = (timezoneId: string) => convertTime(currentTime, "UTC", timezoneId)

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS]
    if (!preset) return
    const next = preset
      .map((id) => TIMEZONES.find((tz) => tz.id === id)?.key)
      .filter((key): key is string => Boolean(key) && key !== sourceKey)
    setTargetKeys(next)
    setShowPresets(false)
  }

  const addCity = (key: string) => {
    if (key !== sourceKey && !targetKeys.includes(key)) {
      setTargetKeys((prev) => [...prev, key])
    }
    setShowAddMenu(false)
    setCitySearch("")
  }

  const removeCity = (key: string) => {
    setTargetKeys((prev) => prev.filter((item) => item !== key))
  }

  const getDayIndicator = (target: { year: number; month: number; day: number }) => {
    const sourceSelf = getConverted(sourceTimezone)
    if (target.year > sourceSelf.year || target.month > sourceSelf.month || target.day > sourceSelf.day) return "+1"
    if (target.year < sourceSelf.year || target.month < sourceSelf.month || target.day < sourceSelf.day) return "-1"
    return null
  }

  const copyShareLink = async () => {
    const targetIds = targetKeys
      .map((key) => findByKey(key)?.id)
      .filter((id): id is string => Boolean(id))

    const url = generateShareableUrl(hour, minute, sourceTimezone, targetIds, null)
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const copyMeetingInvite = async () => {
    const lines = targetKeys
      .map((key) => {
        const tz = findByKey(key)
        if (!tz) return null
        const converted = getConverted(tz.id)
        return `${tz.city}: ${formatTime(converted.hour, converted.minute, use24Hour)}`
      })
      .filter((line): line is string => Boolean(line))

    const targetIds = targetKeys
      .map((key) => findByKey(key)?.id)
      .filter((id): id is string => Boolean(id))

    const shareUrl = generateShareableUrl(hour, minute, sourceTimezone, targetIds, null)
    const invite = `${meetingTitle || "Meeting"}\n\n${sourceInfo?.city}: ${formatTime(hour, minute, use24Hour)} (Host)\n${lines.join("\n")}\n\nView times: ${shareUrl}`

    await navigator.clipboard.writeText(invite)
    setMeetingTitle("")
    setShowMeetingModal(false)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Time Zone Converter</h2>
        <p className="text-sm text-muted-foreground">Convert times across regions instantly</p>

        <div className="mt-4 inline-flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setMode("converter")}
            className={`rounded-md px-4 py-1.5 text-sm ${mode === "converter" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Converter
          </button>
          <button
            type="button"
            onClick={() => setMode("worldclock")}
            className={`rounded-md px-4 py-1.5 text-sm ${mode === "worldclock" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            World Clock
          </button>
        </div>

        {mode === "converter" ? (
          <>
            <div className="mt-4 grid gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your time</p>
              <div className="flex flex-wrap items-center gap-2">
                <select className="rounded-md border border-input bg-background px-3 py-2" value={hour} onChange={(event) => setHour(Number(event.target.value))}>
                  {Array.from({ length: 24 }, (_, value) => (
                    <option key={value} value={value}>{use24Hour ? String(value).padStart(2, "0") : value % 12 || 12}</option>
                  ))}
                </select>
                <span>:</span>
                <select className="rounded-md border border-input bg-background px-3 py-2" value={minute} onChange={(event) => setMinute(Number(event.target.value))}>
                  {Array.from({ length: 60 }, (_, value) => (
                    <option key={value} value={value}>{String(value).padStart(2, "0")}</option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={() => {
                  const now = getCurrentTimeInTimezone(sourceTimezone)
                  setHour(now.hour)
                  setMinute(now.minute)
                }}>Now</Button>
              </div>

              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={sourceKey} onChange={(event) => setSourceKey(event.target.value)}>
                {TIMEZONES.map((timezone) => (
                  <option key={timezone.key} value={timezone.key}>
                    {timezone.city}, {timezone.country} ({formatOffset(timezone.offset)})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Converted times</p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setShowPresets((prev) => !prev)}>Presets</Button>
                  {showPresets && (
                    <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-border bg-popover p-1 shadow-md">
                      {Object.keys(PRESETS).map((presetName) => (
                        <button key={presetName} className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent" onClick={() => applyPreset(presetName)}>
                          {presetName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {targetKeys.map((key) => {
                const timezone = findByKey(key)
                if (!timezone) return null

                const converted = getConverted(timezone.id)
                const diff = getTimeDifference(sourceTimezone, timezone.id)
                const dayIndicator = getDayIndicator(converted)
                const working = isWorkingHours(converted.hour)

                return (
                  <div key={key} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{timezone.city}</p>
                        <p className="text-xs text-muted-foreground">{timezone.country}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${working ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>
                          {working ? "Working" : "Off"}
                        </span>
                        <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => removeCity(key)}>×</button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-3xl font-semibold">{formatTime(converted.hour, converted.minute, use24Hour)}</p>
                      {dayIndicator && <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{dayIndicator}</span>}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(converted.year, converted.month, converted.day)}</span>
                      <span>{diff >= 0 ? "+" : ""}{diff}h</span>
                    </div>
                  </div>
                )
              })}

              <div className="relative">
                <Button variant="outline" className="w-full" onClick={() => setShowAddMenu((prev) => !prev)}>+ Add City</Button>
                {showAddMenu && (
                  <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-popover p-2 shadow-md">
                    <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={citySearch} onChange={(event) => setCitySearch(event.target.value)} placeholder="Search cities..." />
                    <div className="mt-2 max-h-56 space-y-1 overflow-auto">
                      {availableTimezones.slice(0, 50).map((timezone) => (
                        <button key={timezone.key} className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm hover:bg-accent" onClick={() => addCity(timezone.key)}>
                          <span>{timezone.city}, {timezone.country}</span>
                          <span className="text-xs text-muted-foreground">{formatOffset(timezone.offset)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyShareLink}>{copied ? "Copied" : "Share Link"}</Button>
              <Button onClick={() => setShowMeetingModal(true)}>Schedule Meeting</Button>
            </div>
          </>
        ) : (
          <div className="mt-4 grid gap-3">
            {[sourceKey, ...targetKeys].map((key, index) => {
              const timezone = findByKey(key)
              if (!timezone) return null
              const live = getLive(timezone.id)
              const diff = getTimeDifference(sourceTimezone, timezone.id)
              const working = isWorkingHours(live.hour)

              return (
                <div key={`${key}-${index}`} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{timezone.city}</p>
                      <p className="text-xs text-muted-foreground">{timezone.country}{index === 0 ? " (You)" : ""}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${working ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>
                      {working ? "Working" : "Off"}
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{formatTime(live.hour, live.minute, use24Hour)}<span className="text-lg text-muted-foreground">:{String(live.second).padStart(2, "0")}</span></p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(live.year, live.month, live.day)}</span>
                    <span>{diff >= 0 ? "+" : ""}{diff}h</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-sm">24-hour format</span>
          <button
            type="button"
            role="switch"
            aria-checked={use24Hour}
            onClick={() => setUse24Hour((prev) => !prev)}
            className={`relative h-6 w-11 rounded-full transition ${use24Hour ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${use24Hour ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowMeetingModal(false)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-4" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold">Schedule Meeting</h3>
            <p className="text-sm text-muted-foreground">Create a shareable invite in clipboard</p>

            <label className="mt-3 grid gap-2 text-sm">
              Meeting title
              <input className="w-full rounded-md border border-input bg-background px-3 py-2" value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder="Team Sync" />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMeetingModal(false)}>Cancel</Button>
              <Button onClick={copyMeetingInvite}>Copy Invite</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
