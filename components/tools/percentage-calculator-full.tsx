"use client"

import { useState } from "react"

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
const cardClass = "rounded-xl border border-border/60 bg-card/60 backdrop-blur-2xl p-6"

export function FullPercentageCalculatorTool() {
  // Option 1: What is X% of Y?
  const [opt1_x, setOpt1_x] = useState<string>("")
  const [opt1_y, setOpt1_y] = useState<string>("")
  
  // Option 2: X is what percent of Y?
  const [opt2_x, setOpt2_x] = useState<string>("")
  const [opt2_y, setOpt2_y] = useState<string>("")
  
  // Option 3: Percentage increase/decrease from X to Y
  const [opt3_x, setOpt3_x] = useState<string>("")
  const [opt3_y, setOpt3_y] = useState<string>("")

  const renderResult = (value: number | undefined | null, suffix: string = "") => {
    if (value === undefined || value === null || isNaN(value)) return "..."
    return (Number.isInteger(value) ? value : value.toFixed(2)) + suffix
  }

  const calc1 = opt1_x && opt1_y ? (parseFloat(opt1_x) * parseFloat(opt1_y)) / 100 : null
  const calc2 = opt2_x && opt2_y && parseFloat(opt2_y) !== 0 ? (parseFloat(opt2_x) / parseFloat(opt2_y)) * 100 : null
  
  let calc3: number | null = null
  let calc3Text = "Increase"
  if (opt3_x && opt3_y && parseFloat(opt3_x) !== 0) {
    const from = parseFloat(opt3_x)
    const to = parseFloat(opt3_y)
    const change = to - from
    calc3 = (change / Math.abs(from)) * 100
    calc3Text = change >= 0 ? "Increase" : "Decrease"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Container 1 */}
      <div className={cardClass}>
        <h3 className="mb-4 text-base font-semibold">What is % of a value?</h3>
        <div className="flex items-center gap-2">
          <span>What is</span>
          <input
            type="number"
            className={fieldClass}
            placeholder="X"
            value={opt1_x}
            onChange={(e) => setOpt1_x(e.target.value)}
          />
          <span>%</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span>of</span>
          <input
            type="number"
            className={fieldClass}
            placeholder="Y"
            value={opt1_y}
            onChange={(e) => setOpt1_y(e.target.value)}
          />
          <span>?</span>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border bg-muted/50 p-4">
          <span className="text-sm text-muted-foreground">Result</span>
          <span className="text-2xl font-bold text-primary">{renderResult(calc1)}</span>
        </div>
      </div>

      {/* Container 2 */}
      <div className={cardClass}>
        <h3 className="mb-4 text-base font-semibold">X is what % of Y?</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={fieldClass}
            placeholder="X"
            value={opt2_x}
            onChange={(e) => setOpt2_x(e.target.value)}
          />
          <span className="shrink-0">is what %</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span>of</span>
          <input
            type="number"
            className={fieldClass}
            placeholder="Y"
            value={opt2_y}
            onChange={(e) => setOpt2_y(e.target.value)}
          />
          <span>?</span>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border bg-muted/50 p-4">
          <span className="text-sm text-muted-foreground">Result</span>
          <span className="text-2xl font-bold text-primary">{renderResult(calc2, "%")}</span>
        </div>
      </div>

      {/* Container 3 */}
      <div className={cardClass}>
        <h3 className="mb-4 text-base font-semibold">Percentage Change</h3>
        <div className="flex items-center gap-2">
          <span className="shrink-0">From</span>
          <input
            type="number"
            className={fieldClass}
            placeholder="X"
            value={opt3_x}
            onChange={(e) => setOpt3_x(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="shrink-0">to</span>
          <input
            type="number"
            className={fieldClass}
            placeholder="Y"
            value={opt3_y}
            onChange={(e) => setOpt3_y(e.target.value)}
          />
        </div>
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border bg-muted/50 p-4">
          <span className="text-sm text-muted-foreground">{calc3Text}</span>
          <span className="text-2xl font-bold text-primary">
            {calc3 !== null ? Math.abs(calc3).toFixed(2) + "%" : "..."}
          </span>
        </div>
      </div>
    </div>
  )
}
