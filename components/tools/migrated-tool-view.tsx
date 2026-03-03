/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useMemo, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { FullPasswordGeneratorTool } from "@/components/tools/password-generator-full"
import { FullImageConverterTool } from "@/components/tools/image-converter-full"
import { FullImageCompressorTool } from "@/components/tools/image-compressor-full"
import { FullTimeConverterTool } from "@/components/tools/time-converter-full"
import { FullTextToPdfTool } from "@/components/tools/text-to-pdf-full"

type MigratedToolViewProps = {
  slug: string
}

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"

const cardClass = "rounded-xl border border-border bg-card p-4"

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function TimeConverterTool() {
  return <FullTimeConverterTool />
}

function PasswordGeneratorTool() {
  return <FullPasswordGeneratorTool />
}

function hexToHsl(hex: string) {
  const value = hex.replace("#", "")
  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
  }

  hue = Math.round(hue * 60)
  if (hue < 0) hue += 360

  const lightness = (max + min) / 2
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))

  return {
    h: hue,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  }
}

function hslToHex(h: number, s: number, l: number) {
  const sat = s / 100
  const light = l / 100
  const c = (1 - Math.abs(2 * light - 1)) * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = light - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, "0")

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function ColorHarmonyTool() {
  const [color, setColor] = useState("#6366f1")
  const hsl = useMemo(() => hexToHsl(color), [color])

  const harmonies = useMemo(
    () => [
      { label: "Base", color },
      { label: "Complementar", color: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l) },
      { label: "Análoga -", color: hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l) },
      { label: "Análoga +", color: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l) },
      { label: "Triádica 1", color: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l) },
      { label: "Triádica 2", color: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l) },
    ],
    [color, hsl.h, hsl.l, hsl.s]
  )

  return (
    <div className="grid gap-4">
      <div className={cardClass}>
        <label className="grid gap-2 text-sm sm:max-w-xs">
          Cor base
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background p-1" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {harmonies.map((item) => (
          <button
            key={item.label}
            className={cardClass}
            onClick={() => navigator.clipboard.writeText(item.color)}
            type="button"
          >
            <div className="h-16 rounded-md border border-border" style={{ backgroundColor: item.color }} />
            <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium">{item.color.toUpperCase()}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPaletteExtractorTool() {
  const [preview, setPreview] = useState<string | null>(null)
  const [palette, setPalette] = useState<string[]>([])
  const [colorCount, setColorCount] = useState(6)
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb" | "hsl">("hex")

  const rgbToHsl = (r: number, g: number, b: number) => {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const delta = max - min

    let h = 0
    if (delta !== 0) {
      if (max === rn) h = ((gn - bn) / delta) % 6
      else if (max === gn) h = (bn - rn) / delta + 2
      else h = (rn - gn) / delta + 4
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360

    const l = (max + min) / 2
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    return {
      h,
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const toDisplayColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    if (colorFormat === "rgb") {
      return `rgb(${r}, ${g}, ${b})`
    }

    if (colorFormat === "hsl") {
      const hsl = rgbToHsl(r, g, b)
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }

    return hex.toUpperCase()
  }

  const extractPalette = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const source = reader.result
      if (typeof source !== "string") return
      setPreview(source)

      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) return

        const max = 120
        const ratio = Math.min(1, max / Math.max(image.width, image.height))
        canvas.width = Math.max(1, Math.floor(image.width * ratio))
        canvas.height = Math.max(1, Math.floor(image.height * ratio))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        const data = context.getImageData(0, 0, canvas.width, canvas.height).data
        const buckets = new Map<string, number>()

        for (let index = 0; index < data.length; index += 4) {
          const alpha = data[index + 3]
          if (alpha < 120) continue
          const r = Math.round(data[index] / 32) * 32
          const g = Math.round(data[index + 1] / 32) * 32
          const b = Math.round(data[index + 2] / 32) * 32
          const key = `${r},${g},${b}`
          buckets.set(key, (buckets.get(key) ?? 0) + 1)
        }

        const colors = [...buckets.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, colorCount)
          .map(([rgb]) => {
            const [r, g, b] = rgb.split(",").map(Number)
            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
          })

        setPalette(colors)
      }
      image.src = source
    }

    reader.readAsDataURL(file)
  }

  const reExtract = () => {
    if (!preview) return
    fetch(preview)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "image.png", { type: blob.type || "image/png" })
        extractPalette(file)
      })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Color Palette Extractor</h2>
        <p className="text-sm text-muted-foreground">Extract beautiful color palettes from any image.</p>

        <div className="mt-4 grid gap-4">
          <label className="grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-10 text-sm hover:bg-accent">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) extractPalette(file)
              }}
            />
            <span className="font-medium">Drop an image</span>
            <span className="text-muted-foreground">or click to browse</span>
          </label>

          <label className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Number of colors</span>
              <span className="font-medium">{colorCount}</span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              value={colorCount}
              onChange={(event) => setColorCount(Number(event.target.value))}
            />
          </label>

          <div className="grid gap-2 text-sm">
            <span>Color format</span>
            <div className="grid grid-cols-3 gap-2">
              {(["hex", "rgb", "hsl"] as const).map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setColorFormat(format)}
                  className={`rounded-md border px-3 py-2 text-sm uppercase ${
                    colorFormat === format
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={reExtract} disabled={!preview}>Re-extract Colors</Button>

          <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            Click any color to copy its value to clipboard.
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Palette</h3>
          <Button variant="ghost" size="sm" onClick={() => {
            setPreview(null)
            setPalette([])
          }} disabled={!preview && palette.length === 0}>
            Clear
          </Button>
        </div>

        <div className="mt-4 min-h-[430px] rounded-lg border border-border bg-background p-3">
          {!preview ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-sm text-muted-foreground">
              Upload an image to extract colors
            </div>
          ) : (
            <div className="grid h-full gap-3">
              <img src={preview} alt="Preview" className="max-h-56 w-full rounded-md object-contain" />
              <div className="grid gap-2">
                {palette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => navigator.clipboard.writeText(toDisplayColor(color))}
                    className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-left hover:bg-accent"
                  >
                    <span className="h-8 w-8 shrink-0 rounded border border-border" style={{ backgroundColor: color }} />
                    <span className="font-mono text-sm">{toDisplayColor(color)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function QrGeneratorTool() {
  const [text, setText] = useState("")
  const [dataUrl, setDataUrl] = useState("")

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("")
      return
    }

    const timer = setTimeout(async () => {
      const url = await QRCode.toDataURL(text, { width: 512, margin: 2 })
      setDataUrl(url)
    }, 150)

    return () => clearTimeout(timer)
  }, [text])

  const downloadPng = async () => {
    if (!dataUrl) return
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    downloadBlob(blob, "qr-code.png")
  }

  return (
    <div className="grid gap-4">
      <div className={cardClass}>
        <label className="grid gap-2 text-sm">
          Link ou texto
          <textarea
            className={`${fieldClass} min-h-24`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Digite um URL, texto ou payload..."
          />
        </label>
      </div>

      <div className={`${cardClass} flex min-h-56 items-center justify-center`}>
        {dataUrl ? (
          <img src={dataUrl} alt="QR gerado" className="h-52 w-52 rounded-md border border-border" />
        ) : (
          <p className="text-sm text-muted-foreground">Digite algo para gerar o QR code.</p>
        )}
      </div>

      <div>
        <Button onClick={downloadPng} disabled={!dataUrl}>
          Download PNG
        </Button>
      </div>
    </div>
  )
}

function ImageConverterTool() {
  return <FullImageConverterTool />
}

function BgRemoverTool() {
  const [file, setFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRemove = async () => {
    if (!file) return
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image_file", file)
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Falha ao remover fundo")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      setResultUrl(objectUrl)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className={cardClass}>
        <input
          type="file"
          accept="image/*"
          className={fieldClass}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Requer `REMOVE_BG_API_KEY` configurada no servidor Next.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleRemove} disabled={!file || loading}>
          {loading ? "Processando..." : "Remover fundo"}
        </Button>
        <Button
          variant="outline"
          disabled={!resultUrl}
          onClick={async () => {
            if (!resultUrl) return
            const response = await fetch(resultUrl)
            const blob = await response.blob()
            downloadBlob(blob, "background-removed.png")
          }}
        >
          Baixar PNG
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {resultUrl && (
        <div className={cardClass}>
          <img src={resultUrl} alt="Resultado sem fundo" className="max-h-80 w-full rounded-md object-contain" />
        </div>
      )}
    </div>
  )
}

function ImageCompressorTool() {
  return <FullImageCompressorTool />
}

function TextToPdfTool() {
  return <FullTextToPdfTool />
}

function JsonFormatterTool() {
  const [value, setValue] = useState('{"project":"Dev Tools","owner":"Luan Taraschi"}')
  const [error, setError] = useState("")

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value)
      setValue(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "JSON inválido"
      setError(message)
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(value)
      setValue(JSON.stringify(parsed))
      setError("")
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "JSON inválido"
      setError(message)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
  }

  return (
    <div className="grid gap-4">
      <div className={cardClass}>
        <textarea className={`${fieldClass} min-h-72 font-mono text-xs`} value={value} onChange={(event) => setValue(event.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleFormat}>Formatar</Button>
        <Button variant="secondary" onClick={handleMinify}>Minificar</Button>
        <Button variant="outline" onClick={handleCopy}>Copiar</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function splitWords(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[\W_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function CaseConverterTool() {
  const [text, setText] = useState("hello world from dev tools")

  const words = useMemo(() => splitWords(text), [text])

  const lowerWords = words.map((word) => word.toLowerCase())
  const titleWords = lowerWords.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )

  const outputs = {
    camelCase:
      lowerWords.length === 0
        ? ""
        : lowerWords[0] + titleWords.slice(1).join(""),
    snake_case: lowerWords.join("_"),
    PascalCase: titleWords.join(""),
    "kebab-case": lowerWords.join("-"),
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className={cardClass}>
        <label className="grid gap-2 text-sm">
          Input text
          <textarea
            className={`${fieldClass} min-h-52`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste any text here"
          />
        </label>
      </section>

      <section className={cardClass}>
        <h3 className="font-medium">Converted cases</h3>
        <div className="mt-3 grid gap-2">
          {Object.entries(outputs).map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(value)}
                >
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm break-all">{value || "—"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function UuidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = () => {
    const list = Array.from({ length: count }, () => crypto.randomUUID())
    setUuids(list)
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <section className={cardClass}>
        <label className="grid gap-2 text-sm">
          Quantity: <span className="font-medium">{count}</span>
          <Slider
            min={1}
            max={50}
            step={1}
            value={[count]}
            onValueChange={(value) => setCount(value[0] ?? 1)}
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={generate}>Generate</Button>
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(uuids.join("\n"))}
            disabled={uuids.length === 0}
          >
            Copy all
          </Button>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="font-medium">UUID list</h3>
        <div className="mt-3 max-h-[420px] space-y-2 overflow-auto pr-1">
          {uuids.map((uuid) => (
            <div key={uuid} className="rounded-md border border-border bg-background p-2">
              <p className="font-mono text-xs break-all">{uuid}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function BoxShadowGlassmorphismTool() {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(18)
  const [blur, setBlur] = useState(40)
  const [spread, setSpread] = useState(-10)
  const [opacity, setOpacity] = useState(0.22)
  const [glassBlur, setGlassBlur] = useState(16)
  const [glassAlpha, setGlassAlpha] = useState(0.2)
  const [radius, setRadius] = useState(20)

  const shadowCss = `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity.toFixed(2)})`
  const glassCss = `background: rgba(255, 255, 255, ${glassAlpha.toFixed(2)}); backdrop-filter: blur(${glassBlur}px); border-radius: ${radius}px;`

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <section className={cardClass}>
        <h3 className="font-medium">Controls</h3>
        <div className="mt-3 space-y-3 text-sm">
          <label className="grid gap-2">X offset ({offsetX}px)<Slider min={-80} max={80} step={1} value={[offsetX]} onValueChange={(value) => setOffsetX(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Y offset ({offsetY}px)<Slider min={-80} max={80} step={1} value={[offsetY]} onValueChange={(value) => setOffsetY(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Blur ({blur}px)<Slider min={0} max={120} step={1} value={[blur]} onValueChange={(value) => setBlur(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Spread ({spread}px)<Slider min={-60} max={60} step={1} value={[spread]} onValueChange={(value) => setSpread(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Shadow opacity ({Math.round(opacity * 100)}%)<Slider min={0} max={1} step={0.01} value={[opacity]} onValueChange={(value) => setOpacity(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Glass blur ({glassBlur}px)<Slider min={0} max={40} step={1} value={[glassBlur]} onValueChange={(value) => setGlassBlur(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Glass alpha ({Math.round(glassAlpha * 100)}%)<Slider min={0.05} max={0.8} step={0.01} value={[glassAlpha]} onValueChange={(value) => setGlassAlpha(value[0] ?? 0)} /></label>
          <label className="grid gap-2">Radius ({radius}px)<Slider min={0} max={40} step={1} value={[radius]} onValueChange={(value) => setRadius(value[0] ?? 0)} /></label>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="font-medium">Live preview</h3>
        <div className="mt-3 rounded-xl border border-border bg-background p-8">
          <div className="grid place-items-center rounded-lg bg-linear-to-br from-cyan-500/40 to-purple-500/30 p-10">
            <div
              className="h-44 w-full max-w-sm border border-white/40"
              style={{
                boxShadow: shadowCss,
                backgroundColor: `rgba(255,255,255,${glassAlpha})`,
                backdropFilter: `blur(${glassBlur}px)`,
                borderRadius: `${radius}px`,
              }}
            />
          </div>
        </div>

        <div className="mt-3 rounded-md border border-border bg-background p-3">
          <p className="text-xs text-muted-foreground">CSS</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">{`box-shadow: ${shadowCss};\n${glassCss}`}</pre>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(`box-shadow: ${shadowCss};\n${glassCss}`)}
          >
            Copy CSS
          </Button>
        </div>
      </section>
    </div>
  )
}

function MeshGradientGeneratorTool() {
  const [angle, setAngle] = useState(135)
  const [colorA, setColorA] = useState("#7c3aed")
  const [colorB, setColorB] = useState("#06b6d4")
  const [colorC, setColorC] = useState("#ec4899")

  const cssValue = `linear-gradient(${angle}deg, ${colorA} 0%, ${colorB} 50%, ${colorC} 100%)`

  const randomize = () => {
    const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`
    setColorA(randomHex())
    setColorB(randomHex())
    setColorC(randomHex())
    setAngle(Math.floor(Math.random() * 360))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <section className={cardClass}>
        <h3 className="font-medium">Gradient controls</h3>
        <div className="mt-3 space-y-3 text-sm">
          <label className="grid gap-2">
            Angle ({angle}°)
            <Slider min={0} max={360} step={1} value={[angle]} onValueChange={(value) => setAngle(value[0] ?? 0)} />
          </label>

          <label className="grid gap-2">
            Color A
            <input type="color" value={colorA} onChange={(event) => setColorA(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background p-1" />
          </label>
          <label className="grid gap-2">
            Color B
            <input type="color" value={colorB} onChange={(event) => setColorB(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background p-1" />
          </label>
          <label className="grid gap-2">
            Color C
            <input type="color" value={colorC} onChange={(event) => setColorC(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background p-1" />
          </label>

          <Button onClick={randomize}>Randomize</Button>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="font-medium">Preview</h3>
        <div className="mt-3 min-h-[320px] rounded-xl border border-border" style={{ background: cssValue }} />
        <div className="mt-3 rounded-md border border-border bg-background p-3">
          <p className="text-xs text-muted-foreground">CSS</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">{`background: ${cssValue};`}</pre>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(`background: ${cssValue};`)}
          >
            Copy CSS
          </Button>
        </div>
      </section>
    </div>
  )
}

function ImageOcrTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [language, setLanguage] = useState("eng")
  const [result, setResult] = useState("")
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const runOcr = async () => {
    if (!file) return
    setLoading(true)
    setError("")
    setProgress(0)

    try {
      const Tesseract = await import("tesseract.js")
      const output = await Tesseract.recognize(file, language, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round((message.progress ?? 0) * 100))
          }
        },
      })
      setResult(output.data.text.trim())
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "OCR failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className={cardClass}>
        <h3 className="font-medium">Image OCR</h3>
        <div className="mt-3 grid gap-3">
          <input
            type="file"
            accept="image/*"
            className={fieldClass}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />

          <label className="grid gap-2 text-sm">
            Language
            <select
              className={fieldClass}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="eng">English</option>
              <option value="por">Portuguese</option>
            </select>
          </label>

          <div className="flex gap-2">
            <Button onClick={runOcr} disabled={!file || loading}>
              {loading ? "Extracting..." : "Extract text"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(result)}
              disabled={!result}
            >
              Copy text
            </Button>
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-xs text-muted-foreground">Detected text</p>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-sm">{result || "No text extracted yet."}</pre>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="font-medium">Preview</h3>
        <div className="mt-3 flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-background p-3">
          {preview ? (
            <img src={preview} alt="OCR preview" className="max-h-[390px] w-full object-contain" />
          ) : (
            <p className="text-sm text-muted-foreground">Upload an image to start OCR</p>
          )}
        </div>
      </section>
    </div>
  )
}

export function MigratedToolView({ slug }: MigratedToolViewProps) {
  if (slug === "time-converter") return <TimeConverterTool />
  if (slug === "password-generator") return <PasswordGeneratorTool />
  if (slug === "color-harmony") return <ColorHarmonyTool />
  if (slug === "color-palette-extractor") return <ColorPaletteExtractorTool />
  if (slug === "qr-generator") return <QrGeneratorTool />
  if (slug === "image-converter") return <ImageConverterTool />
  if (slug === "bg-remover") return <BgRemoverTool />
  if (slug === "image-compressor") return <ImageCompressorTool />
  if (slug === "text-to-pdf") return <TextToPdfTool />
  if (slug === "json-formatter") return <JsonFormatterTool />
  if (slug === "case-converter") return <CaseConverterTool />
  if (slug === "uuid-generator") return <UuidGeneratorTool />
  if (slug === "box-shadow-glassmorphism") return <BoxShadowGlassmorphismTool />
  if (slug === "mesh-gradient-generator") return <MeshGradientGeneratorTool />
  if (slug === "image-ocr") return <ImageOcrTool />

  return (
    <div className={cardClass}>
      <p className="text-sm text-muted-foreground">Ferramenta não encontrada.</p>
    </div>
  )
}
