"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {
  downloadPdf,
  generatePdf,
  getPreviewUrl,
} from "@/_projetos_originais/text-to-pdf/src/utils/generatePdf"

type PdfDocument = {
  save: (filename: string) => void
}

type PdfSettings = {
  font: "sans" | "serif" | "mono"
  fontSize: "small" | "medium" | "large"
  pageSize: "a4" | "letter" | "legal"
  orientation: "portrait" | "landscape"
  theme: "light" | "dark" | "sepia"
  showLineNumbers: boolean
  headerText: string
  showPageNumbers: boolean
  enableMarkdown: boolean
}

const PLACEHOLDER_TEXT = `# Text to PDF\n\nUse markdown, customize style and export polished PDFs.`

export function FullTextToPdfTool() {
  const [text, setText] = useState("")
  const [filename, setFilename] = useState("document")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const pdfDocRef = useRef<PdfDocument | null>(null)

  const [settings, setSettings] = useState<PdfSettings>({
    font: "sans",
    fontSize: "medium",
    pageSize: "a4",
    orientation: "portrait",
    theme: "light",
    showLineNumbers: false,
    headerText: "",
    showPageNumbers: true,
    enableMarkdown: true,
  })

  const stats = useMemo(
    () => ({
      characters: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text ? text.split("\n").length : 0,
    }),
    [text]
  )

  const setSetting = <K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setPreviewUrl(null)
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!(file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md"))) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === "string") {
        setText(content)
        setPreviewUrl(null)
        setFilename(file.name.replace(/\.(txt|md)$/i, "") || "document")
      }
    }
    reader.readAsText(file)
  }

  const generatePreview = useCallback(() => {
    if (!text.trim()) return

    setIsGenerating(true)
    setTimeout(() => {
      try {
        const doc = generatePdf(text, settings)
        pdfDocRef.current = doc
        setPreviewUrl(getPreviewUrl(doc))
        setShowPreview(true)
      } finally {
        setIsGenerating(false)
      }
    }, 80)
  }, [settings, text])

  const handleDownload = () => {
    if (!text.trim()) return
    if (!pdfDocRef.current) {
      pdfDocRef.current = generatePdf(text, settings)
    }
    downloadPdf(pdfDocRef.current, filename || "document")
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <section className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-4">
        <h3 className="text-base font-semibold">Settings</h3>

        <div className="mt-3 grid gap-3">
          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Filename
            <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={filename} onChange={(event) => setFilename(event.target.value)} />
          </label>

          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Font
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={settings.font} onChange={(event) => setSetting("font", event.target.value as PdfSettings["font"])}>
              <option value="sans">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="mono">Monospace</option>
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Size
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={settings.fontSize} onChange={(event) => setSetting("fontSize", event.target.value as PdfSettings["fontSize"])}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Page Size
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={settings.pageSize} onChange={(event) => setSetting("pageSize", event.target.value as PdfSettings["pageSize"])}>
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Orientation
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={settings.orientation} onChange={(event) => setSetting("orientation", event.target.value as PdfSettings["orientation"])}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>

          <div className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            PDF Theme
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "sepia"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  className={`relative overflow-hidden rounded-md border px-2 py-2 text-xs capitalize ${settings.theme === theme ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                  onClick={() => setSetting("theme", theme)}
                >
                  <GlowingEffect
                    spread={24}
                    disabled={false}
                    proximity={48}
                    inactiveZone={0.2}
                    borderWidth={2}
                  />
                  <span className="relative z-10">{theme}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Header Text
            <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={settings.headerText} onChange={(event) => setSetting("headerText", event.target.value)} placeholder="Optional header text..." />
          </label>

          <div className="grid gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.enableMarkdown} onChange={(event) => setSetting("enableMarkdown", event.target.checked)} /> Markdown</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.showPageNumbers} onChange={(event) => setSetting("showPageNumbers", event.target.checked)} /> Page numbers</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.showLineNumbers} onChange={(event) => setSetting("showLineNumbers", event.target.checked)} /> Line numbers</label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={generatePreview}
              disabled={!text.trim() || isGenerating}
            >
              <GlowingEffect
                spread={24}
                disabled={false}
                proximity={56}
                inactiveZone={0.15}
                borderWidth={2}
              />
              <span className="relative z-10">{isGenerating ? "Generating..." : "Preview"}</span>
            </Button>
            <Button className="relative overflow-hidden" onClick={handleDownload} disabled={!text.trim()}>
              <GlowingEffect
                spread={24}
                disabled={false}
                proximity={56}
                inactiveZone={0.15}
                borderWidth={2}
              />
              <span className="relative z-10">Download PDF</span>
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="font-medium">Editor</p>
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{stats.characters} chars</span>
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{stats.words} words</span>
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{stats.lines} lines</span>
          </div>
          <button
            type="button"
            className="relative overflow-hidden rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setText(PLACEHOLDER_TEXT)}
          >
            <GlowingEffect
              spread={24}
              disabled={false}
              proximity={48}
              inactiveZone={0.2}
              borderWidth={2}
            />
            <span className="relative z-10">Example</span>
          </button>
        </div>

        <div
          className={`relative m-4 rounded-lg border ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            handleFile(event.dataTransfer.files?.[0])
          }}
        >
          <textarea
            className="min-h-[420px] w-full resize-y bg-transparent p-4 text-sm outline-none"
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setPreviewUrl(null)
            }}
            placeholder="Start typing or drop a .txt / .md file here..."
            spellCheck={false}
          />
          {isDragging && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/85 text-sm font-medium">Drop file here</div>}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <label className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
            Upload .txt or .md
            <input type="file" hidden accept=".txt,.md,text/plain,text/markdown" onChange={(event) => handleFile(event.target.files?.[0] ?? undefined)} />
          </label>
          <Button
            variant="ghost"
            className="relative overflow-hidden"
            onClick={() => {
              setText("")
              setPreviewUrl(null)
              setFilename("document")
            }}
          >
            <GlowingEffect
              spread={24}
              disabled={false}
              proximity={56}
              inactiveZone={0.15}
              borderWidth={2}
            />
            <span className="relative z-10">Clear</span>
          </Button>
        </div>
      </section>

      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPreview(false)}>
          <div className="h-[90vh] w-full max-w-5xl rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-3" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">Preview — {settings.pageSize.toUpperCase()} {settings.orientation}</p>
              <Button variant="outline" className="relative overflow-hidden" onClick={() => setShowPreview(false)}>
                <GlowingEffect
                  spread={24}
                  disabled={false}
                  proximity={56}
                  inactiveZone={0.15}
                  borderWidth={2}
                />
                <span className="relative z-10">Close</span>
              </Button>
            </div>
            <iframe src={previewUrl} title="PDF preview" className="h-[calc(90vh-80px)] w-full rounded-md border border-border bg-background" />
          </div>
        </div>
      )}
    </div>
  )
}
