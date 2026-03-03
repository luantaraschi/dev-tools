"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dices, Hash, RefreshCcw } from "lucide-react"

export function FullRandomDrawerTool() {
  const [activeTab, setActiveTab] = useState<"names" | "numbers" | "roulette">("names")

  return (
    <div className="grid gap-6">
      <div className="flex w-full items-center justify-start gap-2 overflow-x-auto rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-2">
        <Button
          variant={activeTab === "names" ? "default" : "ghost"}
          onClick={() => setActiveTab("names")}
          className="gap-2 shrink-0"
        >
          <RefreshCcw className="h-4 w-4" />
          Sorteador de Nomes
        </Button>
        <Button
          variant={activeTab === "numbers" ? "default" : "ghost"}
          onClick={() => setActiveTab("numbers")}
          className="gap-2 shrink-0"
        >
          <Hash className="h-4 w-4" />
          Sorteador de Números
        </Button>
        <Button
          variant={activeTab === "roulette" ? "default" : "ghost"}
          onClick={() => setActiveTab("roulette")}
          className="gap-2 shrink-0"
        >
          <Dices className="h-4 w-4" />
          Roleta
        </Button>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-4 sm:p-6 lg:p-8">
        {activeTab === "names" && <NameDrawer />}
        {activeTab === "numbers" && <NumberDrawer />}
        {activeTab === "roulette" && <RouletteDrawer />}
      </div>
    </div>
  )
}

function NameDrawer() {
  const [names, setNames] = useState("")
  const [drawCount, setDrawCount] = useState(1)
  const [noRepeat, setNoRepeat] = useState(true)
  const [results, setResults] = useState<string[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const handleDraw = () => {
    const list = names
      .split(/,|\n/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (list.length === 0) return

    setIsDrawing(true)
    setTimeout(() => {
      let drawn: string[] = []
      if (noRepeat) {
        const shuffled = [...list].sort(() => Math.random() - 0.5)
        drawn = shuffled.slice(0, Math.min(drawCount, shuffled.length))
      } else {
        for (let i = 0; i < drawCount; i++) {
          const randomIndex = Math.floor(Math.random() * list.length)
          drawn.push(list[randomIndex])
        }
      }
      setResults(drawn)
      setIsDrawing(false)
    }, 600) // Small delay for effect
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold">Sortear</span>
        <input
          type="number"
          min="1"
          value={drawCount}
          onChange={(e) => setDrawCount(Number(e.target.value) || 1)}
          className="w-20 rounded-md border border-input bg-background px-3 py-1.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="font-semibold">nome(s)</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Digite os nomes separados por vírgula ou linha:</label>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="joao, guilherme, vagner..."
          className="min-h-[160px] w-full resize-y rounded-md border border-input bg-background p-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={noRepeat ? "default" : "outline"}
          onClick={() => setNoRepeat(!noRepeat)}
          className="rounded-full"
          size="sm"
        >
          {noRepeat ? "✓ Não repetir nomes" : "Permitir repetição"}
        </Button>
      </div>

      <Button onClick={handleDraw} disabled={isDrawing || !names.trim()} className="w-full text-base h-12">
        {isDrawing ? "Sorteando..." : "Sortear"}
      </Button>

      {results.length > 0 && (
        <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in">
          <h3 className="mb-4 text-center text-lg font-bold">Resultado:</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {results.map((res, i) => (
              <span key={i} className="rounded-xl border border-border bg-muted/50 px-6 py-3 text-xl font-bold text-primary shadow-sm">
                {res}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NumberDrawer() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [drawCount, setDrawCount] = useState(1)
  const [noRepeat, setNoRepeat] = useState(true)
  const [results, setResults] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const handleDraw = () => {
    if (min > max) return // Ignore invalid range

    setIsDrawing(true)
    setTimeout(() => {
      const rangeSize = max - min + 1
      const count = noRepeat ? Math.min(drawCount, rangeSize) : drawCount
      
      const drawn: number[] = []
      if (noRepeat) {
        const available = Array.from({ length: rangeSize }, (_, i) => min + i)
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * available.length)
          drawn.push(available[randomIndex])
          available.splice(randomIndex, 1)
        }
      } else {
        for (let i = 0; i < count; i++) {
          drawn.push(Math.floor(Math.random() * rangeSize) + min)
        }
      }
      setResults(drawn)
      setIsDrawing(false)
    }, 600)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-semibold">Sortear</span>
        <input
          type="number"
          min="1"
          value={drawCount}
          onChange={(e) => setDrawCount(Number(e.target.value) || 1)}
          className="w-20 rounded-md border border-input bg-background px-3 py-1.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="font-semibold">número(s)</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Mínimo</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-32 rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Máximo</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-32 rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={noRepeat ? "default" : "outline"}
          onClick={() => setNoRepeat(!noRepeat)}
          className="rounded-full"
          size="sm"
        >
          {noRepeat ? "✓ Não repetir números" : "Permitir repetição"}
        </Button>
      </div>

      <Button onClick={handleDraw} disabled={isDrawing || min > max} className="w-full text-base h-12">
        {isDrawing ? "Sorteando..." : "Sortear"}
      </Button>

      {results.length > 0 && (
        <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in">
          <h3 className="mb-4 text-center text-lg font-bold">Resultado:</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {results.map((res, i) => (
              <span key={i} className="rounded-xl border border-border bg-muted/50 px-6 py-3 text-2xl font-black text-primary shadow-sm">
                {res}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RouletteDrawer() {
  const [names, setNames] = useState("Opção 1, Opção 2, Opção 3, Opção 4")
  const [winner, setWinner] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const currentRotation = useRef(0)
  const animationRef = useRef<number>(null)

  const items = names
    .split(/,|\n/)
    .map((n) => n.trim())
    .filter((n) => n.length > 0)

  const colors = [
    "#f87171", "#fb923c", "#fbbf24", "#facc15", "#a3e635", "#4ade80", 
    "#34d399", "#2dd4bf", "#38bdf8", "#60a5fa", "#818cf8", "#a78bfa"
  ]

  const drawWheel = (rotation: number = 0) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, width, height)

    if (items.length === 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#e2e8f0"
      ctx.fill()
      ctx.stroke()
      return
    }

    const arc = (2 * Math.PI) / items.length

    for (let i = 0; i < items.length; i++) {
      const angle = rotation + i * arc
      ctx.beginPath()
      ctx.fillStyle = colors[i % colors.length]
      
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, angle, angle + arc)
      ctx.lineTo(centerX, centerY)
      ctx.fill()
      ctx.stroke()

      // Text inside
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle + arc / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "#000"
      ctx.font = "bold 16px sans-serif"
      ctx.fillText(items[i], radius - 20, 5)
      ctx.restore()
    }
    
    // Middle dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.stroke()
  }

  useEffect(() => {
    drawWheel(currentRotation.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names])

  const handleSpin = () => {
    if (items.length < 2 || isSpinning) return

    setIsSpinning(true)
    setWinner(null)
    
    // Choose winner randomly
    const winnerIndex = Math.floor(Math.random() * items.length)
    
    // Calculate final rotation so the winner ends up at the right edge
    const arc = (2 * Math.PI) / items.length
    // We want the middle of the winning arc to be at 0 degrees (pointing right)
    const winningAngleOffset = -(winnerIndex * arc + arc / 2)
    
    // Spin for multiple full rotations + offset
    const spins = 5 + Math.random() * 3
    const targetRotation = currentRotation.current + (spins * 2 * Math.PI) + winningAngleOffset
    
    const duration = 4000
    const startObj = { time: performance.now(), rot: currentRotation.current }

    const animate = (time: number) => {
      const elapsed = time - startObj.time
      const progress = Math.min(elapsed / duration, 1) // 0 to 1
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      currentRotation.current = startObj.rot + (targetRotation - startObj.rot) * easeOut
      drawWheel(currentRotation.current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Normalise rotation
        currentRotation.current = currentRotation.current % (2 * Math.PI)
        setIsSpinning(false)
        setWinner(items[winnerIndex])
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
      <div className="flex-1 space-y-4">
        <label className="text-sm font-medium">Itens da Roleta (separados por vírgula ou linha):</label>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="Opção 1, Opção 2..."
          className="min-h-[220px] w-full resize-y rounded-md border border-input bg-background p-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button onClick={handleSpin} disabled={isSpinning || items.length < 2} className="w-full text-base h-12">
          {isSpinning ? "Girando..." : "Girar Roleta"}
        </Button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center">
        {/* Pointer on the right pointing LEFT: */}
        <div className="pointer-events-none absolute right-[0%] top-1/2 z-10 h-0 w-0 -translate-y-1/2 border-y-[15px] border-r-[20px] border-y-transparent border-r-primary drop-shadow-lg" />
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="aspect-square w-full max-w-[300px] sm:max-w-[400px]"
        />
        
        {winner && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
            <span className="mb-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">Sorteado!</span>
            <span className="rounded-xl border border-primary/20 bg-background px-6 py-4 text-3xl font-black text-primary shadow-2xl">
              {winner}
            </span>
            <Button variant="outline" className="mt-6" onClick={() => setWinner(null)}>
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
