/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function FullImageConverterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string>("")
  const [format, setFormat] = useState("image/png")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    return () => {
      if (output) URL.revokeObjectURL(output)
    }
  }, [output])

  async function convert() {
    if (!file) return

    setLoading(true)
    setError("")
    if (output) {
      URL.revokeObjectURL(output)
      setOutput("")
    }

    let sourceUrl: string | null = null

    try {
      const lowerName = file.name.toLowerCase()
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        lowerName.endsWith(".heic") ||
        lowerName.endsWith(".heif")

      let sourceBlob: Blob = file
      if (isHeic) {
        const { default: heic2any } = await import("heic2any")
        const converted = await heic2any({ blob: file, toType: format, quality: 0.95 })
        sourceBlob = Array.isArray(converted) ? converted[0] : converted
      }

      sourceUrl = URL.createObjectURL(sourceBlob)
      const outputBlob = await new Promise<Blob>((resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = image.naturalWidth || image.width
          canvas.height = image.naturalHeight || image.height

          const context = canvas.getContext("2d")
          if (!context) {
            reject(new Error("Canvas not supported"))
            return
          }

          if (format === "image/jpeg") {
            context.fillStyle = "#fff"
            context.fillRect(0, 0, canvas.width, canvas.height)
          }

          context.drawImage(image, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Conversion failed"))
                return
              }
              resolve(blob)
            },
            format,
            0.95
          )
        }

        image.onerror = () => reject(new Error("Failed to decode image"))
        image.src = sourceUrl as string
      })

      const nextUrl = URL.createObjectURL(outputBlob)
      setOutput(nextUrl)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Conversion failed"
      setError(message)
    } finally {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl)
      }
      setLoading(false)
    }
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) {
      setFile(dropped)
      if (output) {
        URL.revokeObjectURL(output)
        setOutput("")
      }
    }
  }

  return (
    <div className="grid gap-4">
      <section
        className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-4"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <h2 className="text-lg font-semibold">Image Converter</h2>
        <p className="text-sm text-muted-foreground">Convert JPG, PNG, WEBP. HEIC supported as input.</p>

        <div className="mt-4 grid gap-3">
          <label className="cursor-pointer rounded-md border border-dashed border-border bg-background px-4 py-3 text-sm hover:bg-accent">
            <input
              type="file"
              hidden
              accept="image/*,.heic,.HEIC,.heif,.HEIF"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null
                setFile(selected)
                if (output) {
                  URL.revokeObjectURL(output)
                  setOutput("")
                }
              }}
            />
            {file ? "✓ Image selected" : "Click to choose or drop HEIC"}
          </label>

          <label className="grid gap-2 text-sm">
            Output format
            <select className="rounded-md border border-input bg-background px-3 py-2" value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={convert} disabled={!file || loading}>
              {!file ? "Select an image" : loading ? "Converting…" : "Convert"}
            </Button>

            {output && (
              <a
                href={output}
                download={`converted.${format.split("/")[1]}`}
                className="inline-flex h-9 items-center rounded-md border border-input px-4 text-sm"
              >
                Download image
              </a>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {output && (
            <div className="rounded-md border border-border bg-background p-2">
              <img src={output} alt="Converted output" className="max-h-80 w-full rounded object-contain" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
