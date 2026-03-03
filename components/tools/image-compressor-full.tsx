/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import heic2any from "heic2any"
import { Button } from "@/components/ui/button"
import { compressImage, formatBytes } from "@/_projetos_originais/src/utils/compressImage"

type CompressorSettings = {
  mimeType: string
  quality: number
  keepOriginalSize: boolean
  lockRatio: boolean
  maxWidth: number
  maxHeight: number
}

const DEFAULTS: CompressorSettings = {
  mimeType: "image/webp",
  quality: 0.82,
  keepOriginalSize: true,
  lockRatio: true,
  maxWidth: 1920,
  maxHeight: 1920,
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export function FullImageCompressorTool() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [originalMeta, setOriginalMeta] = useState<{ width: number; height: number } | null>(null)
  const [settings, setSettings] = useState<CompressorSettings>(DEFAULTS)
  const [result, setResult] = useState<{
    blob: Blob
    url: string
    width: number
    height: number
    mimeType: string
  } | null>(null)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState("")

  const originalSize = file?.size ?? 0
  const compressedSize = result?.blob?.size ?? 0

  const ratio = useMemo(() => {
    if (!originalMeta?.width || !originalMeta?.height) return null
    return originalMeta.width / originalMeta.height
  }, [originalMeta])

  const changeInfo = useMemo(() => {
    if (!originalSize || !compressedSize) return null
    const diff = originalSize - compressedSize
    const pct = (diff / originalSize) * 100
    return { diff, pct, isSmaller: diff > 0 }
  }, [compressedSize, originalSize])

  const cleanupUrl = (url?: string | null) => {
    if (url) URL.revokeObjectURL(url)
  }

  useEffect(() => {
    return () => {
      cleanupUrl(originalUrl)
      cleanupUrl(result?.url)
    }
  }, [originalUrl, result?.url])

  const readImageMeta = async (url: string) => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
      image.onerror = reject
      image.src = url
    })
  }

  const clearResult = () => {
    cleanupUrl(result?.url)
    setResult(null)
  }

  const handlePick = async (selected: File | null | undefined) => {
    setError("")
    if (!selected) return

    try {
      clearResult()
      cleanupUrl(originalUrl)

      const lowerName = selected.name.toLowerCase()
      const isHeic =
        selected.type === "image/heic" ||
        selected.type === "image/heif" ||
        lowerName.endsWith(".heic") ||
        lowerName.endsWith(".heif")

      let normalized: File = selected
      if (isHeic) {
        const converted = await heic2any({ blob: selected, toType: "image/jpeg", quality: 0.92 })
        const jpegBlob = Array.isArray(converted) ? converted[0] : converted
        normalized = new File([jpegBlob], "image.jpg", { type: "image/jpeg" })
      }

      if (!normalized.type.startsWith("image/")) {
        setError("Please choose an image file.")
        return
      }

      setFile(normalized)
      const url = URL.createObjectURL(normalized)
      setOriginalUrl(url)
      setOriginalMeta(await readImageMeta(url))
    } catch {
      setError("Image import failed. Try converting to JPG/PNG.")
    }
  }

  const handleCompress = useCallback(async () => {
    if (!file) return

    setIsWorking(true)
    setError("")

    try {
      const out = await compressImage(file, settings)
      const url = URL.createObjectURL(out.blob)
      cleanupUrl(result?.url)
      setResult({ blob: out.blob, url, width: out.width, height: out.height, mimeType: out.mimeType })
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Something went wrong."
      setError(message)
    } finally {
      setIsWorking(false)
    }
  }, [file, result?.url, settings])

  useEffect(() => {
    if (!file || !result) return
    const timeout = setTimeout(() => {
      void handleCompress()
    }, 300)
    return () => clearTimeout(timeout)
  }, [settings.mimeType, settings.quality, settings.keepOriginalSize, settings.maxWidth, settings.maxHeight, file, result, handleCompress])

  const setMaxWidthWithRatio = (nextWidth: number) => {
    const width = clamp(nextWidth, 64, 8000)
    if (!settings.lockRatio || !ratio) {
      setSettings((prev) => ({ ...prev, maxWidth: width }))
      return
    }
    const height = clamp(Math.round(width / ratio), 64, 8000)
    setSettings((prev) => ({ ...prev, maxWidth: width, maxHeight: height }))
  }

  const setMaxHeightWithRatio = (nextHeight: number) => {
    const height = clamp(nextHeight, 64, 8000)
    if (!settings.lockRatio || !ratio) {
      setSettings((prev) => ({ ...prev, maxHeight: height }))
      return
    }
    const width = clamp(Math.round(height * ratio), 64, 8000)
    setSettings((prev) => ({ ...prev, maxHeight: height, maxWidth: width }))
  }

  const beforeText = file ? formatBytes(file.size) : "—"
  const afterText = result ? formatBytes(result.blob.size) : "—"
  const outputText = result ? result.mimeType.replace("image/", "").toUpperCase() : "—"
  const dimensionText = result
    ? `${result.width} × ${result.height}`
    : originalMeta
      ? `${originalMeta.width} × ${originalMeta.height}`
      : "—"

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Image Compressor</h2>
        <p className="text-sm text-muted-foreground">Fast, ad-free image compression.</p>

        <div className="mt-4 grid gap-3">
          <div
            className="cursor-pointer rounded-md border border-dashed border-border bg-background p-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              void handlePick(event.dataTransfer.files?.[0])
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              hidden
              accept="image/*,.heic,.heif"
              onChange={(event) => {
                void handlePick(event.target.files?.[0])
              }}
            />
            <p className="font-medium">Drop an image</p>
            <p className="text-sm text-muted-foreground">or click to browse (HEIC supported)</p>
          </div>

          <label className="grid gap-2 text-sm">
            Format
            <select
              className="rounded-md border border-input bg-background px-3 py-2"
              value={settings.mimeType}
              onChange={(event) => setSettings((prev) => ({ ...prev, mimeType: event.target.value }))}
            >
              <option value="image/webp">WebP (recommended)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG (lossless)</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            Quality {Math.round(settings.quality * 100)}%
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.01}
              value={settings.quality}
              onChange={(event) => setSettings((prev) => ({ ...prev, quality: Number(event.target.value) }))}
              disabled={settings.mimeType === "image/png"}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.keepOriginalSize}
              onChange={(event) => setSettings((prev) => ({ ...prev, keepOriginalSize: event.target.checked }))}
            />
            Keep original dimensions
          </label>

          {!settings.keepOriginalSize && (
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                Max width
                <input
                  className="rounded-md border border-input bg-background px-3 py-2"
                  type="number"
                  min={64}
                  max={8000}
                  value={settings.maxWidth}
                  onChange={(event) => setMaxWidthWithRatio(Number(event.target.value))}
                />
              </label>
              <label className="grid gap-1 text-sm">
                Max height
                <input
                  className="rounded-md border border-input bg-background px-3 py-2"
                  type="number"
                  min={64}
                  max={8000}
                  value={settings.maxHeight}
                  onChange={(event) => setMaxHeightWithRatio(Number(event.target.value))}
                />
              </label>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCompress} disabled={!file || isWorking}>
              {isWorking ? "Compressing…" : "Compress"}
            </Button>
            <Button
              variant="outline"
              disabled={!result}
              onClick={() => {
                if (!result) return
                const extension =
                  result.mimeType === "image/png"
                    ? "png"
                    : result.mimeType === "image/jpeg"
                      ? "jpg"
                      : "webp"
                const anchor = document.createElement("a")
                anchor.href = result.url
                anchor.download = `image-compressed.${extension}`
                anchor.click()
              }}
            >
              Download
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-background p-2 text-xs"><p className="text-muted-foreground">Before</p><p className="mt-1 text-sm">{beforeText}</p></div>
            <div className="rounded-md border border-border bg-background p-2 text-xs"><p className="text-muted-foreground">After</p><p className="mt-1 text-sm">{afterText}</p></div>
            <div className="rounded-md border border-border bg-background p-2 text-xs"><p className="text-muted-foreground">Dimensions</p><p className="mt-1 text-sm">{dimensionText}</p></div>
            <div className="rounded-md border border-border bg-background p-2 text-xs"><p className="text-muted-foreground">Output</p><p className="mt-1 text-sm">{outputText}</p></div>
            <div className="rounded-md border border-border bg-background p-2 text-xs"><p className="text-muted-foreground">Savings</p><p className="mt-1 text-sm">{changeInfo ? `${Math.abs(changeInfo.pct).toFixed(1)}%` : "—"}</p></div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-medium">Preview</h3>
        <div className="mt-3 flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-background p-3">
          {result?.url ? (
            <img src={result.url} alt="Compressed preview" className="max-h-[400px] w-full rounded object-contain" />
          ) : originalUrl ? (
            <img src={originalUrl} alt="Original preview" className="max-h-[400px] w-full rounded object-contain" />
          ) : (
            <p className="text-sm text-muted-foreground">No image</p>
          )}
        </div>
      </section>
    </div>
  )
}
